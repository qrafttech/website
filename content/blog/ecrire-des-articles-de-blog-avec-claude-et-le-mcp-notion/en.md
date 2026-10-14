---
title: "Writing Blog Articles with Claude and the Notion MCP"
slug: writing-blog-articles-with-claude-and-the-notion-mcp
date: 2026-01-22
author: "Nicolas Rouanne"
---

**Author:** Nicolas Rouanne

**Date:** January 22, 2026

---

## A quick confession

I'm writing this article from my terminal. No browser open, no copy-pasting between apps. Just me, Claude Code, and a Notion workspace I can talk to directly.

Sounds a bit weird? Let me show you what I mean.

## What's the Notion MCP?

The MCP (Model Context Protocol) is basically a way to let Claude interact with external services. With the Notion MCP, Claude can read, create, and edit pages in your workspace—just by you asking in plain English.

Think of it like giving Claude a set of keys to your Notion.

## Real examples from today

Here's the thing: this blog you're reading? We just restructured the whole thing using this workflow. Here are the actual prompts I used:

### Setting up a multilingual blog

```javascript
Implement the following plan: restructure the blog to support 
French and English versions of each article. Add a Language 
property to the database, create Blog EN and Blog FR sub-pages, 
and translate all 3 existing articles to French.
```

That's it. One prompt. Claude figured out the structure, created the pages, translated the articles, and linked everything together.

### Making quick edits

When I wanted to improve this very article:

```javascript
Edit this article: make the tone more human, more personal, 
less grandiloquent. Add examples of prompts from this 
conversation.
```

### Fixing mistakes

Things don't always go perfectly. At one point, updating a page accidentally archived some content. But fixing it was as simple as:

```javascript
The database got archived. Can you recreate it with the 
same structure and articles?
```

## Why I actually like this

**It's fast.** Writing documentation usually falls to the bottom of my to-do list. Now I can draft and publish something in the time it takes to describe what I want.

**It stays in my flow.** I'm already in the terminal for coding. Not having to switch to a browser, log into Notion, figure out formatting... it removes just enough friction to make me actually do it.

**It's iterative.** Don't like how something sounds? Just say so. Claude will fix it. No need to re-explain the whole context.

## The obvious irony

Yes, this is an article about using AI to write articles, written by AI. Meta, I know.

But that's kind of the point—the tools have gotten good enough that you can focus on _what_ you want to say, not _how_ to get it onto the page. Claude handles the mechanics; you stay in control of the content.

---

_Written with Claude Code + Notion MCP. The prompts above are from this actual session._
