import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import { parse } from "yaml";

import { type Locale, otherLocale } from "@/lib/i18n/config";

/**
 * The articles, one folder each: `<dir>/fr.md`, `<dir>/en.md` (either may be
 * missing) and the images they reference by file name. The two languages of
 * an article are the two files of one folder.
 */
export const BLOG_DIR = path.join(process.cwd(), "content/blog");

/** Where an article's image is served — see `app/blog-assets`. */
export function assetUrl(dir: string, file: string): string {
  return `/blog-assets/${dir}/${file}`;
}

/**
 * Drafts (no `date`) and scheduled articles (a `date` in the future) are
 * listed on preview deployments, so a PR can be read before it is merged,
 * and never in production.
 */
const SHOW_UNPUBLISHED = process.env.VERCEL_ENV !== "production";

/**
 * `scheduled` and `draft` only ever reach a page outside production, where
 * unpublished articles are listed.
 */
export type ArticleStatus = "published" | "scheduled" | "draft";

export interface ArticleMeta {
  /** The article's folder, shared by its translations and its images. */
  dir: string;
  title: string;
  slug: string;
  date: string;
  dateISO: string;
  author: string;
  status: ArticleStatus;
  /** The `excerpt` field, or else the first paragraph. */
  excerpt: string;
  /** Absolute URL of the cover image, if the article has one. */
  cover: string | null;
}

export interface ArticleFull extends ArticleMeta {
  /** Markdown, with images relative to the article's folder. */
  body: string;
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

function firstParagraph(markdown: string): string {
  const paragraph = fromMarkdown(markdown).children.find(
    (node) => node.type === "paragraph"
  );
  return paragraph ? toString(paragraph) : "";
}

/** Throws on a malformed file, so a broken article fails the build. */
function readArticle(
  dir: string,
  locale: Locale
): Omit<ArticleFull, "status"> | null {
  const file = path.join(BLOG_DIR, dir, `${locale}.md`);
  if (!existsSync(file)) return null;

  const match = readFileSync(file, "utf8").match(
    /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  );
  if (!match) throw new Error(`${file}: missing front matter`);
  const [, front, body] = match;
  const data = parse(front) ?? {};

  const title = String(data.title ?? "");
  const slug = String(data.slug ?? "");
  if (!title || !slug) throw new Error(`${file}: title and slug are required`);

  const dateISO = data.date ? String(data.date) : "";
  if (dateISO && !/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
    throw new Error(`${file}: date must be YYYY-MM-DD`);
  }

  return {
    dir,
    title,
    slug,
    dateISO,
    date: dateISO ? formatDate(dateISO, locale) : "",
    author: String(data.author ?? ""),
    excerpt: data.excerpt ? String(data.excerpt) : firstParagraph(body),
    cover: data.cover ? assetUrl(dir, String(data.cover)) : null,
    body,
  };
}

/**
 * Today as `YYYY-MM-DD` in Paris time — the day boundary articles are
 * scheduled against. `date` is day-precise, so it compares against a
 * calendar day, not an instant.
 */
function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
  }).format(new Date());
}

function statusOf(dateISO: string, today: string): ArticleStatus {
  if (!dateISO) return "draft";
  return dateISO <= today ? "published" : "scheduled";
}

/**
 * The articles of one locale, newest first, drafts on top when they are
 * shown. Each locale has its own list and its own slugs.
 *
 * `date` is the publication date: an article dated in the future is not
 * published yet, and one with no date is a draft. The list is cached until
 * the nightly cron (`/api/cron/publish`) drops it, so "today" is whatever day
 * the cache was last filled — the cron is what releases scheduled articles on
 * their day.
 */
export async function fetchArticles(locale: Locale): Promise<ArticleMeta[]> {
  "use cache";
  cacheLife("max");
  cacheTag(`blog-list-${locale}`);

  const today = todayISO();
  const articles = readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readArticle(entry.name, locale))
    .filter((a) => a !== null)
    .map(({ body: _body, ...meta }) => ({
      ...meta,
      status: statusOf(meta.dateISO, today),
    }))
    .filter((a) => SHOW_UNPUBLISHED || a.status === "published")
    .sort((a, b) => (b.dateISO || "9999").localeCompare(a.dateISO || "9999"));

  const slugs = new Set<string>();
  for (const article of articles) {
    if (slugs.has(article.slug)) {
      throw new Error(`Duplicate ${locale} slug: ${article.slug}`);
    }
    slugs.add(article.slug);
  }

  return articles;
}

export async function fetchArticleBySlug(
  locale: Locale,
  slug: string
): Promise<ArticleFull | null> {
  const articles = await fetchArticles(locale);
  const match = articles.find((a) => a.slug === slug);
  const article = match && readArticle(match.dir, locale);
  return article ? { ...article, status: match.status } : null;
}

/**
 * The same article in the other locale: the other file of its folder. `null`
 * while the article has no translation, or the translation is not listed.
 */
export async function fetchTranslation(
  locale: Locale,
  article: ArticleMeta
): Promise<ArticleMeta | null> {
  const siblings = await fetchArticles(otherLocale(locale));
  return siblings.find((a) => a.dir === article.dir) ?? null;
}
