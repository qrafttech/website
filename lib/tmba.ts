import { cacheLife, cacheTag } from "next/cache";

import { fetchArticles } from "@/lib/blog";

/**
 * The first Tuesday, from the recurring « Tech My Breath Away » event of the
 * Qraft calendar.
 */
const FIRST_TALK = "2023-02-07";

/**
 * The talks held before any of them was written up: the instances of that
 * calendar event from `FIRST_TALK` to `until`, both included. Every TMBA
 * article dated after it counts on top. A talk not written up (its speaker
 * declined) is not counted, so the figure is a floor.
 */
const BEFORE_ARTICLES = { until: "2026-11-17", count: 162 };

export interface TmbaStats {
  /** Whole years since the first talk. */
  years: number;
  /** Talks held, rounded down to the ten below: the copy says « more than ». */
  talks: number;
}

/** Today as `YYYY-MM-DD` in Paris time. */
function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
  }).format(new Date());
}

/**
 * Cached with the French list, so it moves when a talk is published or the
 * cron drops the lists.
 */
export async function fetchTmbaStats(): Promise<TmbaStats> {
  "use cache";
  cacheLife("max");
  cacheTag("blog-list-fr");

  const today = todayISO();
  const written = (await fetchArticles("fr")).filter(
    (article) =>
      article.tmba &&
      article.status === "published" &&
      article.dateISO > BEFORE_ARTICLES.until
  ).length;
  const held = BEFORE_ARTICLES.count + written;

  const [y0, m0, d0] = FIRST_TALK.split("-").map(Number);
  const [y, m, d] = today.split("-").map(Number);
  const years = y - y0 - (m < m0 || (m === m0 && d < d0) ? 1 : 0);

  return { years, talks: Math.floor((held - 1) / 10) * 10 };
}

/** `{years}` and `{talks}` in a dictionary string. */
export function fillTmbaStats(text: string, stats: TmbaStats): string {
  return text
    .replace("{years}", String(stats.years))
    .replace("{talks}", String(stats.talks));
}
