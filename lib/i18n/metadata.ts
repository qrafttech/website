import type { Metadata } from "next";

import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  hasTranslation,
  localePath,
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
  const languages: Record<string, string> = {};

  for (const candidate of LOCALES) {
    if (hasTranslation(candidate, path)) {
      languages[candidate] = localePath(candidate, path);
    }
  }

  if (hasTranslation(DEFAULT_LOCALE, path)) {
    languages["x-default"] = localePath(DEFAULT_LOCALE, path);
  }

  return { canonical: localePath(locale, path), languages };
}
