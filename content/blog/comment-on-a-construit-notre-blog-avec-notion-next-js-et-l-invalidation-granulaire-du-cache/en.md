---
title: "How We Built Our Blog with Notion, Next.js, and Granular Cache Invalidation"
slug: how-we-built-our-blog-with-notion-next-js-and-granular-cache-invalidation
date: 2026-03-05
author: "Nicolas Rouanne"
---

**Author:** Nicolas Rouanne

**Date:** March 5, 2026

---

I wanted a blog for the Qraft website, but I didn't want to build a full CMS or manage a database. We already use Notion internally, and it has a solid API. So the idea was simple: write articles in Notion, render them on the site with Next.js, and use Vercel's caching to keep things fast. It took 5 PRs to get there, and the final architecture turned out cleaner than I expected.

## Why Notion as a CMS

The starting point was SEO. We wanted blog articles to be full server-rendered pages on our domain, not links to Notion. Google indexes those properly, and we get sitelinks in search results. But we also didn't want to maintain a separate CMS — Notion is already where we write content.

Notion's API gives us everything we need: a database for metadata (title, date, author, language), and a blocks API for the actual content. The trade-off is that Notion's block model is more complex than Markdown, but it maps well to React components.

## The Architecture

The setup has four layers:

1. **Notion** — the content database. Authors write articles directly in Notion.
2. **Next.js data layer** — fetches and caches content from the Notion API.
3. **Vercel cache** — stores rendered pages with granular cache tags.
4. **Webhook endpoint** — receives Notion events and invalidates the right cache entries.

Here's the data flow:

```javascript
Notion Database
  ↓ (webhook event)
POST /api/revalidate
  ↓ (HMAC verification)
Cache tag mapping
  ↓
revalidateTag() → bust specific cache entry
  ↓
Next request → fresh fetch from Notion API
  ↓
NotionRenderer → server-rendered HTML
```

## Fetching Content

The Notion client is straightforward. We use the official `@notionhq/client` SDK with retry logic:

```typescript
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  retry: { maxRetries: 3 },
});
```

Two main functions handle data fetching. `fetchArticles()` queries the database for the article listing, and `fetchArticleById()` retrieves a single article with all its blocks.

The interesting part is how blocks work. Notion's content is a tree — paragraphs, headings, lists, images, each potentially containing nested children. We fetch them recursively up to 5 levels deep:

```typescript
async function fetchAllBlocks(
  blockId: string,
  depth = 0
): Promise<NotionBlock[]> {
  if (depth >= MAX_BLOCK_DEPTH) return [];

  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });

    const typed = response.results
      .filter((b): b is NotionBlock => "type" in b);
    await Promise.all(
      typed.map(async (block) => {
        if (block.has_children) {
          block.children = await fetchAllBlocks(
            block.id, depth + 1
          );
        }
      })
    );
    blocks.push(...typed);

    cursor = response.has_more
      ? response.next_cursor ?? undefined
      : undefined;
  } while (cursor);

  return blocks;
}
```

## Caching with Granular Tags

This is where things get interesting. We use Next.js 16's `"use cache"` directive with `cacheLife("max")` for aggressive caching. But the key insight is **granular cache tags**.

Early on, we had a single `blog-articles` tag for everything. Editing one article would bust the cache for every article and the listing page. Not great.

The final approach uses two tag patterns:

```typescript
export async function fetchArticles(): Promise<ArticleMeta[]> {
  "use cache";
  cacheLife("max");
  cacheTag("blog-list");
  // ...
}

export async function fetchArticleById(
  id: string
): Promise<ArticleFull | null> {
  "use cache";
  cacheLife("max");
  cacheTag(`blog-article-${id}`);
  // ...
}
```

- `blog-list` — tags the article listing query
- `blog-article-{id}` — tags each individual article

This means editing an article's content only invalidates that one article's cache. The listing and all other articles stay cached.

## Webhook-Based Revalidation

Notion sends webhook events when pages change. Our `/api/revalidate` endpoint maps each event type to the relevant cache tags:

```typescript
const tagsByEvent: Record<string, (pageId: string) => string[]> = {
  "page.content_updated": (id) =>
    id ? [`blog-article-${id}`] : [],
  "page.properties_updated": (id) =>
    id ? ["blog-list", `blog-article-${id}`] : ["blog-list"],
  "page.created": () => ["blog-list"],
  "page.deleted": (id) =>
    id ? ["blog-list", `blog-article-${id}`] : ["blog-list"],
};
```

The logic is intuitive:

- **Content updated** → only that article's cache
- **Properties updated** (title, date, author) → the listing _and_ that article
- **Created or deleted** → the listing (and the article if applicable)

Security is handled with HMAC-SHA256 signature verification. Notion signs every webhook payload, and we verify it with timing-safe comparison before processing anything.

## The Slug Decision

One decision that evolved during development was URL slugs. We initially generated slugs from article titles (e.g., `/blog/how-we-built-our-blog`). The problem is obvious: rename an article in Notion, and every link breaks.

We switched to using the Notion page ID as the slug: `/blog/a1b2c3d4-e5f6-7890`. It's not pretty, but it's stable. And it has a nice side effect — `fetchArticleById()` can retrieve a page directly by ID in a single API call, instead of querying the entire database and filtering.

## Rendering Notion Blocks

A `NotionRenderer` server component handles the recursive rendering of Notion blocks to React. It supports paragraphs, headings, lists (with nesting), code blocks, images, quotes, callouts, and dividers. Rich text annotations (bold, italic, code, links) are mapped to the corresponding HTML.

The trickiest part was list grouping. Notion returns list items as individual blocks, but HTML needs them wrapped in `<ul>` or `<ol>` elements. The renderer groups consecutive list items and handles nesting through recursive children.

## What Works Well

- **Content workflow is seamless.** Write in Notion, it appears on the site within seconds.
- **Cache invalidation is surgical.** Editing one article doesn't affect others.
- **No database to manage.** Notion is the single source of truth.
- **SEO is solid.** Full server-rendered pages with proper meta tags. `generateStaticParams` pre-renders known articles at build time.
- **Resilience.** Graceful fallbacks on API failures — empty arrays instead of crashes.

## Limitations

- **Notion API rate limits.** With many articles or deeply nested content, you can hit limits. The retry logic helps, but it's something to watch.
- **Block type coverage.** The renderer doesn't support every Notion block type. We built what we need and add support as articles use new block types.
- **URL aesthetics.** Page ID slugs aren't human-readable. A valid trade-off for stability, but worth noting.
- **Notion is a dependency.** If Notion's API is down, the cache serves stale content, but new articles won't appear until it recovers.

## Takeaways

This setup works well for a small-to-medium blog where the team already uses Notion. The key architectural choices were:

1. **Granular cache tags** over a single shared tag — lets you invalidate precisely what changed.
2. **ID-based slugs** over title-based slugs — stable URLs that don't break on rename.
3. **Webhook-driven revalidation** over time-based ISR — content updates appear in seconds, not minutes.
4. **Recursive block fetching** with a depth limit — handles nested content without risking infinite loops.

I wouldn't use this approach for a site with thousands of articles or complex content workflows. But for a company blog where a few people write articles in Notion? It's exactly the right amount of complexity.
