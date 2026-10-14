---
title: "Using Claude Code to Triage Sentry Issues and Link Them to GitHub"
slug: using-claude-code-to-triage-sentry-issues-and-link-them-to-github
date: 2026-01-27
author: "Nicolas Rouanne"
---

**Author:** Nicolas Rouanne

**Date:** January 27, 2026

---

## "Can you check what's happening in Sentry?"

That's all I asked Claude Code. What followed was a complete incident triage workflow—querying issues, categorizing them, and creating properly linked GitHub issues—all through natural conversation.

Here's how I set it up and what the workflow looks like.

## Setting Up Sentry Access for Claude

Claude Code doesn't need a dedicated Sentry MCP server. It just needs access to the Sentry CLI and your auth token.

I already had my token in `~/.sentryclirc`:

```text
[auth]
token=sntryu_xxx
```

When I asked Claude to check Sentry, it discovered this file automatically and started working. It used a combination of:

- `sentry-cli` for listing organizations and projects
- Direct REST API calls for detailed queries

```bash
# Claude listing my orgs
sentry-cli organizations list

# Claude querying issue details via API
curl -H "Authorization: Bearer $TOKEN" \
  "https://sentry.io/api/0/projects/samm-care/api/issues/?limit=20"
```

The CLI handles basic operations, but the REST API is essential for anything analytical—like getting tag distributions or issue metadata.

## Triaging Issues

I asked Claude to analyze all the issues in our Sentry project. It queried the API and came back with a categorized list:

**Test issues** (from initial setup):

- `ZeroDivisionError: division by zero` — the `/sentry-debug` test endpoint
- `Error: First error` — 10 events from testing

**Configuration issues** (already resolved):

- `XimiConfigError: Missing XIMI config fields` — setup-time errors

**Real bugs** (need attention):

- `TypeError` in Ximi sync code
- `ConnectError` DNS failures
- `SSL SYSCALL error` database disconnections

**Noise** (expected user errors):

- Login validation errors from empty passwords

For the test and config issues, Claude resolved them directly via the API:

```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}' \
  "https://sentry.io/api/0/organizations/samm-care/issues/API-2/"
```

Three issues resolved in seconds, no clicking through the UI.

## Creating Linked GitHub Issues

This is the best part. Sentry has a GitHub integration that creates bidirectional links between Sentry issues and GitHub issues. Claude used the API to leverage it properly.

First, it checked if the GitHub integration was configured:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://sentry.io/api/0/organizations/samm-care/integrations/"
```

It was—integration ID `360433`. Then Claude created linked issues for each real bug:

````bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "samm-care/samm",
    "title": "TypeError in _sync_carer_to_ximi",
    "description": "Sentry Issue: [API-4](https://samm-care.sentry.io/issues/90099488/)\n\n```\nTypeError: NoneType object is not subscriptable\n  File \"/app/services/carers.py\", line 137\n```"
  }' \
  "https://sentry.io/api/0/organizations/samm-care/issues/API-4/integrations/360433/"
````

The response:

```json
{
  "key": "samm-care/samm#317",
  "url": "https://github.com/samm-care/samm/issues/317"
}
```

Claude created 5 linked GitHub issues in about 30 seconds. Each one:

- Links back to the Sentry issue
- Shows up in Sentry's "Linked Issues" section
- Can auto-resolve the Sentry issue when the GitHub issue closes

## The Workflow

Here's what my Sentry triage now looks like:

1. **"Check Sentry"** — Claude queries all issues and their metadata
2. **Review categorization** — test, config, real bugs, or noise
3. **Resolve non-issues** — Claude marks test/config issues as resolved via API
4. **Create GitHub issues** — Claude uses the Sentry-GitHub integration API
5. **Everything is linked** — bidirectional links, no manual copying

All from natural conversation. No context switching between Sentry UI, GitHub, and terminal.

## Key API Endpoints

For reference, here are the endpoints Claude used:

| Action | Endpoint |
| --- | --- |
| List issues | `GET /projects/{org}/{project}/issues/` |
| Get issue tags | `GET /organizations/{org}/issues/{issue}/tags/` |
| Resolve issue | `PUT /organizations/{org}/issues/{issue}/` |
| List integrations | `GET /organizations/{org}/integrations/` |
| Create linked issue | `POST /organizations/{org}/issues/{issue}/integrations/{integration_id}/` |

## What I Learned

- **Sentry's REST API is comprehensive** — everything the UI does, you can do via API
- **The GitHub integration API is the right way** — creates proper bidirectional links, not just pasted URLs
- **Auth token in** **`~/.sentryclirc`** **is all Claude needs** — no special setup required
- **Triage becomes conversational** — "resolve the test issues" is faster than clicking through UI

---

_This article was written after a real triage session with Claude Code. Five GitHub issues created and linked in under a minute._
