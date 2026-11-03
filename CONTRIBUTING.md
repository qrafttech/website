# Écrire un article pour le blog

Les articles sont des fichiers Markdown dans `content/blog`, un dossier par article. Ce guide couvre tout le parcours : écrire, relire, programmer la publication.

## Avant de commencer

Il faut être collaborateur du repo : demande un accès à nicolas.rouanne@qraft.tech. La branche de l'article doit être poussée **dans ce repo**, pas depuis un fork : une PR venant d'un fork n'est jamais publiée.

## 1. Créer le dossier

```
content/blog/<slug-fr>/
  fr.md          # la version française
  en.md          # la version anglaise, optionnelle (et inversement)
  cover-fr.jpg   # couverture, optionnelle
  cover-en.jpg
  *.png          # les images de l'article
```

Le nom du dossier est le slug français. Il ne change plus une fois l'article publié.

## 2. Le front matter

Chaque fichier commence par :

```yaml
---
title: "Auditer ses skills Claude Code"
slug: auditer-ses-skills-claude-code
date: 2026-10-05
author: "Prénom Nom"
cover: "cover-fr.jpg"
excerpt: "Une phrase pour la liste des articles et le partage."
---
```

| Champ     | Obligatoire | Rôle                                                                                                                    |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `title`   | oui         | Le titre affiché.                                                                                                       |
| `slug`    | oui         | L'URL : `qraft.tech/blog/<slug>` en français, `qraft.tech/en/blog/<slug>` en anglais. Unique par langue, fixé une fois. |
| `date`    | non         | La date de publication, `YYYY-MM-DD`. **Sans date, l'article est un brouillon** et n'est jamais publié.                 |
| `author`  | oui         | Ton nom.                                                                                                                |
| `cover`   | non         | Le nom de fichier de la couverture, dans le dossier de l'article.                                                       |
| `excerpt` | non         | Le résumé. Par défaut, le premier paragraphe.                                                                           |

Un fichier mal formé fait échouer le build : titre et slug manquants, date dans un autre format, deux articles avec le même slug.

## 3. Le Markdown

C'est du Markdown GitHub : titres, listes, tableaux, blocs de code, citations.

- **Titres** : commence à `##`. Le titre de l'article vient du front matter.
- **Code** : indique le langage, il est affiché au-dessus du bloc (` ```bash `, ` ```python `).
- **Images** : par nom de fichier, à côté du `.md`. Le titre devient la légende :

  ```markdown
  ![Description pour l'accessibilité](schema.png "La légende sous l'image")
  ```

- **Encadrés** : une citation qui commence par `[!NOTE]`, `[!TIP]` ou `[!WARNING]` :

  ```markdown
  > [!TIP]
  > Le conseil qui fait gagner une heure.
  ```

- **Liens** internes en chemin absolu (`/blog/un-autre-article`), externes en URL complète. Ils s'ouvrent dans un nouvel onglet.

Prettier ignore `content/`, ton Markdown n'est pas reformaté.

## 4. Les images

- **Couverture** : JPG, 2400 × 1600 (ratio 3:2), autour de 150 Ko. Si elle contient du texte, fais `cover-fr.jpg` et `cover-en.jpg`.
- **Figures** : PNG ou JPG, moins de 300 Ko. Pas de capture d'écran avec des données réelles de client : anonymise avant.

## 5. Relire

Deux façons de voir l'article rendu :

- **En local** : `make up` puis `make url` (voir le [README](README.md)). Les brouillons sont listés en tête du blog.
- **Sur la PR** : Vercel déploie une preview à chaque push, avec le lien dans la PR. Les brouillons et les articles programmés y sont visibles, jamais en production.

## 6. Publier

1. Pousse ta branche, nommée `blog/<slug-fr>`, et ouvre une PR. Tant que tu écris, laisse le fichier **sans `date`** : l'article est un brouillon.
2. Quand c'est prêt, mets une `date` **au moins 48 h dans le futur**. Ces 48 h sont la fenêtre de relecture : Nicolas relit et commente sur la PR.
3. Le matin de la date (vers 4 h, heure de Paris), la PR se merge toute seule et l'article est en ligne. Aucune action de ta part.

La PR est retenue, et l'article n'est pas publié, tant que :

- elle est en draft ;
- une review demande des changements ;
- un check est rouge ou en attente ;
- un des fichiers `fr.md` / `en.md` n'a pas de `date` ;
- elle a un conflit avec `main`.

Pour décaler la publication, change la `date`. Pour annuler, ferme la PR.

## 7. Modifier un article publié

Une PR classique, sur n'importe quel nom de branche : elle demande une review avant le merge. Ne change pas le `slug`, c'est l'URL.
