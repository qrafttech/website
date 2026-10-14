---
title: "How to Connect the Notion MCP"
slug: how-to-connect-the-notion-mcp
date: 2026-01-21
author: "Nicolas Rouanne"
---

The **Model Context Protocol (MCP)** allows AI assistants like Claude to interact directly with your Notion workspace. Here's how to set it up based on the official documentation.

## What is the Notion MCP?

The Notion MCP is an official integration that enables AI tools to:

- **Search** pages and databases in your workspace
- **Read** and **fetch** content from pages
- **Create** new pages and databases
- **Update** existing content
- **Move** pages between locations
- **Manage** comments and users

> The server provides **21 tools** for Notion API operations, with Markdown editing capabilities optimized for token consumption.

## Supported AI Tools

- **Claude** (Desktop & [Claude.ai](http://claude.ai/))
- **Cursor** (AI-powered code editor)
- **ChatGPT Pro**
- Any AI tool supporting the Model Context Protocol

---

## Hosted MCP Server (Easiest)

Notion provides a hosted server with OAuth installation. Connect through:

1. Notion's in-app directory of featured AI tools
2. Your AI tool's directory (search for "Notion")
3. Manual connection using the public URL

### Configuration

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
    }
  }
}
```

## Security Considerations

⚠️ **Important**: MCP tools act with your full Notion permissions.

- They can access everything you can access
- Notion limits exposed APIs (e.g., cannot delete databases via MCP)
- Consider configuring read-only capabilities for sensitive workspaces
- Review the Integration's Capabilities settings

---

## Example Commands

Once connected, you can ask your AI assistant:

- _"Search for project updates in Notion"_
- _"Read the meeting notes from last week"_
- _"Create a new task in my Tasks database"_
- _"Update the status of the homepage redesign"_

---

## Official Resources

- [Notion MCP Documentation](https://developers.notion.com/docs/mcp)
- [Getting Started Guide](https://developers.notion.com/docs/get-started-with-mcp)
- [GitHub Repository](https://github.com/makenotion/notion-mcp-server)

---

_Written with Claude Code using the Notion MCP_
