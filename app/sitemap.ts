import type { MetadataRoute } from "next";

import { fetchArticles } from "@/lib/notion";
import {
  LOCALES,
  type Locale,
  hasBlog,
  hasTranslation,
  localePath,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";

/** Every locale that has this page, as an absolute URL, for `alternates`. */
function alternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    if (hasTranslation(locale, path)) {
      languages[locale] = `${SITE_URL}${localePath(locale, path)}`;
    }
  }
  return languages;
}

function entry(
  locale: Locale,
  path: string,
  rest: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${localePath(locale, path)}`,
    alternates: { languages: alternates(path) },
    ...rest,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await fetchArticles();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const t = await getDictionary(locale);

    entries.push(
      entry(locale, "/", { changeFrequency: "monthly", priority: 1 })
    );
    entries.push(
      entry(locale, "/cowork", { changeFrequency: "monthly", priority: 0.8 })
    );

    for (const client of t.clients) {
      entries.push(
        entry(locale, `/realisations/${client.slug}`, {
          changeFrequency: "monthly",
          priority: 0.7,
        })
      );
    }

    // The blog is French-only, so it appears under `fr` and nowhere else —
    // listing `/en/blog/…` would submit URLs that 404 by design.
    if (!hasBlog(locale)) continue;

    entries.push(
      entry(locale, "/blog", { changeFrequency: "weekly", priority: 0.8 })
    );

    for (const article of articles) {
      entries.push(
        entry(locale, `/blog/${article.slug}`, {
          ...(article.dateISO
            ? { lastModified: new Date(article.dateISO) }
            : {}),
          changeFrequency: "monthly",
          priority: 0.6,
        })
      );
    }
  }

  return entries;
}
