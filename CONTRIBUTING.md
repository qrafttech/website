# Writing an article for the blog

Articles are Markdown files in `content/blog`, one folder per article. This guide covers the whole path: writing, previewing, scheduling the publication.

## Before you start

You need to be a collaborator on the repo: ask nicolas.rouanne@qraft.tech. Push your branch **to this repo**, not to a fork: a PR from a fork is never published.

## 1. Create the folder

```
content/blog/<slug-fr>/
  fr.md          # the French version
  en.md          # the English version, optional (and the other way round)
  cover-fr.jpg   # cover, required to publish
  cover-en.jpg
  social.jpg     # link preview image, only when the cover does not suit it
  *.png          # the article's images
```

The folder name is the French slug. It never changes once the article is published.

## 2. The front matter

Each file starts with:

```yaml
---
title: "Auditer ses skills Claude Code"
slug: auditer-ses-skills-claude-code
date: 2026-10-05
author: "First Last"
cover: "cover-fr.jpg"
excerpt: "One sentence for the article list and social previews."
---
```

| Field     | Required   | Role                                                                                                                                 |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `title`   | yes        | The displayed title.                                                                                                                 |
| `slug`    | yes        | The URL: `qraft.tech/blog/<slug>` in French, `qraft.tech/en/blog/<slug>` in English. Unique per language, set once.                  |
| `date`    | no         | The publication date, `YYYY-MM-DD`. **Without a date the article is a draft** and is never published.                                |
| `author`  | yes        | Your name.                                                                                                                           |
| `cover`   | to publish | The cover's file name, in the article's folder: the image of the article in the blog's list. Required once the article has a `date`. |
| `social`  | no         | The image of link previews (LinkedIn, Slack, iMessage…), when the cover does not suit them. Defaults to the cover.                   |
| `excerpt` | no         | The summary. Defaults to the first paragraph.                                                                                        |

A malformed file fails the build: missing title or slug, a date in another format, two articles with the same slug.

The tests (`make test`, run on every PR) fail on an article with a `date` and no `cover`, and on a cover file that does not exist.

## 3. The Markdown

GitHub-flavored Markdown: headings, lists, tables, code blocks, quotes.

- **Headings**: start at `##`. The article's title comes from the front matter.
- **Code**: name the language, it is displayed above the block (` ```bash `, ` ```python `).
- **Images**: by file name, next to the `.md`. The title becomes the caption:

  ```markdown
  ![Alt text for accessibility](diagram.png "The caption under the image")
  ```

- **Callouts**: a quote whose first line is `[!NOTE]`, `[!TIP]` or `[!WARNING]`:

  ```markdown
  > [!TIP]
  > The tip that saves an hour.
  ```

- **Links**: internal ones as absolute paths (`/blog/another-article`), external ones as full URLs. They open in a new tab.

Prettier ignores `content/`, your Markdown is not reformatted.

## 4. Images

- **Cover**: JPEG, 2400 × 1600 (3:2), around 150 KB. If it contains text, make a `cover-fr.jpg` and a `cover-en.jpg`. One of the article's figures can be its cover.
- **Link preview**: made from the cover. Social networks crop the image to 1200 × 630, so the cover is fitted whole into that frame and its edges are stretched to fill the rest. It only looks right on a plain background: for a photo, a screenshot that fills its frame or a tall image, add a `social` image, 1200 × 630 or larger at the same ratio. A draft with neither gets the site's image.
- **Figures**: PNG or JPEG, under 300 KB. No screenshot with real client data: anonymize first.

## 5. Preview

Two ways to see the rendered article:

- **Locally**: `make up` then `make url` (see the [README](README.md)). Drafts are listed at the top of the blog.
- **On the PR**: Vercel deploys a preview on every push, linked from the PR. Drafts and scheduled articles show there, never in production.

The image of the link preview is at `/blog-social/<folder>/fr.jpg` (or `en.jpg`), on both.

## 6. Publish

1. Push your branch, named `blog/<slug-fr>`, and open a PR. While you write, leave the file **without a `date`**: the article is a draft.
2. When it is ready, set a `date` **at least 48 hours ahead**. Those 48 hours are the review window: Nicolas reads and comments on the PR.
3. On the morning of that date (around 4 am, Paris time), the PR merges itself and the article is live. Nothing to do on your side.

The PR is held, and the article not published, while:

- it is a draft PR;
- a review requests changes;
- a check is red or pending;
- one of the `fr.md` / `en.md` files has no `date`;
- it conflicts with `main`.

To move the publication, change the `date`. To cancel, close the PR.

## 7. Edit a published article

A regular PR, on any branch name: it needs a review before merging. Don't change the `slug`, it is the URL.
