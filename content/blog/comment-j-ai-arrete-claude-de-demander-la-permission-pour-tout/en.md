---
title: "How I Stopped Claude From Asking Permission for Everything"
slug: how-i-stopped-claude-from-asking-permission-for-everything
date: 2026-01-22
author: "Nicolas Rouanne"
---

## "Allow Claude to run git status?" For the hundredth time today.

I love Claude Code. It's become my daily coding companion. But there's one thing that was driving me crazy: the constant permission prompts for completely harmless commands.

`git status`? Allow. `ls`? Allow. `git log`? Allow. `tree`? Allow.

I found myself clicking "Allow" so reflexively that I worried I'd approve something dangerous without noticing. That's the opposite of security.

## The Settings Hierarchy I Didn't Know About

Turns out, Claude Code has a layered settings system I hadn't fully explored:

```javascript
~/.claude/settings.json          ← User defaults (can be versioned)
~/.claude/settings.local.json    ← Ephemeral accepts (NOT versioned)
~/project/.claude/settings.json  ← Project defaults
~/project/.claude/settings.local.json ← Project ephemeral
```

The key insight: `settings.json` is meant to be **curated and version-controlled**. `settings.local.json` is where your "Allow" clicks accumulate—it's ephemeral by design.

I had been letting everything pile up in `settings.local.json` across multiple projects, never promoting the good stuff to a proper config.

## The Fix: A Versioned Permission Allowlist

I created a `~/dev/claude` repository to hold my Claude configuration, then symlinked it:

```bash
ln -sf ~/dev/claude/config/settings.json ~/.claude/settings.json
```

Now my root settings are version-controlled. I added all the read-only commands I use constantly:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status:*)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git show:*)",
      "Bash(ls:*)",
      "Bash(tree:*)",
      "Bash(file:*)",
      "Bash(which:*)",
      "Bash(pwd)",
      
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)",
      
      "Bash(gh pr:*)",
      "Bash(gh issue:*)",
      
      "WebSearch"
    ]
  }
}
```

Peace. No more prompts for routine operations.

## Wait, What About Security?

My first draft had some overly permissive rules:

```json
"Bash(npm:*)",
"Bash(npx:*)",
"Bash(node:*)",
"Bash(python:*)"
```

Then I thought about it. `npx:*` downloads and runs arbitrary packages. `node -e "code"` executes anything. These are basically `eval()` for the command line.

I narrowed them down to safe subcommands:

```json
"Bash(npm install:*)",
"Bash(npm test:*)",
"Bash(npm run build:*)",
"Bash(npm run lint:*)",
"Bash(npm run dev:*)"
```

If Claude needs to run something else, it asks. That's the right tradeoff.

## The Promotion Workflow

I still accumulate new permissions in `settings.local.json` as I work. To manage this, I created a custom skill called `/promote-permissions` that:

1. Reads ephemeral permissions from the current project
2. Compares against my versioned settings
3. Lets me approve which ones to promote
4. Commits the changes and optionally creates a PR

The skill lives in `~/.claude/skills/promote-permissions/`[`SKILL.md`](http://skill.md/) (symlinked from my versioned repo), so it's available everywhere.

## MCP at User Level

I also moved my MCP servers to user scope so they work across all projects:

```bash
claude mcp add notion npx -y mcp-remote https://mcp.notion.com/mcp -s user
```

The `-s user` flag makes it global. No more re-adding Notion MCP for each project.

## The Final Setup

```javascript
~/dev/claude/
├── .claude/
│   └── skills/
│       └── promote-permissions/  ← Custom skill
├── config/
│   └── settings.json             ← Symlinked from ~/.claude/
└── guides/
    └── settings-architecture.md  ← Documentation

~/.claude/
├── settings.json → ~/dev/claude/config/settings.json
├── settings.local.json  ← Ephemeral (not versioned)
└── skills → ~/dev/claude/.claude/skills
```

Everything important is versioned. Ephemeral stuff stays ephemeral. I can share my setup across machines by cloning the repo.

The full configuration is available on GitHub: [nicolasrouanne/claude](https://github.com/nicolasrouanne/claude). Feel free to fork it and adapt it to your needs.

## What I Learned

1. **Separate curated from accumulated**: `settings.json` vs `settings.local.json` exists for a reason
2. **Be specific with dangerous commands**: `npm:*` is lazy; `npm install:*` is intentional
3. **Version your config**: If it's worth keeping, it's worth tracking
4. **Skills can manage skills**: A promotion workflow prevents config drift

The permission prompts aren't gone—they still fire for unusual commands. But now they're signal, not noise.

---

_This article was written with Claude Code, using the very setup it describes. Meta? Maybe. But it worked._
