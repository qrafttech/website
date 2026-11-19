import { cacheLife, cacheTag } from "next/cache";

import { fetchArticles, listTag, todayISO } from "@/lib/content";

/**
 * The first Tuesday, from the recurring « Tech My Breath Away » event of the
 * Qraft calendar.
 */
const FIRST_TALK = "2023-02-07";

/**
 * The talks held before they had pages: the instances of that calendar event
 * from `FIRST_TALK` to `until`, both included. Every talk after it is a
 * folder of `content/tmba`, counted on top — a page backfilled for an older
 * talk is already in `count`.
 */
const BEFORE_PAGES = { until: "2026-11-17", count: 162 };

export interface TmbaStats {
  /** Whole years since the first talk. */
  years: number;
  /** Talks held, rounded down to the ten below: the copy says « more than ». */
  talks: number;
}

/**
 * Cached with the list of talks, so it moves when a talk is published or
 * the cron drops the lists.
 */
export async function fetchTmbaStats(): Promise<TmbaStats> {
  "use cache";
  cacheLife("max");
  cacheTag(listTag("tmba", "fr"));

  const today = todayISO();
  const talks = (await fetchArticles("tmba", "fr")).filter(
    (talk) => talk.status === "published" && talk.dateISO > BEFORE_PAGES.until
  ).length;
  const held = BEFORE_PAGES.count + talks;

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
