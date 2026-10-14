---
title: "Why I Version My .zshrc with chezmoi (After Claude Broke It Twice)"
slug: why-i-version-my-zshrc-with-chezmoi-after-claude-broke-it-twice
date: 2026-03-09
author: "Nicolas Rouanne"
---

I use Claude Code daily. It's great for writing code, but it has one annoying habit: it sometimes edits my `.zshrc` and breaks things. Last week it removed an alias I use constantly — `cc` for `claude --worktree`. The week before, it messed up my shell config in a different way. Both times, I had to manually fix it.

That was the trigger. I needed my dotfiles versioned, so any accidental change could be caught and reverted. I'd been meaning to do it for a while — this was the push.

## Choosing a tool

I looked at two options:

- **GNU Stow** — dead simple symlink manager. You organize files in a directory, run `stow`, and it creates symlinks in `$HOME`.
- **chezmoi** — full-featured dotfiles manager with templating, secret management, and multi-machine support.

I went with chezmoi because my `.zshrc` contains API keys (Notion, Slack) that I didn't want in a git repo. chezmoi has built-in 1Password integration, which solved that problem cleanly.

## The setup

Install chezmoi and add your first file:

```bash
brew install chezmoi
chezmoi add ~/.zshrc
```

chezmoi copies the file into its source directory. To use templates (for secrets), rename it to `.tmpl`:

```bash
mv ~/.local/share/chezmoi/dot_zshrc ~/.local/share/chezmoi/dot_zshrc.tmpl
```

Then replace hardcoded secrets with 1Password references:

```bash
# Before
export NOTION_API_KEY="ntn_F900..."

# After
export NOTION_API_KEY="{{ onepasswordRead "op://Qraft/chezmoi_notion/api_key" "my.1password.eu" }}"
```

When you run `chezmoi apply`, it calls the 1Password CLI, resolves the secrets via biometric auth, and writes the actual values to `~/.zshrc`.

## 1Password naming convention

I store secrets in my 1Password vault with a `chezmoi_` prefix:

- `chezmoi_notion` → `api_key` field
- `chezmoi_slack-qraft` → `user_token` field
- `chezmoi_slack-episto` → `user_token` field

The `op://` URI format is `op://Vault/Item/Field`. One gotcha: don't use `/` in item names — 1Password interprets it as a path separator. I initially tried `chezmoi/notion` and it failed. `chezmoi_notion` works fine.

## What I version

I ended up adding more than just `.zshrc`:

- `.zshrc` (templated, secrets from 1Password)
- `.gitconfig` (aliases, GPG signing, editor)
- `.gitignore_global`
- `.config/starship.toml`
- `.ssh/config`
- Cursor `settings.json` and `keybindings.json`
- A `Brewfile` for all Homebrew packages

## Managing Homebrew packages

chezmoi has a `run_onchange_` script pattern — it runs a script whenever its content changes. I use this to run `brew bundle` automatically:

```bash
# run_onchange_before_install-packages-darwin.sh.tmpl
brew bundle --no-upgrade --file={{ joinPath .chezmoi.sourceDir "Brewfile" | quote }}
```

The Brewfile lives alongside the dotfiles. To add a new package:

```bash
brew install jq
brew-sync          # alias that runs brew bundle dump
# commit when ready
```

## Custom source directory

By default, chezmoi stores files in `~/.local/share/chezmoi/`. I moved mine to `~/dev/dotfiles/` for easier access. A `.chezmoi.toml.tmpl` file in the repo auto-configures this on new machines:

```toml
sourceDir = "{{ .chezmoi.homeDir }}/dev/dotfiles"

[onepassword]
  account = "my.1password.eu"
```

## New machine setup

Bootstrapping a new machine is one command:

```bash
chezmoi init --apply https://github.com/nicolasrouanne/dotfiles.git
```

This clones the repo, generates the config, installs all Homebrew packages, resolves secrets from 1Password, and writes all dotfiles.

## What I learned

- **Start simple.** I began with just `.zshrc` and added files incrementally. Don't try to version everything at once.
- **The 1Password integration is smooth.** Biometric auth on `chezmoi apply` feels natural. No tokens to manage.
- **`run_onchange_`** **is powerful.** Any script that should run when config changes — Homebrew, macOS defaults, plugin installs — fits this pattern.
- **chezmoi is more complex than stow.** The templating, naming conventions (`dot_`, `private_`, `.tmpl`), and config layers take some getting used to. For someone who just needs symlinks, stow is simpler.

The repo is public: [github.com/nicolasrouanne/dotfiles](http://github.com/nicolasrouanne/dotfiles).

And Claude hasn't broken my `.zshrc` since — because now I'd notice.
