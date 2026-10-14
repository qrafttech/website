---
title: "Gérer plusieurs espaces de travail Claude Code depuis un seul repo"
slug: gerer-plusieurs-espaces-de-travail-claude-code-depuis-un-seul-repo
date: 2026-03-04
author: "Nicolas Rouanne"
---

J’utilise Claude Code dans trois répertoires distincts — `~/dev/` pour le développement, `~/work/` pour les tâches non-dev (suivi du temps, édition de contenu), et `~/personal/` pour l’admin perso. Chaque espace a son propre `CLAUDE.md` (instructions de contexte) et `.mcp.json` (config des serveurs MCP). Je voulais tout versionner dans un seul repo pour suivre les changements, relire les diffs, et ne pas perdre mes configs en changeant de machine.

## La mise en place

J’avais déjà un repo `~/dev/claude/` où je versionne mes réglages globaux Claude Code, mes skills et mes guides. Le `~/.claude/CLAUDE.md` global était déjà un lien symbolique vers ce repo. Je voulais étendre ce pattern aux configs de chaque espace de travail.

La nouvelle structure :

```javascript
~/dev/claude/
├── workspaces/
│   ├── dev/
│   │   ├── CLAUDE.md
│   │   └── .mcp.json
│   ├── work/
│   │   ├── CLAUDE.md
│   │   └── .mcp.json
│   └── personal/
│       ├── CLAUDE.md
│       └── .mcp.json
├── CLAUDE.md          # instructions globales
├── config/
│   └── settings.json
└── ...
```

Chaque fichier original (`~/dev/CLAUDE.md`, `~/work/.mcp.json`, etc.) devient un lien symbolique pointant vers le repo.

## Gérer les secrets dans .mcp.json

Les fichiers `.mcp.json` configurent les serveurs MCP — dans mon cas, Notion. Chacun contenait à l’origine un token API en clair. Hors de question de commiter ça.

Claude Code supporte la syntaxe `${VAR}` dans les valeurs d’environnement de `.mcp.json`, donc la solution était simple. Au lieu de :

```json
{
  "mcpServers": {
    "notion": {
      "env": {
        "NOTION_TOKEN": "ntn_abc123..."
      }
    }
  }
}
```

J’ai maintenant :

```json
{
  "mcpServers": {
    "notion": {
      "env": {
        "NOTION_TOKEN": "${NOTION_TOKEN_WORK}"
      }
    }
  }
}
```

Les vrais tokens vivent dans `~/.zshrc` comme variables d’environnement exportées. Deux tokens, deux espaces : `NOTION_TOKEN_WORK` pour dev et work (même workspace Notion), `NOTION_TOKEN_PERSONAL` pour perso.

## Créer les liens symboliques

La migration était mécanique :

```bash
# Copier le contenu dans le repo
cp ~/dev/CLAUDE.md ~/dev/claude/workspaces/dev/CLAUDE.md
# ... pareil pour les 6 fichiers

# Remplacer les originaux par des symlinks
rm ~/dev/CLAUDE.md
ln -s ~/dev/claude/workspaces/dev/CLAUDE.md ~/dev/CLAUDE.md
# ... pareil pour les 6 fichiers
```

Claude Code suit les liens symboliques de manière transparente — il lit le contenu du fichier que ce soit un fichier normal ou un symlink. Aucun changement de configuration nécessaire.

## Ce qui marche bien

- **Contrôle de version** : chaque modification des instructions ou de la config MCP passe par une PR. On voit ce qui a changé et pourquoi.
- **Pas de secrets dans git** : le pattern `${VAR}` garde les tokens entièrement hors du repo.
- **Source unique de vérité** : un seul repo contient toute la configuration Claude Code — réglages globaux, skills, et maintenant les configs d’espace de travail.
- **Portabilité machine** : cloner le repo, créer les symlinks et les variables d’environnement, et tous les espaces sont configurés.

## Points d’attention

- **Conscience des symlinks** : certains outils ne suivent pas les liens symboliques. Claude Code oui, mais si vous utilisez d’autres outils qui lisent `.mcp.json`, testez-les.
- **Dépendance au profil shell** : les variables d’environnement doivent être chargées avant le démarrage de Claude Code. Si vous utilisez un shell non-login ou un fichier de profil différent, vérifiez que vos exports sont au bon endroit.
- **Tokens par machine** : si vous utilisez des tokens Notion différents par machine, il faudra définir les variables d’environnement différemment sur chacune. Le repo reste le même, seul le profil shell change.

## À retenir

Si vous utilisez Claude Code dans plusieurs répertoires, les liens symboliques vers un repo de config sont un moyen propre de tout versionner sans commiter de secrets. La syntaxe `${VAR}` dans `.mcp.json` permet de garder les tokens dans votre profil shell, là où ils doivent être.
