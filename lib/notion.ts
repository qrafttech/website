import { cacheLife, cacheTag } from "next/cache";
import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { type Locale, otherLocale } from "@/lib/i18n/config";

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
/** Self-relation: the same article, written in the other language. */
const PROP_TRANSLATION = "Translation";

/** The options of the `Language` select, by site locale. */
const LANGUAGE_BY_LOCALE: Record<Locale, string> = { fr: "FR", en: "EN" };

export interface ArticleMeta {
  id: string;
  title: string;
  date: string;
  dateISO: string;
  author: string;
  slug: string;
  /** Notion id of the same article in the other locale, if it has one. */
  translationId: string | null;
}

function slugify(input: string): string {
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

const MONTHS: Record<Locale, readonly string[]> = {
  fr: [
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
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

/** `12 jan 2026` in French, `Jan 12, 2026` in English. */
function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  const day = d.getUTCDate();
  const month = MONTHS[locale][d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return locale === "fr"
    ? `${day} ${month} ${year}`
    : `${month} ${day}, ${year}`;
}

export function extractPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join("");
}

function extractPageMeta(
  page: PageObjectResponse,
  locale: Locale
): Omit<ArticleMeta, "author" | "slug"> | null {
  const titleProp = Object.values(page.properties).find(
    (prop) => prop.type === "title"
  );
  if (!titleProp || titleProp.type !== "title") return null;

  const title = extractPlainText(titleProp.title);
  if (!title) return null;

  const dateProp = page.properties[PROP_DATE];
  const dateISO =
    dateProp?.type === "date" && dateProp.date?.start
      ? dateProp.date.start
      : "";
  const date = dateISO ? formatDate(dateISO, locale) : "";

  const translationProp = page.properties[PROP_TRANSLATION];
  const translationId =
    translationProp?.type === "relation"
      ? translationProp.relation[0]?.id ?? null
      : null;

  return { id: page.id, title, date, dateISO, translationId };
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

    const typed = response.results.filter((b): b is NotionBlock => "type" in b);
    await Promise.all(
      typed.map(async (block) => {
        if (block.has_children) {
          block.children = await fetchAllBlocks(block.id, depth + 1);
        }
      })
    );
    blocks.push(...typed);

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

/**
 * Today as `YYYY-MM-DD` in Paris time — the day boundary articles are
 * scheduled against. Notion dates are day-precise, so the `Date` property
 * compares against a calendar day, not an instant.
 */
function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
  }).format(new Date());
}

/**
 * The articles of one locale, newest first. An article is one Notion page per
 * language, so each locale is its own list, its own slugs (derived from that
 * language's title) and its own cache entry; the two lists are tied together
 * only by the `Translation` relation.
 *
 * `Date` is the publication date: a page dated in the future is not an
 * article yet, and a page with no date is a draft. The list is cached until
 * the Notion webhook or the nightly cron (`/api/cron/publish`) drops it, so
 * "today" is whatever day the cache was last filled — the cron is what
 * releases scheduled articles on their day.
 */
export async function fetchArticles(locale: Locale): Promise<ArticleMeta[]> {
  "use cache";
  cacheLife("max");
  cacheTag(`blog-list-${locale}`);

  try {
    const response = await notion.dataSources.query({
      data_source_id: requireEnv("NOTION_DATABASE_ID"),
      filter: {
        and: [
          {
            property: PROP_LANGUAGE,
            select: { equals: LANGUAGE_BY_LOCALE[locale] },
          },
          { property: PROP_DATE, date: { on_or_before: todayISO() } },
        ],
      },
      sorts: [{ property: PROP_DATE, direction: "descending" }],
    });

    const pages = response.results.filter(
      (r): r is PageObjectResponse => "properties" in r
    );

    const articles = await Promise.all(
      pages.map(async (p) => {
        const meta = extractPageMeta(p, locale);
        if (!meta) return null;
        const author = await resolveAuthor(p);
        return { ...meta, author } satisfies Omit<ArticleMeta, "slug">;
      })
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
  locale: Locale,
  slug: string
): Promise<ArticleFull | null> {
  const articles = await fetchArticles(locale);
  const match = articles.find((a) => a.slug === slug);
  if (!match) return null;

  const blocks = await fetchArticleBlocks(match.id);
  return { ...match, blocks };
}

/**
 * The same article in the other locale, resolved through the `Translation`
 * relation — its slug comes from its own title, so it cannot be derived from
 * this one. `null` while the article has no translation yet.
 */
export async function fetchTranslation(
  locale: Locale,
  article: ArticleMeta
): Promise<ArticleMeta | null> {
  if (!article.translationId) return null;
  const siblings = await fetchArticles(otherLocale(locale));
  return siblings.find((a) => a.id === article.translationId) ?? null;
}
