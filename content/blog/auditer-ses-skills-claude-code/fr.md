---
title: "Auditer ses skills Claude Code"
slug: auditer-ses-skills-claude-code
date: 2026-10-05
author: "Nicolas Rouanne"
---

Mes skills Claude Code s'empilent depuis février : une trentaine aujourd'hui, plus un `CLAUDE.md`, des fichiers de knowledge et les prompts de mes routines. Je ne m'étais jamais demandé s'ils étaient encore d'accord entre eux.

Claude Code embarque un skill `claude-api` qui a un mode pour ça : `/claude-api prompt-audit`. Je l'ai lancé sur mon repo de config, dont une partie est publique : [agent-skills](https://github.com/nicolasrouanne/agent-skills).

## 1. Ce que fait l'audit

Il relit toute la surface de prompt du repo : `CLAUDE.md`, les fichiers de knowledge, les 30 skills, les prompts des routines cloud et des scripts `claude -p`. Il cherche deux familles de problèmes : du texte écrit pour des modèles plus anciens, et des instructions que le repo a dépassées ou qui se contredisent.

Quelques choix que j'ai bien aimés :

- il ne pose pas de questions : il écrit ses hypothèses en tête du rapport (périmètre, modèle cible) et avance ;
- il vérifie contre le bon modèle. Mes skills tournent sur Opus, mes routines cloud sur Sonnet, et il a audité chacun contre le sien ;
- il n'a pas lu les `settings.json` ni les `.mcp.json`, parce qu'ils peuvent contenir des secrets ;
- il n'applique rien. Il rend un rapport (constat, `fichier:ligne`, pourquoi c'est obsolète) et un diff proposé, qui passe `git apply --check`, et il sépare ce qu'il corrige de ce qu'il me laisse trancher.

## 2. Pas la formulation : la dérive

Je m'attendais à des remarques de style. Il n'y en a presque pas : pas de MAJUSCULES de pression, pas de « think step by step », pas de noms de modèles retirés. Presque tous les constats sont des contradictions entre fichiers : des instructions justes au moment où je les ai écrites, et dépassées depuis que le reste a bougé.

L'exemple le plus parlant concerne mes posts LinkedIn. Quand je publie un article, un skill rédige le post LinkedIn qui l'annonce. Je l'ai écrit en février, avec [cet exemple de post](https://github.com/nicolasrouanne/agent-skills/blob/4bf1ec7676266afb0ee868dc74fb5721b0b4f04d/.claude/skills/cross-post/SKILL.md#L54-L60) à imiter :

```text
I spent last week deep-diving into MCP servers and how they can automate content distribution.

The result? A workflow that publishes my articles to Notion, then cross-posts to LinkedIn, Twitter, and Slack—all from a single command.

Full write-up with code examples: [link]

#AI #Automation #DeveloperTools
```

Une accroche, un « The result? », des hashtags : le post LinkedIn type. En juillet, après mes premiers posts, j'ai écrit un [guide de style](https://github.com/nicolasrouanne/agent-skills/blob/4bf1ec7676266afb0ee868dc74fb5721b0b4f04d/.claude/knowledge/writing-style.md#L92) qui interdit précisément ça, et mon `CLAUDE.md` demande à l'agent de l'appliquer à tout ce qu'il rédige :

```text
- **Pas de tournures à punchline** : "Le problème n'était pas X, c'est Y",
  "Le twist :", hooks d'accroche, listes fléchées `→`.
```

Le skill, lui, n'a pas suivi. Il a même été modifié en juillet pour autre chose, sans que personne ne touche à l'exemple. Quand je publie, l'agent a donc deux consignes contraires sous les yeux : l'une lui montre une accroche à imiter, l'autre la lui interdit. Rien ne plante, rien ne prévient, et rien ne dit laquelle il va suivre. Mon propre outil me poussait vers les posts que je m'interdis d'écrire 😅

Pour trancher, l'audit regarde le `git blame` des deux côtés : le plus récent fait foi. Ici, le guide de juillet l'emporte sur le skill de février.

## 3. Des skills qui ont vieilli sans bruit

Deux autres exemples, pour donner le ton :

- un skill de scaffolding annonçait Cloudflare Pages dans sa description, et déployait sur Workers dans son propre corps. La description, c'est ce que le modèle lit pour choisir le skill ;
- [mon skill de PR](https://github.com/nicolasrouanne/agent-skills/blob/4bf1ec7676266afb0ee868dc74fb5721b0b4f04d/.claude/skills/pr/SKILL.md#L26) supposait que la session tournait toujours dans un worktree :

```text
5. **Create a feature branch**: The session runs in a `--worktree` so you're
   already on an isolated branch based on `origin/main`. Rename it to a
   descriptive branch name: `git branch -m <branch-name>`
```

Sans vérifier la branche courante. Lancé depuis `main`, il renomme `main`.

## 4. Le garde-fou que je croyais avoir

Une règle que je ne négocie pas : aucun agent ne merge une PR sans moi. Pour la faire tenir, `gh pr merge` est dans la liste `ask` de mes permissions, et Claude Code me demande confirmation avant chaque merge. Je pensais que ça suffisait.

Ça ne suffisait pas, et je ne le savais pas. `gh pr merge` n'est qu'une des façons de merger. `gh api` appelle directement l'API GitHub, et il était autorisé en entier dans mes permissions. Cette commande mergeait donc sans rien demander :

```bash
gh api repos/<owner>/<repo>/pulls/<n>/merge -X PUT
```

Pareil pour la mutation GraphQL `mergePullRequest`. Le garde-fou ne couvrait qu'une porte sur trois.

Je ne l'ai pas trouvé en cherchant. L'audit avait relevé que mon skill `promote-permissions` conseillait d'autoriser `gh api` ; c'est en corrigeant ce skill que l'agent a vu que c'était déjà fait. Deux règles `ask` de plus :

```json
"ask": [
  "Bash(gh pr merge:*)",
  "Bash(gh api */merge*)",
  "Bash(gh api *mergePullRequest*)"
]
```

L'auto-merge de GitHub (`enablePullRequestAutoMerge`) reste autorisé : là, ce sont les règles du repo qui décident, pas l'agent.

## Les limites

- Il juge des textes, pas des comportements : un retrait de formulation ne se valide qu'en relançant le skill sur de vrais cas.
- « Le plus récent fait foi » reste une heuristique : chaque arbitrage est à relire avant d'appliquer.
- Il ne lit pas les `settings.json` : le trou du merge est sorti en corrigeant un skill, pas dans le rapport.
