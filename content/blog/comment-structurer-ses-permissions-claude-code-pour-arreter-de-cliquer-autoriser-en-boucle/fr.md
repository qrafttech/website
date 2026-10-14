---
title: "Comment structurer ses permissions Claude Code pour arrêter de cliquer \"Autoriser\" en boucle"
slug: comment-structurer-ses-permissions-claude-code-pour-arreter-de-cliquer-autoriser-en-boucle
date: 2026-02-19
author: "Adrien Lupo"
---

**Auteur :** Adrien Lupo

**Date :** 19 février 2026

---

À force de cliquer sur "autoriser" en boucle, on ne lit plus rien. Le signal se noie dans le bruit -- et c'est là que le risque commence. Mardi matin chez Qraft, on a pris 30 minutes pour parler permissions dans Claude Code. Je vous partage ce qui en est ressorti.

---

## Le problème : la fatigue du clic

Quand on lance Claude Code pour la première fois, chaque action demande une confirmation. Lire un fichier ? Confirmer. Lancer un test ? Confirmer. Faire un `git status` ? Confirmer.

Au bout de 10 minutes, on ne lit plus les prompts. On clique "Yes" par réflexe. Et c'est exactement le scénario qu'on veut éviter : un agent qui exécute une commande sensible pendant qu'on regarde ailleurs.

Des permissions bien paramétrées, ça change tout :

- L'agent ne t'interrompt que quand c'est nécessaire
- On passe d'un projet à l'autre avec plus de fluidité
- Les informations sensibles et les commandes risquées restent hors de portée

---

## Les 3 scopes de permissions

Les permissions vivent à différents endroits. Les scopes plus spécifiques ont la priorité.

| **Scope** | **Fichier** | **Usage** |
| --- | --- | --- |
| User | `~/.claude/settings.json` | Préférences globales, appliquées à tous vos projets |
| Projet (équipe) | `.claude/settings.json` | Partagé avec l'équipe, versionné dans Git |
| Projet (local) | `.claude/settings.local.json` | Personnel, non partagé -- stocke les "Yes, do not ask again" |

L'ordre de précédence : **local > projet versionné > user**. Un deny au niveau projet écrase un allow au niveau user.

> [!NOTE]
> Le `settings.local.json` se remplit automatiquement quand tu cliques "Yes, do not ask again". C'est pratique, mais ça peut vite devenir un fourre-tout de règles qu'on ne maîtrise plus.

---

## Deny, Ask, Allow : l'ordre compte

Dans chaque fichier, 3 types de règles :

- **Deny** : bloque l'outil spécifié. Claude n'y a jamais accès, aucune exception.
- **Ask** : confirmation systématique à chaque utilisation.
- **Allow** : utilise l'outil spécifié sans approbation manuelle.

Les règles sont évaluées dans cet ordre : **deny > ask > allow**. Les règles deny gagnent toujours.

C'est ce qui permet la stratégie que j'utilise : des **allow larges** qui sont "attrapés" par des **ask spécifiques** avant d'être atteints.

---

## Ma config User : un exemple commenté

### Deny : les lignes rouges

```json
"deny": [
    // Secrets récursifs (** = toute profondeur)
    "Read(**/.env)", "Read(**/.env.*)", "Read(**/secrets/**)",
    // Credentials home directory
    "Read(~/.ssh/**)", "Read(~/.aws/**)",
    "Read(~/.git-credentials)", "Read(~/.npmrc)",
    "Read(~/.netrc)", "Read(~/.config/gh/hosts.yml)",
    // Réseau
    "Bash(curl *)", "Bash(wget *)",
    // Accès credentials système
    "Bash(security *)", "Bash(gh auth token)",
    "Bash(printenv)", "Bash(printenv *)", "Bash(env)",
    // Secrets via git history
    "Bash(git show *:.env)", "Bash(git show *:.env.*)",
    // grep/find sur fichiers sensibles
    "Bash(grep *.env*)", "Bash(grep */.env*)",
    "Bash(grep *secrets/*)", "Bash(grep */.ssh/*)",
    "Bash(find */.env*)", "Bash(find */.ssh/*)"
]
```

Secrets, réseau, credentials. Tout ce qui pourrait fuiter des informations sensibles est bloqué. J'ai aussi bloqué `curl` et `wget` -- pas de requêtes réseau non contrôlées.

> [!NOTE]
> Les patterns utilisent des globs : `**` matche à toute profondeur, `*` matche dans un seul niveau. `Read(**/.env)` bloque la lecture de tout fichier `.env` dans n'importe quel sous-dossier.

### Ask : les actions à superviser

```json
"ask": [
    // Git destructif / visible
    "Bash(git push *)", "Bash(git reset --hard *)",
    "Bash(git clean *)", "Bash(git branch -D *)",
    // Installation de dépendances
    "Bash(npm install *)", "Bash(npm i *)", "Bash(npm ci *)",
    "Bash(yarn add *)", "Bash(yarn install *)",
    "Bash(pnpm install *)", "Bash(pnpm add *)",
    "Bash(brew install *)", "Bash(brew uninstall *)",
    // Docker exécution
    "Bash(docker run *)", "Bash(docker build *)",
    // GH CLI
    "Bash(gh pr merge *)",
    // Accès distant
    "Bash(ssh *)", "Bash(scp *)", "Bash(sftp *)"
]
```

Ce sont les commandes qui méritent un regard humain : ce qui modifie l'historique Git, ce qui installe des paquets, ce qui merge une PR. Pas besoin de bloquer, mais pas question de laisser passer sans validation.

### Allow : le reste peut passer

```json
"allow": [
    // Outils dev -- patterns larges
    "Bash(git *)", "Bash(gh *)",
    "Bash(npm *)", "Bash(npx *)",
    "Bash(yarn *)", "Bash(pnpm *)",
    "Bash(brew *)", "Bash(docker *)",

    // Lecture de fichiers -- pattern global
    "Read(**)",

    // Utilitaires système
    "Bash(ls *)", "Bash(find *)", "Bash(grep *)",
    "Bash(tree *)", "Bash(which *)", "Bash(pwd)",

    // Web (45 domaines sélectionnés)
    "WebSearch",
    "WebFetch(domain:docs.anthropic.com)", // + 44 domaines

    // MCP read-only EXPLICITE
    "mcp__github__get_issue",       // + 25 tools GitHub read-only
    "mcp__notion__notion-fetch",    // + 4 tools Notion read-only
    "mcp__chrome-devtools__list_pages" // + 11 tools DevTools observation
]
```

J'autorise les outils par pattern large. `Bash(git *)` autorise toutes les commandes git -- mais `git push` et `git reset --hard` sont interceptés par les règles `ask` avant d'atteindre cet allow.

Pour les MCP, c'est l'inverse : j'autorise les tools **au cas par cas**, en read-only uniquement. Chaque tool d'écriture reste en ask par défaut.

> [!NOTE]
> L'astuce : les règles `deny` et `ask` agissent comme des filtres avant l'`allow`. Tu peux avoir un allow large (`Bash(git *)`) tout en gardant le contrôle sur les sous-commandes sensibles (`git push`, `git reset --hard`).

---

## 3 tips pour garder sa config propre

### 1. Structurer ses settings avec Deny / Ask / Allow

Chaque fichier doit avoir une intention claire. Mon approche :

- **User** (`~/.claude/settings.json`) : les règles de sécurité globales (deny sur les secrets, ask sur les commandes destructives, allow sur les outils courants)
- **Projet équipe** (`.claude/settings.json`) : les conventions partagées (linter, test runner, scripts spécifiques)
- **Projet local** (`.claude/settings.local.json`) : mes préférences personnelles sur ce projet

### 2. Faire une passe régulière sur le settings.local.json

C'est le fichier qui grossit tout seul. À chaque "Yes, do not ask again", une nouvelle règle s'ajoute. Régulièrement :

- Supprimer ce qui n'est plus d'actualité ou en doublon
- Remonter au niveau user ou projet versionné ce qui fait sens à plus large échelle

### 3. Garder ces fichiers vivants

Une config de permissions, ça se maintient. Si une autorisation revient souvent sans être justifiée, ou si une action non désirée passe : c'est le signal qu'il faut refaire une passe.

---

## Ce qu'il faut retenir

- Les permissions se configurent à 3 niveaux : user, projet équipe, projet local
- L'évaluation suit l'ordre **deny > ask > allow** -- deny gagne toujours
- La stratégie "allow large + ask spécifique" donne le meilleur ratio fluidité/sécurité
- Le `settings.local.json` se remplit tout seul : nettoyez-le régulièrement

---

_30 minutes de discussion un mardi matin, une passe sur nos configs, et on a tous gagné du temps pour le reste de la semaine._
