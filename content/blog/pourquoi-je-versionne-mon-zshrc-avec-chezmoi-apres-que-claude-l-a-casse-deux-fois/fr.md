---
title: "Pourquoi je versionne mon .zshrc avec chezmoi (après que Claude l'a cassé deux fois)"
slug: pourquoi-je-versionne-mon-zshrc-avec-chezmoi-apres-que-claude-l-a-casse-deux-fois
date: 2026-03-09
author: "Nicolas Rouanne"
---

**Auteur :** Nicolas Rouanne

**Date :** 9 mars 2026

---

J'utilise Claude Code au quotidien. C'est un super outil pour écrire du code, mais il a un défaut agaçant : il lui arrive de modifier mon `.zshrc` et de casser des choses. La semaine dernière, il a supprimé un alias que j'utilise en permanence — `cc` pour `claude --worktree`. La semaine d'avant, il avait cassé ma config shell autrement. À chaque fois, j'ai dû réparer à la main.

C'est ce qui m'a décidé. Il fallait que mes dotfiles soient versionnés, pour pouvoir détecter et annuler tout changement accidentel. Ça faisait un moment que j'y pensais — c'était le coup de pouce qu'il me fallait.

## Choisir un outil

J'ai regardé deux options :

- **GNU Stow** — un gestionnaire de symlinks ultra simple. On organise ses fichiers dans un dossier, on lance `stow`, et il crée les symlinks dans `$HOME`.
- **chezmoi** — un gestionnaire de dotfiles complet avec templating, gestion des secrets et support multi-machines.

J'ai choisi chezmoi parce que mon `.zshrc` contient des clés API (Notion, Slack) que je ne voulais pas dans un repo git. chezmoi a une intégration native avec 1Password, ce qui résout le problème proprement.

## La mise en place

Installer chezmoi et ajouter son premier fichier :

```bash
brew install chezmoi
chezmoi add ~/.zshrc
```

chezmoi copie le fichier dans son répertoire source. Pour utiliser les templates (pour les secrets), on renomme en `.tmpl` :

```bash
mv ~/.local/share/chezmoi/dot_zshrc ~/.local/share/chezmoi/dot_zshrc.tmpl
```

Puis on remplace les secrets en dur par des références 1Password :

```bash
# Avant
export NOTION_API_KEY="ntn_F900..."

# Après
export NOTION_API_KEY="{{ onepasswordRead "op://Qraft/chezmoi_notion/api_key" "my.1password.eu" }}"
```

Quand on lance `chezmoi apply`, il appelle le CLI 1Password, résout les secrets via l'authentification biométrique, et écrit les vraies valeurs dans `~/.zshrc`.

## Convention de nommage 1Password

Je stocke les secrets dans mon coffre 1Password avec le préfixe `chezmoi_` :

- `chezmoi_notion` → champ `api_key`
- `chezmoi_slack-qraft` → champ `user_token`
- `chezmoi_slack-episto` → champ `user_token`

Le format d'URI `op://` est `op://Coffre/Item/Champ`. Un piège : ne pas utiliser `/` dans les noms d'items — 1Password l'interprète comme un séparateur de chemin. J'avais d'abord essayé `chezmoi/notion` et ça échouait. `chezmoi_notion` fonctionne très bien.

## Ce que je versionne

J'ai fini par ajouter bien plus que le `.zshrc` :

- `.zshrc` (avec template, secrets depuis 1Password)
- `.gitconfig` (aliases, signature GPG, éditeur)
- `.gitignore_global`
- `.config/starship.toml`
- `.ssh/config`
- `settings.json` et `keybindings.json` de Cursor
- Un `Brewfile` pour tous les packages Homebrew

## Gérer les packages Homebrew

chezmoi a un pattern de script `run_onchange_` — il exécute un script chaque fois que son contenu change. Je l'utilise pour lancer `brew bundle` automatiquement :

```bash
# run_onchange_before_install-packages-darwin.sh.tmpl
brew bundle --no-upgrade --file={{ joinPath .chezmoi.sourceDir "Brewfile" | quote }}
```

Le Brewfile vit à côté des dotfiles. Pour ajouter un nouveau package :

```bash
brew install jq
brew-sync          # alias qui lance brew bundle dump
# commit quand on est prêt
```

## Répertoire source personnalisé

Par défaut, chezmoi stocke les fichiers dans `~/.local/share/chezmoi/`. J'ai déplacé les miens dans `~/dev/dotfiles/` pour un accès plus facile. Un fichier `.chezmoi.toml.tmpl` dans le repo configure ça automatiquement sur les nouvelles machines :

```toml
sourceDir = "{{ .chezmoi.homeDir }}/dev/dotfiles"

[onepassword]
  account = "my.1password.eu"
```

## Setup d'une nouvelle machine

Bootstrapper une nouvelle machine tient en une commande :

```bash
chezmoi init --apply https://github.com/nicolasrouanne/dotfiles.git
```

Ça clone le repo, génère la config, installe tous les packages Homebrew, résout les secrets depuis 1Password, et écrit tous les dotfiles.

## Ce que j'ai appris

- **Commencer simple.** J'ai démarré avec juste `.zshrc` et ajouté des fichiers au fur et à mesure. Ne pas essayer de tout versionner d'un coup.
- **L'intégration 1Password est fluide.** L'auth biométrique au moment du `chezmoi apply` est naturelle. Pas de tokens à gérer.
- **`run_onchange_`** **est puissant.** Tout script qui doit tourner quand la config change — Homebrew, defaults macOS, installation de plugins — rentre dans ce pattern.
- **chezmoi est plus complexe que stow.** Le templating, les conventions de nommage (`dot_`, `private_`, `.tmpl`) et les couches de config demandent un temps d'adaptation. Pour quelqu'un qui a juste besoin de symlinks, stow est plus simple.

Le repo est public : [github.com/nicolasrouanne/dotfiles](http://github.com/nicolasrouanne/dotfiles).

Et Claude n'a plus cassé mon `.zshrc` depuis — parce que maintenant, je le verrais.
