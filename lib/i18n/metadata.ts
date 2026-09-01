import type { Metadata } from "next";

import {
  DEFAULT_LOCALE,
  type Locale,
  hasTranslation,
  localePath,
  translatedLocales,
} from "@/lib/i18n/config";

/**
 * Self-referencing canonical plus the hreflang set, for one page.
 *
 * `path` is locale-relative — `/`, `/cowork`, `/blog/mon-article` — and the
 * URLs are emitted relative to `metadataBase`. A locale that has no version of
 * the page is left out of `languages` rather than pointed at a 404: the blog
 * is French-only, so its pages advertise `fr` and nothing else.
 *
 * `x-default` points at French, which is what an unmatched Accept-Language
 * gets from the middleware too.
 */
export function localeAlternates(
  locale: Locale,
  path: string
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = Object.fromEntries(
    translatedLocales(path).map((candidate) => [
      candidate,
      localePath(candidate, path),
    ])
  );

  if (hasTranslation(DEFAULT_LOCALE, path)) {
    languages["x-default"] = localePath(DEFAULT_LOCALE, path);
  }

  return { canonical: localePath(locale, path), languages };
}

/**
 * An article-shaped page — a blog post or a case study. The OpenGraph/Twitter
 * convention lives here so the two routes cannot drift apart. The site shell's
 * own metadata is `type: "website"` and stays in the layout.
 */
export function articleMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: "article",
      title,
      description,
      url: localePath(locale, path),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
