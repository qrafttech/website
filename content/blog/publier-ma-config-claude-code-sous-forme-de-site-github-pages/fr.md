---
title: "Publier ma config Claude Code sous forme de site GitHub Pages"
slug: publier-ma-config-claude-code-sous-forme-de-site-github-pages
date: 2026-02-12
author: "Nicolas Rouanne"
---

**Auteur :** Nicolas Rouanne

**Date :** 12 février 2026

---

Je conserve toute ma configuration Claude Code — skills, settings, guides et insights — dans un seul dépôt Git. À un moment, je me suis dit : c'est déjà organisé en fichiers markdown, pourquoi ne pas en faire un site de documentation ? J'ai donc mis en place GitHub Pages avec Jekyll et le thème Just the Docs. Voici comment ça fonctionne.

## Pourquoi publier sa config Claude Code ?

Le dépôt ~/dev/claude/ a commencé comme un moyen de versionner ma configuration Claude Code : CLAUDE.md, skills personnalisés, settings.json, et quelques guides écrits en cours de route. Tout était déjà en lien symbolique depuis ~/.claude/ vers ce dépôt, donc c' était bien organisé mais uniquement visible en local.

Le publier sous forme de site permet de partager facilement un skill ou un guide en envoyant simplement une URL, et ça sert de référence personnelle accessible de n'importe où.

## La mise en place

Le site utilise Jekyll avec le thème distant just-the-docs. Toute la configuration tient en quelques lignes de YAML :

```yaml
remote_theme: just-the-docs/just-the-docs

title: Claude Code Config
description: Personal Claude Code configuration — skills, permissions, guides, and insights.
baseurl: /claude

exclude:
  - config/
  - notes/
  - .claude/settings.local.json
  - Gemfile
  - Gemfile.lock
```

Chaque fichier markdown utilise le front matter Jekyll pour définir sa place dans la navigation. Le thème gère le reste : recherche, barre latérale et mise en page responsive.

## L'astuce pour publier les skills

La partie la plus intéressante est la façon dont les skills sont publiés. Ils vivent dans .claude/skills/\*/SKILL.md, mais Jekyll ne connaît pas cette arborescence. Plutôt que de dupliquer ou déplacer les fichiers, j'utilise une étape de copie au moment du build dans le workflow GitHub Actions :

```yaml
- name: Copy skill pages for Jekyll
  run: |
    mkdir -p skills
    for dir in .claude/skills/*/; do
      name=$(basename "$dir")
      if [ -f "$dir/SKILL.md" ]; then
        cp "$dir/SKILL.md" "skills/${name}.md"
      fi
    done
```

Cette étape s'exécute avant le build Jekyll. Chaque SKILL.md possède déjà le bon front matter (`parent: Skills`, `permalink: /skills/skill-name/`), donc ils s'intègrent automatiquement dans la navigation. Le répertoire skills/ est dans .gitignore — il n'existe que pendant le build.

Résultat : ajouter un nouveau skill sur le site ne demande aucun travail supplémentaire. Il suffit d' écrire le SKILL.md dans .claude/skills/mon-skill/ et de pusher sur main.

## Ce qu'on trouve sur le site

Le site comporte actuellement cinq sections :

- **Home** — présentation et instructions pour configurer les liens symboliques
- **CLAUDE.md** — mes instructions globales, chargées dans chaque session Claude Code
- **Guides** — tutoriels sur l'architecture des settings, les scopes MCP et les notifications audio
- **Skills** — les 13 commandes slash personnalisées, chacune avec sa documentation complète
- **Insights** — rapports d'analytics d'utilisation avec métriques de sessions

## Déploiement

Le workflow GitHub Actions est simple — deux jobs : build (checkout, copie des skills, configuration de Pages, build Jekyll, upload de l'artefact) et deploy (déploiement de l'artefact sur GitHub Pages). Il se déclenche à chaque push sur main et supporte le déclenchement manuel. Le tout prend environ 30 secondes.

## Ce qui fonctionne bien

- **Zéro maintenance** : push sur main, le site se met à jour. Aucun outil de build à configurer localement.
- **Publication automatique des skills** : l' étape de copie garantit que les skills sont toujours synchronisés avec ce que j'utilise réellement.
- **Recherche intégrée** : Just the Docs inclut la recherche plein texte nativement.
- **Partageable** : au lieu de coller un fichier markdown, je peux partager une URL.

## Limites

- **Pas de domaine personnalisé** — c'est sur nicolasrouanne.github.io/claude/, ce qui convient pour un usage personnel.
- **Statique uniquement** — les rapports insights sont des fichiers HTML autonomes, donc ils fonctionnent, mais il n'y a pas de filtrage dynamique.
- **Contraintes Jekyll** — l'astuce de copie des skills fonctionne mais implique que les fichiers de skills aient le bon front matter. Pas un gros problème en pratique.

## À retenir

Si vous versionnez déjà votre config Claude Code dans un dépôt Git, ajouter GitHub Pages est quasiment gratuit. Le thème just-the-docs transforme un dossier de fichiers markdown en site navigable sans configuration au-delà d'un \_config.yml de 6 lignes. Et un simple script shell dans la CI peut faire le pont entre votre arborescence .claude/skills/ et ce qu'attend Jekyll.

Le site est en ligne sur [nicolasrouanne.github.io/claude/](https://nicolasrouanne.github.io/claude/)
