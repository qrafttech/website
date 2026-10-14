---
title: "Using Notion MCP with Multiple Accounts in Claude Code"
slug: using-notion-mcp-with-multiple-accounts-in-claude-code
date: 2026-02-13
author: "Nicolas Rouanne"
---

I use Claude Code with Notion's MCP server to read and write to my Notion workspaces. But I have two Notion accounts — one for work and one personal. The MCP server only accepts a single NOTION_TOKEN, so connecting both at once isn't natively possible. Here's the workaround I've been using, and some thoughts on how this could be improved.

## The Problem

The official @notionhq/notion-mcp-server takes one environment variable: NOTION_TOKEN. That's it. One token, one Notion workspace. If you have two Notion accounts — like a professional workspace and a personal one — you can't pass both tokens to a single MCP server instance.

Claude Code loads MCP server configurations from .mcp.json at the project root. The server name acts as a key, so you can't define two servers both named "notion" in the same file either.

## The Workaround

My solution is simple: I use two separate working directories, each with its own .mcp.json pointing to a different Notion account.

**Professional workspace** — ~/dev/.mcp.json:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "ntn_pro_workspace_token..."
      }
    }
  }
}
```

**Personal workspace** — ~/personal-agent/.mcp.json:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "ntn_personal_workspace_token..."
      }
    }
  }
}
```

Both use the exact same MCP server package. The only difference is the token. When I launch Claude Code from ~/dev/, it connects to my work Notion. When I launch from ~/personal-agent/, it connects to my personal Notion.

## What Works

It does the job. Each workspace is fully isolated — I can search, create pages, and manage databases in both Notion accounts without any cross-contamination. The setup is trivial: just two .mcp.json files with different tokens.

I also have different settings.local.json permissions in each directory, so the tools available and approved differ between the professional and personal contexts. This gives me a natural boundary between work and personal use.

## What Doesn't Work

The main friction is context switching. To work with my personal Notion, I need to open a separate Claude Code session from ~/personal-agent/. I can't query both workspaces from the same session. If I'm in the middle of a task in ~/dev/ and want to quickly check something in my personal Notion, I have to switch terminals.

There's also no way to name the servers differently while keeping them as the same tool. If I named one "notion-pro" and the other "notion-perso", Claude Code would expose them as separate tool sets, which works but adds confusion about which tools to call.

## Possible Solutions

This is a workaround, not a proper solution. Here are a few directions that could make multi-account Notion usage cleaner:

- **MCP server level:** The @notionhq/notion-mcp-server could support multiple tokens, namespaced by workspace. Tools could accept a workspace parameter, or the server could expose separate tool sets per account.
- **Claude Code level:** Support for named MCP server instances — like notion:pro and notion:perso — each with their own config, within a single .mcp.json. This would let you connect to both from one working directory.
- **Notion API level:** A token type that grants access to multiple workspaces. Currently, each Notion integration is scoped to a single workspace, which forces this one-token-per-account pattern.

For now, the two-directory approach works. It's not elegant, but it's simple and reliable. If you're running into the same limitation, this gets the job done while we wait for better multi-account support.
