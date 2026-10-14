---
title: "Gérer ses secrets avec Chezmoi et les Service Accounts 1Password"
slug: gerer-ses-secrets-avec-chezmoi-et-les-service-accounts-1password
date: 2026-05-07
author: "Nicolas Rouanne"
---

J'utilise [chezmoi](https://www.chezmoi.io/) pour gérer mes dotfiles entre machines, avec les secrets stockés dans 1Password. Jusqu'à récemment, tout passait par mon compte personnel 1Password. Ça marchait bien pour moi seul, mais quand j'ai commencé à donner accès à la CLI `op` à des agents IA (Claude Code), j'ai réalisé qu'ils pouvaient voir _tous les vaults_ de mon compte. Pas idéal.

Voici comment j'ai migré vers les Service Accounts 1Password pour isoler les agents aux seuls secrets dont ils ont besoin.

## Le setup d'avant

Mon repo dotfiles contient des templates chezmoi. Le principal est `dot_zshrc.tmpl`, qui génère `~/.zshrc` avec les secrets injectés au moment de l'apply. Le flux était :

1. Chezmoi lit les secrets depuis 1Password via `onepasswordRead`
2. Les secrets sont intégrés dans le `~/.zshrc` généré comme variables d'environnement
3. Les serveurs MCP (Notion, Slack, Toggl) lisent ces variables au démarrage

Le template ressemblait à ça :

```bash
export NOTION_TOKEN_WORK="{{ onepasswordRead "op://Qraft/chezmoi_notion_work/api_key" "my.1password.eu" }}"
export SLACK_QRAFT_USER_TOKEN="{{ onepasswordRead "op://Qraft/chezmoi_slack-qraft/user_token" "my.1password.eu" }}"
export TOGGL_API_TOKEN="{{ onepasswordRead "op://Qraft/chezmoi_toggl/api_token" "my.1password.eu" }}"
```

Tous les secrets vivaient dans mon vault personnel `Qraft`. Chezmoi se connectait à `my.1password.eu` via ma session personnelle, qui nécessitait l'auth biométrique (Touch ID).

Le problème : quand Claude Code exécutait des commandes `op`, il utilisait cette même session et pouvait accéder à _tous_ mes vaults.

## La solution : un vault dédié et un service account

La correction tient en trois parties :

### 1. Créer un vault dédié

J'ai créé un vault appelé `AI Agents` dans 1Password et copié les items concernés dedans :

- `chezmoi_notion_personal` / `chezmoi_notion_work` (clés API Notion)
- `chezmoi_slack-qraft` / `chezmoi_slack-episto` (tokens Slack)
- `chezmoi_toggl` (token API Toggl)
- `chezmoi_langfuse` (clés Langfuse)

C'est une copie simple. 1Password ne supporte pas la hiérarchie de vaults, donc les conventions de nommage font le travail.

### 2. Créer un service account

Dans l'UI web 1Password : **Settings > Developer > Service Accounts**. J'ai créé `sa-claude-code` avec accès lecture/écriture au vault `AI Agents` uniquement.

Le service account fournit un token (`ops_...`) qui s'authentifie de manière non-interactive. Pas de Touch ID, pas de MFA, pas de session personnelle. Mais il ne peut voir que les vaults qu'on lui assigne.

### 3. Mettre à jour chezmoi pour utiliser le service account

Deux fichiers modifiés.

**`.chezmoi.toml.tmpl`** — passer du compte personnel au mode service :

```toml
sourceDir = "{{ .chezmoi.homeDir }}/dev/dotfiles"

\[onepassword\]
  mode = "service"
```

Quand `mode = "service"`, chezmoi utilise la variable d'environnement `OP_SERVICE_ACCOUNT_TOKEN` au lieu d'une session interactive.

**`dot_zshrc.tmpl`** — charger le token depuis le Keychain macOS et pointer vers le nouveau vault :

```bash
# Charger le token SA depuis le Keychain (pas de prompt interactif)
export OP_SERVICE_ACCOUNT_TOKEN=$(security find-generic-password -a "sa-claude-code" -s "1password-service-account" -w)

# Les secrets viennent maintenant du vault AI Agents
export NOTION_TOKEN_WORK="{{ onepasswordRead "op://AI Agents/chezmoi_notion_work/api_key" }}"
export SLACK_QRAFT_USER_TOKEN="{{ onepasswordRead "op://AI Agents/chezmoi_slack-qraft/user_token" }}"
```

Le paramètre de compte (`"my.1password.eu"`) n'est plus nécessaire — le mode service ne l'utilise pas.

## Le problème de bootstrap

Il y a un problème de poule et d'œuf : chezmoi a besoin de `OP_SERVICE_ACCOUNT_TOKEN` pour générer le zshrc, mais c'est le zshrc qui charge ce token depuis le Keychain.

Pour une machine neuve, il faut définir le token manuellement d'abord :

```bash
# Stocker le token dans le Keychain
security add-generic-password -a "sa-claude-code" -s "1password-service-account" -w "ops_..."

# L'exporter pour le premier run
export OP_SERVICE_ACCOUNT_TOKEN=$(security find-generic-password -a "sa-claude-code" -s "1password-service-account" -w)

# Puis init chezmoi
chezmoi init --apply https://github.com/your/dotfiles.git
```

Après ce premier apply, chaque nouveau shell charge le token automatiquement.

## Ce que je retiens

**Ce qui marche bien :**

- Les agents sont totalement isolés — `op vault list` avec le token SA ne montre que `AI Agents`
- Pas de prompts interactifs — `chezmoi apply` tourne silencieusement
- Ma session 1Password perso reste indépendante pour mon usage direct
- Le token du service account n'est pas dans le contrôle de version (il est dans le Keychain macOS)

**Limites :**

- 1Password n'a pas de hiérarchie de vaults. On ne peut pas faire `Agents/Qraft`, `Agents/Episto`. C'est une liste plate, donc les conventions de nommage comptent.
- Les service accounts ne peuvent pas être créés via la CLI — il faut passer par l'UI web
- L'approche Keychain sur macOS ne demande pas d'auth biométrique pour `security find-generic-password -w`, ce qui est à la fois le but et le compromis

## En pratique

Si vous donnez accès à `op` à des agents IA, ne les laissez pas utiliser votre session personnelle. Créez un service account, limitez-le à un vault dédié, et stockez le token quelque part qui ne nécessite pas d'auth interactive. Ça prend environ 15 minutes et l'isolation en vaut la peine.
