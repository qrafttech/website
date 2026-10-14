---
title: "Auditing my Claude Code skills"
slug: auditing-my-claude-code-skills
date: 2026-10-05
author: "Nicolas Rouanne"
---

My Claude Code skills have been piling up since February: about thirty today, plus a `CLAUDE.md`, knowledge files and the prompts of my routines. I had never asked myself whether they still agreed with each other.

Claude Code ships a `claude-api` skill with a mode for exactly that: `/claude-api prompt-audit`. I ran it on my config repo, part of which is public: [agent-skills](https://github.com/nicolasrouanne/agent-skills).

## 1. What the audit does

It rereads the whole prompt surface of the repo: `CLAUDE.md`, the knowledge files, the 30 skills, the prompts of the cloud routines and of the `claude -p` scripts. It looks for two families of problems: text written for older models, and instructions the repo has outgrown or that contradict each other.

A few choices I liked:

- it asks no questions: it writes its assumptions at the top of the report (scope, target model) and moves on;
- it checks against the right model. My skills run on Opus, my cloud routines on Sonnet, and it audited each against its own;
- it did not read the `settings.json` or `.mcp.json` files, since they can hold secrets;
- it applies nothing. It returns a report (finding, `file:line`, why it is obsolete) and a proposed diff, which passes `git apply --check`, and it separates what it fixes from what it leaves for me to decide.

## 2. Not the wording: the drift

I expected style remarks. There are almost none: no pressure CAPITALS, no "think step by step", no retired model names. Nearly every finding is a contradiction between files: instructions that were right when I wrote them, and outdated since the rest moved on.

The clearest example is about my LinkedIn posts. When I publish an article, a skill drafts the LinkedIn post that announces it. I wrote it in February, with [this sample post](https://github.com/nicolasrouanne/agent-skills/blob/4bf1ec7676266afb0ee868dc74fb5721b0b4f04d/.claude/skills/cross-post/SKILL.md#L54-L60) to imitate:

```text
I spent last week deep-diving into MCP servers and how they can automate content distribution.

The result? A workflow that publishes my articles to Notion, then cross-posts to LinkedIn, Twitter, and Slack—all from a single command.

Full write-up with code examples: [link]

#AI #Automation #DeveloperTools
```

A hook, a "The result?", hashtags: the textbook LinkedIn post. In July, after my first posts, I wrote a [style guide](https://github.com/nicolasrouanne/agent-skills/blob/4bf1ec7676266afb0ee868dc74fb5721b0b4f04d/.claude/knowledge/writing-style.md#L92) that forbids exactly that, and my `CLAUDE.md` tells the agent to apply it to everything it writes:

```text
- **Pas de tournures à punchline** : "Le problème n'était pas X, c'est Y",
  "Le twist :", hooks d'accroche, listes fléchées `→`.
```

(No punchline turns, no hooks, no arrow lists.) The skill didn't follow. It was even edited in July for something else, and nobody touched the sample. So when I publish, the agent has two opposite instructions in front of it: one shows a hook to imitate, the other forbids it. Nothing breaks, nothing warns, and nothing says which one it will follow. My own tool was pushing me toward the posts I forbid myself to write 😅

To settle it, the audit looks at the `git blame` of both sides: the newer one wins. Here, the July guide beats the February skill.

## 3. Skills that aged quietly

Two more examples, to set the tone:

- a scaffolding skill announced Cloudflare Pages in its description, and deployed to Workers in its own body. The description is what the model reads to pick the skill;
- [my PR skill](https://github.com/nicolasrouanne/agent-skills/blob/4bf1ec7676266afb0ee868dc74fb5721b0b4f04d/.claude/skills/pr/SKILL.md#L26) assumed the session always ran in a worktree:

```text
5. **Create a feature branch**: The session runs in a `--worktree` so you're
   already on an isolated branch based on `origin/main`. Rename it to a
   descriptive branch name: `git branch -m <branch-name>`
```

Without checking the current branch. Run from `main`, it renames `main`.

## 4. The guard I thought I had

One rule I don't bend: no agent merges a PR without me. To enforce it, `gh pr merge` is in the `ask` list of my permissions, and Claude Code asks me for confirmation before every merge. I thought that was enough.

It wasn't, and I didn't know. `gh pr merge` is only one way to merge. `gh api` calls the GitHub API directly, and it was allowed wholesale in my permissions. So this command merged without asking anything:

```bash
gh api repos/<owner>/<repo>/pulls/<n>/merge -X PUT
```

Same for the GraphQL `mergePullRequest` mutation. The guard covered one door out of three.

I didn't find it by looking for it. The audit had flagged that my `promote-permissions` skill recommended allowing `gh api`; while fixing that skill, the agent saw it was already allowed. Two more `ask` rules:

```json
"ask": [
  "Bash(gh pr merge:*)",
  "Bash(gh api */merge*)",
  "Bash(gh api *mergePullRequest*)"
]
```

GitHub auto-merge (`enablePullRequestAutoMerge`) stays allowed: there, the repo's rules decide, not the agent.

## Limits

- It judges text, not behavior: a wording removal is only validated by rerunning the skill on real cases.
- "The newer one wins" is a heuristic: each call is worth rereading before applying it.
- It does not read `settings.json`: the merge hole came up while fixing a skill, not in the report.
