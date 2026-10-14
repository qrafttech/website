---
title: "A VM for my coding agents, two weeks in"
slug: a-vm-for-my-coding-agents-two-weeks-in
date: 2026-10-15
author: "Nicolas Rouanne"
---

Two weeks ago I wrote about [taking Claude Code off my laptop](https://qraft.tech/en/blog/ship-my-laptop-getting-claude-code-off-my-computer): one VM per person, [Orca](https://github.com/stablyai/orca) on it, driven from the laptop or the phone. On October 13 I presented it at our Tech My Breath Away breakfast, to about fifteen developers from several teams. One of them had been using it every day for a week, and the discussion taught me more than my slides did.

The slides are here: [Ship my laptop](https://claude.ai/artifact/L48TMHLP5Z5HpBCUHJty8W). The repository is public: [qrafttech/orca-host](https://github.com/qrafttech/orca-host).

## 1. Where everyone's agents run

I opened with a poll: laptop, Claude Code cloud sessions, a machine of your own, or CI? Nobody answered with a single number. Laptop for the interactive work, cloud sessions when you run out of credits, a Mac mini under a desk, VMs on the laptop itself, and small GitHub Actions that comment on pull requests. Everybody runs a mix.

What I want from it fits in four words: anywhere, my tools, isolated, reproducible. The second one is the one we underestimate. Over the months a laptop collects CLIs, MCP servers and config files (Google, Slack, Notion, Cloudflare, gcloud…) and nothing says what they are until you try to run the same agent somewhere else.

→ [Ship my laptop](https://qraft.tech/en/blog/ship-my-laptop-getting-claude-code-off-my-computer), the previous article.

## 2. Why not ephemeral machines

I like disposable machines: one sandbox per task, killed when it's done, only the code survives. It's even the greener option, since a machine you don't use is a machine that's off. I didn't manage it. Every task reinstalls its dependencies and images, my tools and accounts don't follow, a session can't be picked up from the phone, and the database goes away with the machine. Too much glue.

So I went for the other pattern, the one [Adrien's remote agent](https://github.com/qrafttech/remote-agent) already used on a VPS: a machine of your own that stays on. In orca-host the shared part is a public image, and each person adds their tools on top:

```docker
# my image: the shared base, plus the Slack MCP server
FROM ghcr.io/qrafttech/orca-host:main@sha256:d3037738da13…
ARG SLACK_MCP_VERSION=1.3.0
RUN curl -fsSL -o /tmp/slack-mcp-server \
      "https://github.com/korotovsky/slack-mcp-server/releases/download/v${SLACK_MCP_VERSION}/slack-mcp-server-linux-${TARGETARCH}" \
 && echo "$sha  /tmp/slack-mcp-server" | sha256sum -c - \
 && install -m 755 /tmp/slack-mcp-server /usr/local/bin/slack-mcp-server
```

Secrets stay in 1Password: the configuration file only holds references, the host resolves them at every boot.

```bash
TS_AUTHKEY={{ op://Vault/tailscale/authkey }}
GH_TOKEN={{ op://Vault/github/token }}
```

→ [README](https://github.com/qrafttech/orca-host#readme), [architecture.md](https://github.com/qrafttech/orca-host/blob/main/.claude/knowledge/architecture.md).

## 3. What a week of daily use showed

A developer who had moved his team's project onto it a week earlier shared two things.

The good one: a scheduled routine that removes dead code. Its instruction is to prove that whatever it deletes is really unused. In Claude Code cloud sessions it found little, because it lacked the tools to check. On the VM, with the same dev tools he has on his laptop, it found 3,000 more lines to remove, all correct.

The less good one: an hourly task that answers his review comments left its Claude sessions open. Over the weekend they filled the VM's CPU, and on Monday morning he couldn't reach it. A local Claude found how to reset the sessions, five minutes, but it's the kind of mistake a laptop forgives and a shared 16 GB machine doesn't.

```hcl
variable "machine_type" {
  description = "About 4 GB RAM per Compose stack: e2-standard-4 = 3 stacks and Orca."
  default     = "e2-standard-4"
}
```

→ [terraform/variables.tf](https://github.com/qrafttech/orca-host/blob/main/terraform/variables.tf).

## 4. Idle sessions are not free

A Claude Code session holds around 500 MB of RAM, even when nobody has spoken to it in days. Background sessions stay alive until you close them. Orca shows each session's consumption in the bottom-right corner and lets you kill it from there, which is worth checking from time to time. I had about twenty open that morning; my head gives up well before the VM does.

## 5. What a project brings

The host knows no project. The project says, in an `orca.yaml` at its root, what to run when a worktree is created or removed. One trap: the setup hook is killed after two minutes, too short to bring up a full stack and seed its database. The way around it is a default tab, which has no timeout:

```yaml
scripts:
  setup: bin/worktree init "$ORCA_WORKTREE_PATH"
  archive: cd "$ORCA_WORKTREE_PATH" && docker compose --env-file .env.worktree down -v

defaultTabs:
  - title: stack
    command: bin/worktree init && bin/worktree start --setup-db
```

The live demo hit exactly that: two setups launched in parallel and fighting over a port. The colleague who uses it daily also replaced the `localhost` URLs with the VM's address so the app opens in your own browser.

→ [Orca docs](https://github.com/stablyai/orca).

## 6. The small things that make the difference

- I was on the train a lot these last weeks. With a local agent, every network drop breaks the prompt. Here my link to the VM drops for a minute, and the agent keeps working, with its database and its tests.
- Review inside the IDE: I leave notes on the diff and send them to the agent, instead of GitHub comments that the agent then has to read and answer. Less noise on the pull request.
- Closing the laptop and leaving. It sounds silly, it's the one I like most.

## What's still pending

- **Per-project binaries.** If project A needs one ffmpeg version and project B another, the per-person image doesn't solve it. That's the ephemeral paradigm's job, and I'm not there.
- **Cost.** About $126 a month on GCP, against about €25 excl. VAT for a comparable OVH VPS, without the immutable OS, Secret Manager or the replicated disk. Migrating to OVH is the next issue.
- **One tailnet at a time.** One of my projects lives on another tailnet, and Tailscale only connects to one. A proxy between the two, or a second host.
- **Voice.** I'd like to just talk to the agents. Dictation in Claude Code or Orca is far from the conversational mode of the mobile apps, and in franglais it's worse.
- **Configuring never ends.** You spend a lot of time setting all this up to maybe go faster. I spend about a day a week on my dev environment. Doing nothing means missing the shift, doing only that means not shipping.
- **The night shift.** Neither of us manages to use agents overnight: whatever they do, we still have to review it, and nobody wants to merge code they haven't read.
