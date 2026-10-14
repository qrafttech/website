---
title: "Managing Secrets with Chezmoi and 1Password Service Accounts"
slug: managing-secrets-with-chezmoi-and-1password-service-accounts
date: 2026-05-07
author: "Nicolas Rouanne"
---

**Author:** Nicolas Rouanne

**Date:** May 7, 2026

---

I use [chezmoi](https://www.chezmoi.io/) to manage my dotfiles across machines, with secrets stored in 1Password. Until recently, everything ran through my personal 1Password account. That worked fine for me alone, but once I started giving AI agents (Claude Code) access to the `op` CLI, I realized they could see _every vault_ in my account. Not great.

Here's how I moved to 1Password Service Accounts to keep agents isolated to only the secrets they need.

## The setup before

My dotfiles repo contains chezmoi templates. The main one is `dot_zshrc.tmpl`, which generates `~/.zshrc` with secrets injected at apply time. The flow was:

1. Chezmoi reads secrets from 1Password using `onepasswordRead`
2. Secrets get baked into the generated `~/.zshrc` as environment variables
3. MCP servers (Notion, Slack, Toggl) read those env vars at startup

The template looked like this:

```bash
export NOTION_TOKEN_WORK="{{ onepasswordRead "op://Qraft/chezmoi_notion_work/api_key" "my.1password.eu" }}"
export SLACK_QRAFT_USER_TOKEN="{{ onepasswordRead "op://Qraft/chezmoi_slack-qraft/user_token" "my.1password.eu" }}"
export TOGGL_API_TOKEN="{{ onepasswordRead "op://Qraft/chezmoi_toggl/api_token" "my.1password.eu" }}"
```

All secrets lived in my personal `Qraft` vault. Chezmoi connected to `my.1password.eu` using my personal session, which required biometric auth (Touch ID).

The problem: when Claude Code ran `op` commands, it used that same session and could access _all_ my vaults.

## The solution: a dedicated vault and service account

The fix has three parts:

### 1. Create a dedicated vault

I created a vault called `AI Agents` in 1Password and copied the relevant items into it:

- `chezmoi_notion_personal` / `chezmoi_notion_work` (Notion API keys)
- `chezmoi_slack-qraft` / `chezmoi_slack-episto` (Slack tokens)
- `chezmoi_toggl` (Toggl API token)
- `chezmoi_langfuse` (Langfuse keys)

This is a flat copy. 1Password doesn't support vault hierarchies, so naming conventions do the work.

### 2. Create a service account

In the 1Password web UI: **Settings > Developer > Service Accounts**. I created `sa-claude-code` with read/write access to the `AI Agents` vault only.

The service account gives you a token (`ops_...`) that authenticates non-interactively. No Touch ID, no MFA, no personal session. But it can only see the vaults you assign to it.

### 3. Update chezmoi to use the service account

Two files changed.

**`.chezmoi.toml.tmpl`** — switch from personal account to service mode:

```toml
sourceDir = "{{ .chezmoi.homeDir }}/dev/dotfiles"

\[onepassword\]
  mode = "service"
```

When `mode = "service"`, chezmoi uses the `OP_SERVICE_ACCOUNT_TOKEN` environment variable instead of an interactive session.

**`dot_zshrc.tmpl`** — load the token from macOS Keychain and point to the new vault:

```bash
# Load SA token from Keychain (no interactive prompt)
export OP_SERVICE_ACCOUNT_TOKEN=$(security find-generic-password -a "sa-claude-code" -s "1password-service-account" -w)

# Secrets now come from the AI Agents vault
export NOTION_TOKEN_WORK="{{ onepasswordRead "op://AI Agents/chezmoi_notion_work/api_key" }}"
export SLACK_QRAFT_USER_TOKEN="{{ onepasswordRead "op://AI Agents/chezmoi_slack-qraft/user_token" }}"
```

The account parameter (`"my.1password.eu"`) is no longer needed — service mode doesn't use it.

## The bootstrap problem

There's one chicken-and-egg issue: chezmoi needs `OP_SERVICE_ACCOUNT_TOKEN` to generate the zshrc, but the zshrc is what loads that token from the Keychain.

For a fresh machine, you need to manually set the token first:

```bash
# Store the token in Keychain
security add-generic-password -a "sa-claude-code" -s "1password-service-account" -w "ops_..."

# Export it for the initial run
export OP_SERVICE_ACCOUNT_TOKEN=$(security find-generic-password -a "sa-claude-code" -s "1password-service-account" -w)

# Then init chezmoi
chezmoi init --apply https://github.com/your/dotfiles.git
```

After that first apply, every new shell loads the token automatically.

## What I'd note

**What works well:**

- Agents are fully isolated — `op vault list` with the SA token shows only `AI Agents`
- No interactive prompts — `chezmoi apply` runs silently
- My personal 1Password session stays independent for direct use
- The service account token itself doesn't live in version control (it's in the macOS Keychain)

**Limitations:**

- 1Password has no vault hierarchy. You can't do `Agents/Qraft`, `Agents/Episto`. It's a flat list, so naming conventions matter.
- Service accounts can't be created via the CLI — you have to use the web UI
- The Keychain approach on macOS doesn't require biometric auth for `security find-generic-password -w`, which is both the point and the tradeoff

## Practical takeaway

If you're giving AI coding agents access to `op`, don't let them use your personal session. Create a service account, scope it to a dedicated vault, and store the token somewhere that doesn't require interactive auth. It takes about 15 minutes and the isolation is worth it.
