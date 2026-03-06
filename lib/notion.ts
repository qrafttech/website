import { cacheLife, cacheTag } from "next/cache";
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

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} environment variable is required`);
  return value;
}

const databaseId = requireEnv("NOTION_DATABASE_ID");

const PROP_LANGUAGE = "Language";
const PROP_DATE = "Date";
const PROP_AUTHOR = "Author";

export interface ArticleMeta {
  id: string;
  title: string;
  date: string;
  author: string;
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
): Omit<ArticleMeta, "author"> | null {
  const titleProp = Object.values(page.properties).find(
    (prop) => prop.type === "title",
  );
  if (!titleProp || titleProp.type !== "title") return null;

  const title = extractPlainText(titleProp.title);
  if (!title) return null;

  const dateProp = page.properties[PROP_DATE];
  const date =
    dateProp?.type === "date" && dateProp.date?.start
      ? formatDateFR(dateProp.date.start)
      : "";

  return { id: page.id, title, date };
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

    cursor = response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined;
  } while (cursor);

  return blocks;
}

export async function fetchArticles(): Promise<ArticleMeta[]> {
  "use cache";
  cacheLife("max");
  cacheTag("blog-list");

  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
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
        return { ...meta, author } satisfies ArticleMeta;
      }),
    );

    return articles.filter((a): a is ArticleMeta => a !== null);
  } catch (error) {
    console.error("[notion] fetchArticles failed:", error);
    return [];
  }
}

export async function fetchArticleById(
  id: string,
): Promise<ArticleFull | null> {
  "use cache";
  cacheLife("max");
  cacheTag(`blog-article-${id}`);

  let page: PageObjectResponse;
  try {
    const response = await notion.pages.retrieve({ page_id: id });
    if (!("properties" in response)) return null;
    page = response as PageObjectResponse;
  } catch {
    return null;
  }

  const langProp = page.properties[PROP_LANGUAGE];
  if (langProp?.type !== "select" || langProp.select?.name !== "FR") {
    return null;
  }

  const meta = extractPageMeta(page);
  if (!meta) return null;

  const [author, blocks] = await Promise.all([
    resolveAuthor(page),
    fetchAllBlocks(id),
  ]);

  return { ...meta, author, blocks };
}
