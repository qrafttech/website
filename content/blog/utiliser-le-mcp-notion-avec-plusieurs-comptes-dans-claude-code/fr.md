---
title: "Utiliser le MCP Notion avec plusieurs comptes dans Claude Code"
slug: utiliser-le-mcp-notion-avec-plusieurs-comptes-dans-claude-code
date: 2026-02-13
author: "Nicolas Rouanne"
---

J'utilise Claude Code avec le serveur MCP de Notion pour lire et écrire dans mes espaces Notion. Mais j'ai deux comptes Notion — un pour le travail et un personnel. Le serveur MCP n'accepte qu'un seul NOTION_TOKEN, donc il n'est pas possible de connecter les deux en même temps. Voici le contournement que j'utilise, et quelques pistes pour améliorer les choses.

## Le problème

Le serveur officiel @notionhq/notion-mcp-server prend une seule variable d'environnement : NOTION_TOKEN. C'est tout. Un token, un espace Notion. Si vous avez deux comptes Notion — un professionnel et un personnel — vous ne pouvez pas passer les deux tokens à une même instance du serveur MCP.

Claude Code charge la configuration des serveurs MCP depuis le fichier .mcp.json à la racine du projet. Le nom du serveur sert de clé, donc on ne peut pas non plus définir deux serveurs nommés "notion" dans le même fichier.

## Le contournement

Ma solution est simple : j'utilise deux répertoires de travail séparés, chacun avec son propre .mcp.json pointant vers un compte Notion différent.

**Espace professionnel** — ~/dev/.mcp.json :

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "ntn_token_espace_pro..."
      }
    }
  }
}
```

**Espace personnel** — ~/personal-agent/.mcp.json :

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "ntn_token_espace_perso..."
      }
    }
  }
}
```

Les deux utilisent exactement le même package MCP. La seule différence est le token. Quand je lance Claude Code depuis ~/dev/, il se connecte à mon Notion pro. Quand je lance depuis ~/personal-agent/, il se connecte à mon Notion personnel.

## Ce qui marche

Ça fait le job. Chaque espace est complètement isolé — je peux chercher, créer des pages et gérer des bases de données dans les deux comptes Notion sans contamination croisée. La mise en place est triviale : juste deux fichiers .mcp.json avec des tokens différents.

J'ai aussi des permissions settings.local.json différentes dans chaque répertoire, donc les outils disponibles et approuvés diffèrent entre le contexte professionnel et personnel. Ça me donne une frontière naturelle entre les deux usages.

## Ce qui ne marche pas

La principale friction, c'est le changement de contexte. Pour travailler avec mon Notion personnel, je dois ouvrir une session Claude Code séparée depuis ~/personal-agent/. Je ne peux pas interroger les deux espaces depuis la même session. Si je suis en plein milieu d'une tâche dans ~/dev/ et que je veux vérifier quelque chose dans mon Notion perso, je dois changer de terminal.

Il n'y a pas non plus moyen de nommer les serveurs différemment tout en les gardant comme le même outil. Si je nommais l'un "notion-pro" et l'autre "notion-perso", Claude Code les exposerait comme des ensembles d'outils séparés, ce qui fonctionne mais ajoute de la confusion sur quels outils appeler.

## Solutions possibles

C'est un contournement, pas une vraie solution. Voici quelques pistes qui pourraient rendre l'usage multi-comptes plus propre :

- **Au niveau du serveur MCP :** Le @notionhq/notion-mcp-server pourrait supporter plusieurs tokens, avec un namespace par espace de travail. Les outils pourraient accepter un paramètre workspace, ou le serveur pourrait exposer des ensembles d'outils distincts par compte.
- **Au niveau de Claude Code :** Le support d'instances de serveurs MCP nommées — comme notion:pro et notion:perso — chacune avec sa propre config, dans un seul .mcp.json. Ça permettrait de se connecter aux deux depuis un seul répertoire.
- **Au niveau de l'API Notion :** Un type de token qui donne accès à plusieurs espaces de travail. Actuellement, chaque intégration Notion est limitée à un seul espace, ce qui impose ce pattern un-token-par-compte.

Pour l'instant, l'approche à deux répertoires fonctionne. Ce n'est pas élégant, mais c'est simple et fiable. Si vous êtes confronté à la même limitation, ça fait le travail en attendant un meilleur support multi-comptes.
