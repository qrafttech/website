import { nav, footer } from "@/lib/i18n/fr/shell";
import {
  hero,
  ticker,
  offres,
  rotor,
  proof,
  ways,
  final,
} from "@/lib/i18n/fr/landing";
import { blog, notFound } from "@/lib/i18n/fr/blog";
import { cowork } from "@/lib/i18n/fr/cowork";

const fr = {
  nav,
  footer,
  hero,
  ticker,
  offres,
  rotor,
  proof,
  ways,
  final,
  blog,
  notFound,
  cowork,
} as const;

/**
 * `fr` is the reference shape. A future `en.ts` must satisfy `Dictionary`,
 * so a missing key is a type error rather than a missing string at runtime.
 */
export type Dictionary = typeof fr;

export const LOCALES = ["fr"] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = "fr";

const dictionaries: Record<Locale, Dictionary> = { fr };

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale];
}

export type { RichSegment, RichText } from "@/lib/i18n/types";
