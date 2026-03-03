import { cacheTag } from "next/cache";
import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  retry: { maxRetries: 3 },
});
const databaseId = process.env.NOTION_DATABASE_ID!;

const PROP_LANGUAGE = "Language";
const PROP_DATE = "Date";
const PROP_AUTHOR = "Author";
const PROP_SLUG = "Slug";

export interface ArticleMeta {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  preview: string;
}

export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[];
};

export interface ArticleFull extends ArticleMeta {
  blocks: NotionBlock[];
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const MONTHS_FR = [
  "jan",
  "fev",
  "mar",
  "avr",
  "mai",
  "jun",
  "jul",
  "aou",
  "sep",
  "oct",
  "nov",
  "dec",
];

function formatDateFR(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${
    MONTHS_FR[d.getUTCMonth()]
  } ${d.getUTCFullYear()}`;
}

export function extractPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join("");
}

async function fetchAllBlocks(blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });

    const typed = response.results.filter((b): b is NotionBlock => "type" in b);
    await Promise.all(
      typed.map(async (block) => {
        if (block.has_children) {
          block.children = await fetchAllBlocks(block.id);
        }
      })
    );
    blocks.push(...typed);

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

const userNameCache = new Map<string, string>();

async function getUserName(userId: string): Promise<string> {
  const cached = userNameCache.get(userId);
  if (cached !== undefined) return cached;
  try {
    const user = await notion.users.retrieve({ user_id: userId });
    const name = user.name ?? "";
    userNameCache.set(userId, name);
    return name;
  } catch {
    userNameCache.set(userId, "");
    return "";
  }
}

export async function fetchArticles(): Promise<ArticleMeta[]> {
  "use cache";
  cacheTag("blog-articles");

  const response = await notion.dataSources.query({
    data_source_id: databaseId,
    filter: {
      property: PROP_LANGUAGE,
      select: { equals: "FR" },
    },
    sorts: [{ property: PROP_DATE, direction: "descending" }],
  });

  const pages = response.results.filter(
    (r): r is PageObjectResponse => "properties" in r
  );

  const articles = await Promise.all(
    pages.map(async (p) => {
      const titleProp = Object.values(p.properties).find(
        (prop) => prop.type === "title"
      );
      if (!titleProp || titleProp.type !== "title") return null;

      const title = extractPlainText(titleProp.title);
      if (!title) return null;

      const slugProp = p.properties[PROP_SLUG];
      const customSlug =
        slugProp?.type === "rich_text"
          ? extractPlainText(slugProp.rich_text).trim()
          : "";

      const dateProp = p.properties[PROP_DATE];
      const dateStr =
        dateProp?.type === "date" && dateProp.date?.start
          ? formatDateFR(dateProp.date.start)
          : "";

      const firstBlocks = await notion.blocks.children.list({
        block_id: p.id,
        page_size: 10,
      });

      let preview = "";
      let pastDivider = false;
      for (const block of firstBlocks.results) {
        if (!("type" in block)) continue;
        const typed = block as BlockObjectResponse;
        if (typed.type === "divider") {
          pastDivider = true;
          continue;
        }
        if (pastDivider && typed.type === "paragraph") {
          preview = extractPlainText(typed.paragraph.rich_text);
          if (preview) break;
        }
      }

      const authorProp = p.properties[PROP_AUTHOR];
      let author = "";
      if (authorProp?.type === "people" && authorProp.people.length > 0) {
        const firstAuthor = authorProp.people[0];
        author =
          "name" in firstAuthor && firstAuthor.name
            ? firstAuthor.name
            : await getUserName(firstAuthor.id);
      }

      return {
        id: p.id,
        slug: customSlug || slugify(title),
        title,
        date: dateStr,
        author,
        preview,
      } satisfies ArticleMeta;
    })
  );

  return articles.filter((a): a is ArticleMeta => a !== null);
}

export async function fetchArticleBySlug(
  slug: string
): Promise<ArticleFull | null> {
  "use cache";
  cacheTag("blog-articles");

  const articles = await fetchArticles();
  const meta = articles.find((a) => a.slug === slug);
  if (!meta) return null;

  const blocks = await fetchAllBlocks(meta.id);
  return { ...meta, blocks };
}
