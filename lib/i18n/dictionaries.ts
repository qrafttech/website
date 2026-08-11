import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import type { Client, Dictionary } from "@/lib/i18n/types";

/**
 * One `import()` per locale, written out longhand.
 *
 * A computed path (`import("./" + locale)`) would work at runtime and defeat
 * the bundler: it cannot see which files are reachable, so it either bundles
 * every candidate into one chunk or gives up on splitting. Enumerating the
 * locales gives each dictionary its own chunk, so an English reader never
 * downloads the French copy and vice versa — which matters here, because the
 * copy files are the largest non-image payload on the site.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import("@/lib/i18n/fr").then((module) => module.fr),
  en: () => import("@/lib/i18n/en").then((module) => module.en),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE])();
}

/** Resolve a case study by slug. Slugs are identical across locales. */
export function getClient(
  clients: readonly Client[],
  slug: string
): Client | undefined {
  return clients.find((client) => client.slug === slug);
}
