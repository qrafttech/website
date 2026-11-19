import type { MetadataRoute } from "next";

import {
  type ArticleMeta,
  type Collection,
  articlePath,
  fetchArticles,
} from "@/lib/content";
import {
  LOCALES,
  type Locale,
  localePath,
  otherLocale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type LocalePaths, samePath } from "@/lib/i18n/metadata";
import { SITE_URL } from "@/lib/site";

/** Every locale that has this page, as an absolute URL, for `alternates`. */
function alternates(paths: LocalePaths): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    const path = paths[locale];
    if (path) languages[locale] = `${SITE_URL}${localePath(locale, path)}`;
  }
  return languages;
}

function entry(
  locale: Locale,
  paths: string | LocalePaths,
  rest: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap[number] {
  const byLocale = typeof paths === "string" ? samePath(paths) : paths;
  return {
    url: `${SITE_URL}${localePath(locale, byLocale[locale] ?? "/")}`,
    alternates: { languages: alternates(byLocale) },
    ...rest,
  };
}

/**
 * One entry per article of `collection` in `locale`. An article's slug
 * differs per language, so its alternate is looked up in the same folder
 * rather than assumed from the path.
 */
async function articleEntries(
  collection: Collection,
  locale: Locale
): Promise<MetadataRoute.Sitemap> {
  const other = otherLocale(locale);
  const [articles, siblings] = await Promise.all([
    fetchArticles(collection, locale),
    fetchArticles(collection, other),
  ]);

  return articles.map((article: ArticleMeta) => {
    const translation = siblings.find(
      (candidate) => candidate.dir === article.dir
    );
    const paths: LocalePaths = {
      [locale]: articlePath(collection, article.slug),
      ...(translation
        ? { [other]: articlePath(collection, translation.slug) }
        : {}),
    };

    return entry(locale, paths, {
      ...(article.dateISO ? { lastModified: new Date(article.dateISO) } : {}),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

    entries.push(
      entry(locale, "/blog", { changeFrequency: "weekly", priority: 0.8 })
    );

    entries.push(...(await articleEntries("blog", locale)));

    entries.push(
      entry(locale, "/tmba", { changeFrequency: "weekly", priority: 0.7 })
    );
    entries.push(...(await articleEntries("tmba", locale)));
  }

  return entries;
}
