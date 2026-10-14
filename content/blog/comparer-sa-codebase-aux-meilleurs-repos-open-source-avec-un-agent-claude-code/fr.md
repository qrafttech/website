---
title: "Comparer sa codebase aux meilleurs repos open source avec un agent Claude Code"
slug: comparer-sa-codebase-aux-meilleurs-repos-open-source-avec-un-agent-claude-code
date: 2026-03-03
author: "Adrien Lupo"
---

Quand je code une feature, j'ai souvent le réflexe d'aller regarder comment les meilleurs projets open source font la même chose. Comment [cal.com](http://cal.com/) structure ses tRPC routes ? Comment Vendure découpe ses modules NestJS ? Comment Prefect organise ses layers FastAPI ?

Le problème : ça prend du temps. Trouver le bon repo, naviguer dans sa structure, comprendre les conventions, puis comparer avec mon propre code. J'ai automatisé tout ça avec un agent Claude Code custom.

## Le problème : on code dans une bulle

On a tous nos habitudes. Nos patterns préférés, nos conventions "maison". Et quand on reste trop longtemps sur une même codebase, on perd le recul.

J'avais besoin d'un mécanisme simple pour confronter mes choix à ce qui se fait de mieux. Pas un linter, pas un code review classique -- un outil qui va lire du vrai code de production dans des repos de référence, et me dire "ici, tu pourrais faire comme [cal.com](http://cal.com/)" ou "Vendure gère ça différemment, et voilà pourquoi c'est mieux".

---

## L'idée : un agent qui lit les meilleurs repos et compare avec le mien

Claude Code permet de créer des [agents custom](https://docs.anthropic.com/en/docs/claude-code/agents) : des fichiers Markdown placés dans `~/.claude/agents/` qui définissent un rôle, des outils, et un comportement spécifique.

J'en ai créé un -- `best-in-class-repo-analyst` -- dont le rôle est simple : sélectionner les repos les plus pertinents selon mon contexte (langage, framework, architecture), aller lire leur code source sur GitHub, et comparer avec ma codebase.

### La définition de l'agent

Le fichier `~/.claude/agents/best-in-class-repo-analyst.md` :

```yaml
---
name: best-in-class-repo-analyst
description: "Use this agent when the user wants to compare their code
  against best-in-class repositories, analyze architectural patterns
  from top-tier open source projects, write idiomatic code following
  industry-leading conventions, or find reference implementations
  for a specific technology or framework."
model: opus
color: cyan
memory: user
tools: Read, Glob, Grep, Bash, WebSearch, WebFetch,
  mcp__github__get_file_contents, mcp__github__search_code
---
```

Quelques choix importants ici :

- **`model: opus`** -- J'utilise le modèle le plus capable pour l'analyse architecturale. C'est un cas où la qualité du raisonnement prime sur la vitesse.
- **`memory: user`** -- L'agent dispose de sa propre mémoire persistante entre les sessions. C'est là que je stocke ma liste de repos de référence.
- **`tools`** -- L'agent a accès aux outils GitHub MCP (`mcp__github__get_file_contents`, `mcp__github__search_code`) pour lire directement le code source des repos, plus les outils de lecture de ma codebase locale (`Read`, `Glob`, `Grep`).

---

## La bibliothèque de repos : une liste curatée, pas une recherche dynamique

C'est le coeur du système. L'agent ne va pas chercher des repos au hasard sur GitHub. Il travaille avec une **liste que je sélectionne et maintiens moi-même**.

Pourquoi ? Parce que tous les repos populaires ne sont pas forcément de bonnes références. Un repo à 50K stars peut avoir un code moyen. Un repo à 700 stars peut être une référence architecturale. Je veux contrôler ce que l'agent considère comme "best-in-class".

### Organisation de la mémoire

La mémoire de l'agent est structurée par framework dans des fichiers séparés :

```javascript
~/.claude/agents/best-in-class-repo-analyst/
  MEMORY.md                  # Index de routage (auto-chargé)
  repos-ts-nextjs.md         # 12 repos Next.js
  repos-ts-nestjs.md         # 12 repos NestJS
  repos-python-fastapi.md    # 11 repos FastAPI
  repos-mobile-expo.md       # 7 repos Expo/React Native
  repos-swift.md             # 6 repos Swift
  repos-js-electron.md       # 1 repo Electron
```

Le fichier `MEMORY.md` sert d'index. Il est chargé automatiquement au démarrage de l'agent et contient la table de routage vers les bons fichiers :

```markdown
## Repository Files
Read ONLY the file(s) matching the user's language/framework context:
- repos-swift.md -- 6 Swift/macOS repos
- repos-python-fastapi.md -- 11 Python/FastAPI repos
- repos-ts-nestjs.md -- 12 TypeScript/NestJS repos
- repos-ts-nextjs.md -- 12 TypeScript/Next.js repos
- repos-mobile-expo.md -- 7 Expo/React Native repos
- repos-js-electron.md -- 1 Electron repo
```

L'agent ne charge que le fichier pertinent pour le contexte courant. Si je travaille sur du Next.js, il ne va pas lire les repos NestJS.

### Comment je sélectionne les repos

Chaque entrée dans un fichier de repos contient :

```markdown
### calcom/cal.com
https://github.com/calcom/cal.com
Production SaaS (scheduling) | 40.2K stars | Score: 92/100 | Daily commits
Official: Referenced in Vercel blog posts
Gold standard for production-grade Next.js at scale. Turborepo monorepo,
tRPC for type-safe APIs, Prisma ORM, Playwright E2E...
**Caveats**: Very large codebase. Complexity may be overwhelming.
```

Mes critères de sélection :

| **Critère** | **Pourquoi** |
| --- | --- |
| Cité dans la doc officielle | Validé par les mainteneurs du framework |
| Forte activité (commits récents) | Le code n'est pas abandonné |
| En production | Les patterns ont été testés sous charge |
| Architecture propre | Le code doit être lisible et bien structuré |

Je note aussi les **caveats** de chaque repo. Un repo peut être excellent pour l'architecture mais utiliser une licence AGPL ou dépendre de services spécifiques. L'agent doit le savoir pour contextualiser ses recommandations.

---

## Comment ça marche en pratique

Je suis dans ma codebase. Je veux structurer un nouveau module NestJS. Je demande :

```javascript
Compare mon module users/ avec les meilleures pratiques NestJS
```

L'agent va :

1. **Lire son** **`MEMORY.md`** pour identifier le bon fichier de repos (ici `repos-ts-nestjs.md`)
2. **Sélectionner les repos pertinents** -- Vendure pour l'architecture modulaire, Twenty pour le CRM enterprise-grade, le boilerplate brocoders pour les conventions
3. **Lire le code source** via le MCP GitHub -- structure des modules, services, controllers, DTOs
4. **Lire mon code local** -- mon module `users/`, ses services, ses tests
5. **Comparer et recommander** -- avec des exemples before/after tirés du vrai code des repos de référence

L'output ressemble à ça :

```javascript
Repository 1: vendure-ecommerce/vendure
Why Selected: Premier NestJS e-commerce, plugin architecture exemplaire
Architecture Overview: ...
Key Patterns for Your Use Case: ...

Repository 2: twentyhq/twenty
Why Selected: Enterprise CRM, 20+ feature modules NestJS
...

Cross-Repository Comparison: ...
Recommendations for Your Code:
- Votre module users/ mélange la logique métier et la validation...
- Vendure et Twenty séparent systématiquement le DTO du domain model...
```

> [!NOTE]
> L'agent ne fabrique pas d'exemples. Le prompt lui impose de vérifier que chaque pattern cité existe réellement dans le repo de référence.

---

## Les patterns transversaux que l'agent a identifiés

À force d'analyser des repos, l'agent accumule des observations dans son `MEMORY.md`. Quelques patterns qui reviennent systématiquement dans les meilleurs projets :

- **Les monorepos dominent à grande échelle** -- Turborepo + pnpm ([cal.com](http://cal.com/), Dub, next-forge, create-t3-turbo)
- **Les API type-safe convergent** -- tRPC, clients TypeScript générés depuis OpenAPI, GraphQL codegen
- **Les meilleurs repos imposent les conventions via l'outillage** -- linters custom, générateurs de code, TypeScript strict. Pas via de la documentation.
- **La spec RealWorld** permet de comparer des frameworks entre eux sur un cas standardisé (FastAPI vs NestJS par exemple)

---

## Quelques repos que j'utilise

Pour donner une idée concrète, voici un extrait de ma liste par framework :

**Next.js** -- [cal.com](http://cal.com/) (scheduling SaaS, 40K stars), vercel/commerce (e-commerce canonique), Dub (link management par Steven Tey de Vercel), next-forge (boilerplate officiel Vercel)

**NestJS** -- Vendure (e-commerce headless, architecture plugin), Twenty (CRM open source, 40K stars), Novu (notifications, 38K stars)

**FastAPI** -- fastapi/full-stack-fastapi-template (le seul template officiel), Prefect (orchestration, 21K stars), Mealie (architecture textbook), Tracecat (DDD exemplaire)

**Expo/React Native** -- Ignite (boilerplate de référence depuis 9 ans), obytes/react-native-template-obytes (le plus moderne), create-t3-turbo (monorepo web + mobile)

> [!NOTE]
> Cette liste n'est pas statique. Je la mets à jour régulièrement quand je découvre un nouveau repo de qualité ou quand un repo est archivé. Netflix/dispatch (FastAPI), par exemple, a été archivé en septembre 2025 -- il reste une référence architecturale mais ne reçoit plus de mises à jour.

---

## Configurer l'agent chez vous

Tout est open source. Pour installer l'agent :

1. Copiez le fichier agent dans `~/.claude/agents/best-in-class-repo-analyst.md`
2. Créez le dossier mémoire `~/.claude/agents/best-in-class-repo-analyst/`
3. Ajoutez un `MEMORY.md` avec l'index de vos fichiers de repos
4. Créez vos fichiers de repos par framework

L'agent a besoin du [MCP GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/github) pour lire le code des repos. Ajoutez-le dans votre config Claude Code si ce n'est pas déjà fait.

Ensuite, Claude Code détecte automatiquement l'agent et le déclenche quand le contexte s'y prête -- ou vous pouvez l'invoquer explicitement.

Le repo complet avec la config, les fichiers de repos et des exemples : [github.com/adrienlupo/Claude-code-config](http://github.com/adrienlupo/Claude-code-config)

---

## Ce qu'il faut retenir

- **Confronter sa codebase à des références extérieures** aide à prendre du recul et à identifier les patterns qu'on ne voit plus à force de travailler sur le même projet
- **Une liste curatée manuellement** vaut mieux qu'une recherche dynamique -- on contrôle la qualité des références
- **La mémoire persistante des agents Claude Code** permet de maintenir cette liste entre les sessions sans la recharger à chaque fois
- **Le MCP GitHub** donne à l'agent la capacité de lire du vrai code, pas juste des README

---

_Le meilleur code review, c'est celui où le reviewer a déjà lu comment les meilleurs font la même chose._
