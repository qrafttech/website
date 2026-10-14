---
title: "Publishing My Claude Code Config as a GitHub Pages Site"
slug: publishing-my-claude-code-config-as-a-github-pages-site
date: 2026-02-12
author: "Nicolas Rouanne"
---

**Author:** Nicolas Rouanne

**Date:** February 12, 2026

---

I keep all my Claude Code configuration — skills, settings, guides, and insights — in a single Git repository. At some point I thought: this is already organized as markdown files, why not publish it as a documentation site? So I set up GitHub Pages with Jekyll and the Just the Docs theme. Here's how it works.

## Why publish your Claude Code config?

The repo at ~/dev/claude/ started as a way to version-control my Claude Code setup: CLAUDE.md, custom skills, settings.json, and some guides I wrote along the way. Everything was already symlinked from ~/.claude/ to this repo, so it was well-organized but only visible locally.

Publishing it as a site makes it easy to share a specific skill or guide by just sending a URL, and it serves as a personal reference I can access from anywhere.

## The setup

The site uses Jekyll with the just-the-docs remote theme. The entire configuration fits in a few lines of YAML:

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

Each markdown file uses Jekyll front matter to define its place in the navigation. The theme handles the rest: search, sidebar navigation, and responsive layout.

## The skill publishing trick

The most interesting part of the setup is how skills get published. Skills live in .claude/skills/\*/SKILL.md, but Jekyll doesn't know about that directory structure. Instead of duplicating the files or moving them, I use a build-time copy step in the GitHub Actions workflow:

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

This runs before Jekyll builds. Each SKILL.md already has the right front matter (`parent: Skills`, `permalink: /skills/skill-name/`), so they slot into the navigation automatically. The skills/ directory is in .gitignore — it only exists during the build.

This means adding a new skill to the site requires zero extra work: just write the SKILL.md in .claude/skills/my-skill/ and push to main.

## What's on the site

The site currently has five sections:

- **Home** — overview and quick setup instructions for symlinking the config
- **CLAUDE.md** — my global instructions, loaded in every Claude Code session
- **Guides** — tutorials on settings architecture, MCP server scopes, and audio notifications
- **Skills** — all 13 custom slash commands, each with full documentation
- **Insights** — usage analytics reports with session metrics

## Deployment

The GitHub Actions workflow is straightforward — two jobs: build (checkout, copy skill pages, configure Pages, build with Jekyll, upload artifact) and deploy (deploy the artifact to GitHub Pages). It triggers on every push to main and supports manual dispatch. The whole pipeline takes about 30 seconds.

## What works well

- **Zero maintenance**: push to main, site updates. No build tool to configure locally.
- **Skills auto-publish**: the copy step means skills are always in sync with what I actually use.
- **Searchable**: Just the Docs includes full-text search out of the box.
- **Shareable**: instead of pasting a markdown file, I can share a URL.

## Limitations

- **No custom domain** — it's on nicolasrouanne.github.io/claude/, which is fine for personal use.
- **Static only** — insights reports are self-contained HTML files, so they work, but there's no dynamic filtering.
- **Jekyll constraints** — the skill copy trick works but means skill files need proper front matter. Not a big deal in practice.

## Takeaway

If you're already keeping your Claude Code config in a Git repo, adding GitHub Pages is almost free. The just-the-docs theme turns a folder of markdown files into a navigable site with no configuration beyond a 6-line \_config.yml. And a simple shell script in CI can bridge the gap between your .claude/skills/ directory structure and what Jekyll expects.

The site is live at [nicolasrouanne.github.io/claude/](https://nicolasrouanne.github.io/claude/)
