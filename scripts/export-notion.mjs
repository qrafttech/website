/**
 * One-off migration: exports the Notion `Articles` database to
 * `content/blog/<slug-fr>/{fr,en}.md` plus the images, then goes away.
 *
 *   NOTION_API_KEY=… node scripts/export-notion.mjs
 *
 * Slugs are the ones the site computed from Notion (published articles,
 * newest first, collisions suffixed with the page id), so no URL changes.
 * Re-running it overwrites `content/blog`.
 */
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA_SOURCE_ID = "410f70e5-33d0-434f-86b2-ef36dd1398d0";
const OUT = "content/blog";
const LOCALE_BY_LANGUAGE = { FR: "fr", EN: "en" };

const token = process.env.NOTION_API_KEY;
if (!token) throw new Error("NOTION_API_KEY is required");

async function api(path, body) {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(`https://api.notion.com/v1/${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2025-09-03",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if ((response.status === 429 || response.status >= 500) && attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      continue;
    }
    const json = await response.json();
    if (json.object === "error") throw new Error(`${path}: ${json.message}`);
    return json;
  }
}

async function children(blockId) {
  const blocks = [];
  let cursor;
  do {
    const query = `page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`;
    const page = await api(`blocks/${blockId}/children?${query}`);
    for (const block of page.results) {
      if (block.has_children) block.children = await children(block.id);
      blocks.push(block);
    }
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  return blocks;
}

async function queryPages() {
  const pages = [];
  let cursor;
  do {
    const page = await api(`data_sources/${DATA_SOURCE_ID}/query`, {
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    pages.push(...page.results);
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  return pages;
}

// --- Slugs, exactly as lib/notion.ts computed them -------------------------

function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(
    new Date()
  );
}

/** Published articles first, newest first, as the site listed them. */
function assignSlugs(articles) {
  const today = todayISO();
  const published = articles
    .filter((a) => a.date && a.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date));
  const unpublished = articles.filter((a) => !published.includes(a));

  const used = new Set();
  for (const article of [...published, ...unpublished]) {
    const bareId = article.id.replace(/-/g, "");
    const base = slugify(article.title) || bareId;
    article.slug = used.has(base) ? `${base}-${bareId.slice(0, 6)}` : base;
    used.add(article.slug);
  }
}

// --- Rich text → Markdown --------------------------------------------------

function escapeText(text) {
  return text
    .replace(/[\\`*[\]<]/g, "\\$&")
    .replace(/(^|[^\p{L}\p{N}])_|_(?=[^\p{L}\p{N}]|$)/gu, (m) =>
      m.replace("_", "\\_")
    );
}

function inlineCode(text) {
  const runs = text.match(/`+/g) ?? [];
  const fence = "`".repeat(Math.max(0, ...runs.map((r) => r.length)) + 1);
  const pad = text.startsWith("`") || text.endsWith("`") ? " " : "";
  return `${fence}${pad}${text}${pad}${fence}`;
}

/** Notion links between articles point at `notion.site`; they become internal. */
let resolveHref = (href) => href;

function richText(items, { table = false } = {}) {
  // Merge neighbours that share the same formatting, so `**a****b**` is `**a b**`.
  const runs = [];
  for (const item of items) {
    const { bold, italic, code } = item.annotations;
    const key = JSON.stringify([bold, italic, code, item.href]);
    const last = runs[runs.length - 1];
    if (last && last.key === key) last.text += item.plain_text;
    else
      runs.push({
        key,
        text: item.plain_text,
        bold,
        italic,
        code,
        href: item.href,
      });
  }

  const md = runs
    .map(({ text, bold, italic, code, href }) => {
      const [, lead, core, trail] = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (!core) return text;
      let md = code ? inlineCode(core) : escapeText(core);
      if (italic) md = `_${md}_`;
      if (bold) md = `**${md}**`;
      if (href) {
        const url = resolveHref(href);
        md = `[${md}](${/[\s()]/.test(url) ? `<${url}>` : url})`;
      }
      return `${lead}${md}${trail}`;
    })
    .join("");

  // A cell is one line: its pipes are escaped and its line breaks become spaces.
  return table
    ? md.replace(/\|/g, "\\|").replace(/\n/g, " ")
    : md.replace(/\n/g, "\\\n");
}

/** A line that would read as a block marker is escaped. */
function escapeLineStart(md) {
  return md.replace(/^(#{1,6}\s|[-+]\s|\d+[.)]\s|>)/gm, "\\$1");
}

// --- Blocks → Markdown -----------------------------------------------------

const CALLOUT_BY_EMOJI = { "💡": "TIP", "⚠️": "WARNING" };
const CODE_LANGUAGE = { "plain text": "text" };

function fence(code) {
  const runs = code.match(/`{3,}/g) ?? [];
  return "`".repeat(Math.max(2, ...runs.map((r) => r.length)) + 1);
}

function quoted(md) {
  return md
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");
}

async function blocksToMarkdown(blocks, saveImage) {
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const data = block[block.type];
    const text = () => escapeLineStart(richText(data.rich_text));

    switch (block.type) {
      case "paragraph":
        if (data.rich_text.length > 0) out.push(text());
        break;
      case "heading_1":
        out.push(`# ${richText(data.rich_text)}`);
        break;
      case "heading_2":
        out.push(`## ${richText(data.rich_text)}`);
        break;
      case "heading_3":
        out.push(`### ${richText(data.rich_text)}`);
        break;
      case "bulleted_list_item":
      case "numbered_list_item": {
        // Consecutive items form one list.
        const items = [];
        for (let n = 1; blocks[i]?.type === block.type; i++, n++) {
          const item = blocks[i];
          const marker = block.type === "bulleted_list_item" ? "-" : `${n}.`;
          let md = `${marker} ${richText(item[item.type].rich_text)}`;
          if (item.children?.length) {
            md += `\n\n${await blocksToMarkdown(item.children, saveImage)}`;
          }
          items.push(
            md.replace(/\n(?=.)/g, `\n${" ".repeat(marker.length + 1)}`)
          );
        }
        i--;
        out.push(items.join("\n"));
        break;
      }
      case "code": {
        const code = data.rich_text.map((t) => t.plain_text).join("");
        const lang = CODE_LANGUAGE[data.language] ?? data.language;
        const f = fence(code);
        out.push(`${f}${lang}\n${code}\n${f}`);
        break;
      }
      case "quote":
        out.push(quoted(text()));
        break;
      case "callout": {
        const emoji = data.icon?.type === "emoji" ? data.icon.emoji : null;
        const kind = CALLOUT_BY_EMOJI[emoji] ?? "NOTE";
        const lead = emoji && !CALLOUT_BY_EMOJI[emoji] ? `${emoji} ` : "";
        out.push(quoted(`[!${kind}]\n${lead}${text()}`));
        break;
      }
      case "divider":
        out.push("---");
        break;
      case "image": {
        const url =
          data.type === "file"
            ? await saveImage(data.file.url)
            : data.external.url;
        // The caption is both the alt text and, as the title, the figcaption.
        const caption = data.caption.map((t) => t.plain_text).join("");
        const alt = caption.replace(/[[\]\\]/g, "\\$&");
        const title = caption ? ` "${caption.replace(/["\\]/g, "\\$&")}"` : "";
        out.push(`![${alt}](${url}${title})`);
        break;
      }
      case "bookmark":
        out.push(`<${data.url}>`);
        break;
      case "table": {
        const rows = block.children.map((row) =>
          row.table_row.cells.map((cell) => richText(cell, { table: true }))
        );
        const line = (cells) => `| ${cells.join(" | ")} |`;
        out.push(
          [
            line(rows[0]),
            line(rows[0].map(() => "---")),
            ...rows.slice(1).map(line),
          ].join("\n")
        );
        break;
      }
      default:
        throw new Error(`Unsupported block type: ${block.type} (${block.id})`);
    }
  }
  return out.join("\n\n");
}

// --- Export ----------------------------------------------------------------

function yamlString(value) {
  return JSON.stringify(value);
}

function frontMatter(article) {
  return [
    "---",
    `title: ${yamlString(article.title)}`,
    `slug: ${article.slug}`,
    ...(article.date ? [`date: ${article.date}`] : []),
    ...(article.author ? [`author: ${yamlString(article.author)}`] : []),
    "---",
  ].join("\n");
}

function imageSaver(dir) {
  const byHash = new Map();
  const names = new Set();
  return async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Image download failed: ${url}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const hash = createHash("sha256").update(bytes).digest("hex");
    if (byHash.has(hash)) return byHash.get(hash);

    const file = decodeURIComponent(new URL(url).pathname.split("/").pop());
    const dot = file.lastIndexOf(".");
    const stem = slugify(dot > 0 ? file.slice(0, dot) : file) || "image";
    const ext = dot > 0 ? file.slice(dot).toLowerCase() : ".png";
    let name = `${stem}${ext}`;
    for (let n = 2; names.has(name); n++) name = `${stem}-${n}${ext}`;
    names.add(name);

    writeFileSync(join(dir, name), bytes);
    byHash.set(hash, name);
    return name;
  };
}

async function main() {
  const pages = await queryPages();

  const articles = [];
  for (const page of pages) {
    const props = page.properties;
    const locale = LOCALE_BY_LANGUAGE[props.Language?.select?.name];
    const title = props.Title.title.map((t) => t.plain_text).join("");
    if (!locale || !title) {
      console.warn(`skipped: ${page.id} (${title || "untitled"})`);
      continue;
    }
    articles.push({
      id: page.id,
      locale,
      title,
      date: props.Date?.date?.start?.slice(0, 10) ?? "",
      author: props.Author?.people?.[0]?.name ?? "",
      translationId: props.Translation?.relation?.[0]?.id ?? null,
    });
  }

  for (const locale of Object.values(LOCALE_BY_LANGUAGE)) {
    assignSlugs(articles.filter((a) => a.locale === locale));
  }

  const byId = new Map(articles.map((a) => [a.id, a]));
  const bareIds = new Map(articles.map((a) => [a.id.replace(/-/g, ""), a]));
  resolveHref = (href) => {
    const match = href.match(
      /^https:\/\/[\w-]+\.notion\.site\/(?:.*-)?([0-9a-f]{32})/
    );
    const target = match && bareIds.get(match[1]);
    if (!target) return href;
    return `${target.locale === "fr" ? "" : `/${target.locale}`}/blog/${
      target.slug
    }`;
  };

  rmSync(OUT, { recursive: true, force: true });
  const done = new Set();
  for (const article of articles) {
    if (done.has(article.id)) continue;
    const translation = byId.get(article.translationId);
    const group = [article, translation].filter(Boolean);
    group.forEach((a) => done.add(a.id));

    const fr = group.find((a) => a.locale === "fr");
    const dir = join(OUT, (fr ?? article).slug);
    mkdirSync(dir, { recursive: true });
    const saveImage = imageSaver(dir);

    for (const a of group) {
      const body = await blocksToMarkdown(await children(a.id), saveImage);
      writeFileSync(
        join(dir, `${a.locale}.md`),
        `${frontMatter(a)}\n\n${body}\n`
      );
    }
    console.log(`${dir}: ${group.map((a) => a.locale).join(" + ")}`);
  }
}

await main();
