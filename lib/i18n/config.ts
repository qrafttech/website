/* ---------------------------------------------------------------------------
 * Locale configuration — the only i18n module the middleware may import.
 *
 * Keep it free of any import: `middleware.ts` runs on the edge runtime and
 * pulling a dictionary (or anything that transitively reaches `next/image`)
 * into that bundle is how a 4 KB middleware becomes a 400 KB one.
 *
 * Routing contract, settled in `.claude/deliverable.md` § "Second axis":
 *
 *   | Public URL          | Internal                 |
 *   | ------------------- | ------------------------ |
 *   | `/`                 | `app/[lang]` (fr)        |
 *   | `/cowork`           | `app/[lang]/cowork`      |
 *   | `/blog/mon-article` | `app/[lang]/blog/[slug]` |
 *   | `/en`               | `app/[lang]` (en)        |
 *   | `/en/cowork`        | `app/[lang]/cowork`      |
 *
 * French is the default locale and keeps every URL it has today — no prefix,
 * no redirect. The middleware REWRITES `/…` to `/fr/…` internally.
 * ------------------------------------------------------------------------ */

export const LOCALES = ["fr", "en"] as const;

export type Locale = typeof LOCALES[number];

/** French is unprefixed. Changing this changes every public URL on the site. */
export const DEFAULT_LOCALE: Locale = "fr";

/** Locales that carry a URL prefix — every locale except the default one. */
export const PREFIXED_LOCALES: readonly Locale[] = LOCALES.filter(
  (locale) => locale !== DEFAULT_LOCALE
);

/** `<html lang>` values, and the OpenGraph `locale` tags. */
export const HTML_LANG: Record<Locale, string> = { fr: "fr", en: "en" };
export const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

/** What the language switcher renders. Locale-independent by design. */
export const LOCALE_SHORT_LABEL: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * The blog is French-only — articles are written in French and there is no
 * translation pipeline. On any other locale the nav link, the hero ticker and
 * the sitemap entries are absent, and `/…/blog` 404s rather than serving
 * French prose under an English URL.
 */
export function hasBlog(locale: Locale): boolean {
  return locale === "fr";
}

/** Whether a locale-relative path exists in the given locale at all. */
export function hasTranslation(locale: Locale, path: string): boolean {
  if (path === "/blog" || path.startsWith("/blog/")) return hasBlog(locale);
  return true;
}

/**
 * Turn a locale-relative path (`/`, `/cowork`, `/blog/x`) into the public URL
 * for `locale`. The default locale is returned untouched.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/**
 * Same, for an `href` out of a dictionary, which may also be external, a bare
 * fragment, or a `mailto:`. Those are returned untouched; anything else is
 * prefixed, fragment preserved (`/#contact` → `/en#contact`).
 */
export function localeHref(locale: Locale, href: string): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return href;

  const hashAt = href.indexOf("#");
  const path = hashAt === -1 ? href : href.slice(0, hashAt);
  const hash = hashAt === -1 ? "" : href.slice(hashAt);

  return `${localePath(locale, path || "/")}${hash}`;
}

/**
 * Split a public pathname into its locale and its locale-relative path.
 * `/en/cowork` → `{ locale: "en", path: "/cowork" }`
 * `/cowork`    → `{ locale: "fr", path: "/cowork" }`
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  // Every locale, the default one included. `/fr/cowork` is not a public URL,
  // but it IS the path a component sees while a French page is being
  // prerendered — the proxy's rewrite is what the router renders. Stripping it
  // here is what stops the switcher from building `/en/fr/cowork` at build
  // time and then disagreeing with the client, where the path reads `/cowork`.
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return { locale, path: "/" };
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) };
    }
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/**
 * Where the switcher sends a reader who is on `pathname` and asks for
 * `target`. The current path is preserved (`/cowork` ↔ `/en/cowork`); when the
 * page has no equivalent in the target locale — the French-only blog — it
 * falls back to that locale's home rather than to a 404.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const { path } = splitLocale(pathname);
  return hasTranslation(target, path)
    ? localePath(target, path)
    : localePath(target, "/");
}
