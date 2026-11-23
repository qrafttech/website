import type { Metadata } from "next";

import {
  DEFAULT_LOCALE,
  LOCALES,
  OG_LOCALE,
  type Locale,
  localePath,
} from "@/lib/i18n/config";
import { OG_IMAGE_SIZE, SITE_NAME, SITE_OG_IMAGE } from "@/lib/site";

/**
 * Where one page lives in each locale, as locale-relative paths. A locale
 * without a version of the page is simply absent — an article that has not
 * been translated yet advertises one language, not a 404.
 */
export type LocalePaths = Partial<Record<Locale, string>>;

/** The common case: the same path in every locale (`/cowork` ↔ `/en/cowork`). */
export function samePath(path: string): LocalePaths {
  return Object.fromEntries(LOCALES.map((locale) => [locale, path]));
}

/**
 * Self-referencing canonical plus the hreflang set, for one page.
 *
 * Takes either a locale-relative path shared by every locale, or an explicit
 * per-locale map for pages whose path differs per language (blog articles).
 * URLs are emitted relative to `metadataBase`.
 *
 * `x-default` points at French, which is what an unmatched Accept-Language
 * gets from the middleware too.
 */
export function localeAlternates(
  locale: Locale,
  paths: string | LocalePaths
): NonNullable<Metadata["alternates"]> {
  const byLocale = typeof paths === "string" ? samePath(paths) : paths;

  const languages: Record<string, string> = {};
  for (const candidate of LOCALES) {
    const path = byLocale[candidate];
    if (path) languages[candidate] = localePath(candidate, path);
  }

  const defaultPath = byLocale[DEFAULT_LOCALE];
  if (defaultPath) {
    languages["x-default"] = localePath(DEFAULT_LOCALE, defaultPath);
  }

  const own = byLocale[locale];
  return {
    ...(own ? { canonical: localePath(locale, own) } : {}),
    languages,
  };
}

/**
 * The metadata of one page: title, description, canonical, hreflang set and
 * link preview. The OpenGraph convention lives here so the routes cannot
 * drift apart.
 *
 * A page that sets no `openGraph` inherits the layout's whole, so its link
 * preview shows the home page's title, description and URL. A page that sets
 * one replaces the layout's instead of merging with it, so what the layout
 * sets (site name, locale, image) is repeated here. `image` is the page's
 * own, already at `OG_IMAGE_SIZE` — an article's link preview — or else the
 * site's. No `twitter` here or in the layout: Next derives the Twitter card
 * from `openGraph`.
 */
export function pageMetadata(
  locale: Locale,
  paths: string | LocalePaths,
  title: string,
  description: string,
  {
    type = "website",
    image = SITE_OG_IMAGE,
  }: { type?: "website" | "article"; image?: string } = {}
): Metadata {
  const own = typeof paths === "string" ? paths : paths[locale] ?? "/";

  return {
    title,
    description,
    alternates: localeAlternates(locale, paths),
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      title,
      description,
      url: localePath(locale, own),
      images: [{ url: image, ...OG_IMAGE_SIZE }],
    },
  };
}
