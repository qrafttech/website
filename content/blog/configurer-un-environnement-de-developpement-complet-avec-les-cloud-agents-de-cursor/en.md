---
title: "Setting Up a Full Dev Environment with Cursor Cloud Agents"
slug: setting-up-a-full-dev-environment-with-cursor-cloud-agents
date: 2026-03-02
author: "Nicolas Rouanne"
---

**Author:** Nicolas Rouanne

**Date:** March 2, 2026

---

I wanted to see if Cursor's new Cloud Agents feature could set up a real development environment from scratch — not a toy project, but a full Rails API + Next.js monorepo with PostgreSQL, Redis, encrypted credentials, and seeded data. The answer: yes, mostly. Here's how it went.

## What are Cursor Cloud Agents?

Cursor released Cloud Agents with Computer Use on February 24, 2026. Each agent runs in its own isolated VM with a full development setup. The key selling point: agents can now actually test the software they build, generate merge-ready pull requests, and attach artifacts like screenshots and videos as proof of work.

The feature is available from the Cursor web interface, desktop app, mobile, Slack, and even GitHub workflows.

## The setup task

I pointed a cloud agent at a monorepo with two services:

| Service | Stack | Port |
| --- | --- | --- |
| API | Rails 7 + Ruby 3.4.7 | 3000 |
| Web | Next.js + Node 24.x | 3001 |

The agent needed to install Ruby (rbenv), Node (nvm), PostgreSQL 16, Redis 7, libvips, Yarn, and Bundler — then create the database, run migrations, seed data, and verify that both lint and tests pass.

## What worked

The agent got all dependencies installed and configured correctly on its first run. Here's the final verification matrix:

| Service | Lint | Tests | Run |
| --- | --- | --- | --- |
| **API** (Rails) | 710 files, 0 offenses | 2958 pass, 0 failures | OK |
| **Web** (Next.js) | ESLint + tsc pass | 4/4 pass | OK |

It even ran a "hello world" demo: authenticated via OAuth2 password grant, fetched missions and freelancers from the seeded API, and browsed the web dashboard.

The agent also produced an `AGENTS.md` file documenting everything it learned — service ports, startup commands, database setup, gotchas — so future cloud agents wouldn't need to rediscover this from scratch.

## What didn't work smoothly

The agent couldn't create a pull request. The GitHub token provided by Cursor Cloud didn't have PR creation permissions on the repository, so it had to give me the branch name and PR body to create manually.

This is a friction point. If the whole promise is "merge-ready PRs with artifacts," the token permissions need to cover PR creation out of the box.

## Gotchas the agent uncovered

Some interesting findings that aren't obvious from the codebase:

- `config.require_master_key = true` is set in **development** too, not just production. Without `RAILS_MASTER_KEY`, the API won't boot at all in dev.
- `development.rb` calls `Rails.application.credentials.dig(:postmark, :api_token)` at boot time, so the key must be valid even if you don't use Postmark.
- The test environment doesn't enforce `require_master_key`, so most tests pass without it — except the 212 that need YouSign credentials from the encrypted file.
- No `oauth_applications` table exists. Doorkeeper uses `skip_client_authentication_for_password_grant`, so no client ID/secret is needed for tokens.
- `libvips` is a hard dependency — any `rails` command fails without it because of ActiveStorage.

## Practical takeaways

Cursor Cloud Agents are genuinely useful for environment setup tasks. The isolated VM approach means you don't burn time debugging on your own machine. The `AGENTS.md` pattern — where the agent documents what it learned — is particularly valuable for teams onboarding new developers or setting up CI environments.

Where it falls short: anything requiring elevated GitHub permissions or secrets that aren't pre-configured. Plan to handle PR creation and sensitive credential injection yourself.

For a monorepo with real complexity (encrypted credentials, multiple runtimes, system dependencies), the agent handled it well. I'd use it again for the next environment bootstrap.
