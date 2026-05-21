import { cacheLife, cacheTag } from "next/cache";
import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  retry: { maxRetries: 3 },
});

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} environment variable is required`);
  return value;
}

const PROP_LANGUAGE = "Language";
const PROP_DATE = "Date";
const PROP_AUTHOR = "Author";

export interface ArticleMeta {
  id: string;
  title: string;
  date: string;
  dateISO: string;
  author: string;
  slug: string;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[];
};

export interface ArticleFull extends ArticleMeta {
  blocks: NotionBlock[];
}

const MONTHS_FR = [
  "jan",
  "fév",
  "mar",
  "avr",
  "mai",
  "jun",
  "jul",
  "aoû",
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

function extractPageMeta(
  page: PageObjectResponse,
): Omit<ArticleMeta, "author" | "slug"> | null {
  const titleProp = Object.values(page.properties).find(
    (prop) => prop.type === "title",
  );
  if (!titleProp || titleProp.type !== "title") return null;

  const title = extractPlainText(titleProp.title);
  if (!title) return null;

  const dateProp = page.properties[PROP_DATE];
  const dateISO =
    dateProp?.type === "date" && dateProp.date?.start
      ? dateProp.date.start
      : "";
  const date = dateISO ? formatDateFR(dateISO) : "";

  return { id: page.id, title, date, dateISO };
}

async function resolveAuthor(page: PageObjectResponse): Promise<string> {
  const authorProp = page.properties[PROP_AUTHOR];
  if (authorProp?.type !== "people" || authorProp.people.length === 0) {
    return "";
  }

  const firstAuthor = authorProp.people[0];
  if ("name" in firstAuthor && firstAuthor.name) {
    return firstAuthor.name;
  }

  try {
    const user = await notion.users.retrieve({ user_id: firstAuthor.id });
    return user.name ?? "";
  } catch {
    return "";
  }
}

const MAX_BLOCK_DEPTH = 5;

async function fetchAllBlocks(
  blockId: string,
  depth = 0,
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

    const typed = response.results.filter((b): b is NotionBlock => "type" in b);
    await Promise.all(
      typed.map(async (block) => {
        if (block.has_children) {
          block.children = await fetchAllBlocks(block.id, depth + 1);
        }
      }),
    );
    blocks.push(...typed);

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

export async function fetchArticles(): Promise<ArticleMeta[]> {
  "use cache";
  cacheLife("max");
  cacheTag("blog-list");

  try {
    const response = await notion.dataSources.query({
      data_source_id: requireEnv("NOTION_DATABASE_ID"),
      filter: {
        property: PROP_LANGUAGE,
        select: { equals: "FR" },
      },
      sorts: [{ property: PROP_DATE, direction: "descending" }],
    });

    const pages = response.results.filter(
      (r): r is PageObjectResponse => "properties" in r,
    );

    const articles = await Promise.all(
      pages.map(async (p) => {
        const meta = extractPageMeta(p);
        if (!meta) return null;
        const author = await resolveAuthor(p);
        return { ...meta, author } satisfies Omit<ArticleMeta, "slug">;
      }),
    );

    const used = new Set<string>();
    return articles
      .filter((a): a is Omit<ArticleMeta, "slug"> => a !== null)
      .map((a) => {
        const bareId = a.id.replace(/-/g, "");
        const base = slugify(a.title) || bareId;
        const slug = used.has(base) ? `${base}-${bareId.slice(0, 6)}` : base;
        used.add(slug);
        return { ...a, slug };
      });
  } catch (error) {
    console.error("[notion] fetchArticles failed:", error);
    return [];
  }
}

async function fetchArticleBlocks(id: string): Promise<NotionBlock[]> {
  "use cache";
  cacheLife("max");
  cacheTag(`blog-article-${id}`);
  return fetchAllBlocks(id);
}

export async function fetchArticleBySlug(
  slug: string,
): Promise<ArticleFull | null> {
  const articles = await fetchArticles();
  const match = articles.find((a) => a.slug === slug);
  if (!match) return null;

  const blocks = await fetchArticleBlocks(match.id);
  return { ...match, blocks };
}
