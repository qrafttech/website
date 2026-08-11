"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import {
  LOCALES,
  LOCALE_SHORT_LABEL,
  type Locale,
  switchLocalePath,
} from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

/**
 * The language switcher, in the N3 rail's own register: Space Mono, uppercase,
 * vertical above the nav breakpoint, exactly like the nav links beside it.
 *
 * A client component for one reason — it needs the CURRENT path, so that
 * `/cowork` switches to `/en/cowork` rather than dumping the reader on the
 * home page. `usePathname()` reports the PUBLIC path (the middleware's rewrite
 * is invisible to the router), which is what makes `switchLocalePath` a pure
 * string function: `/cowork` in, `/en/cowork` out. Reading the path on the
 * server would mean `headers()`, and `headers()` would make every page on the
 * site dynamic to render two links.
 *
 * Where the target locale has no version of the page — the French-only blog —
 * `switchLocalePath` falls back to that locale's home rather than offering a
 * link to a 404.
 */
export default function LangSwitcher({
  lang,
  copy,
}: {
  lang: Locale;
  copy: Dictionary["langSwitcher"];
}) {
  const pathname = usePathname() ?? "/";

  return (
    <ul
      aria-label={copy.label}
      className="flex items-center gap-[0.5rem] nav:flex-col nav:gap-[0.5rem]"
    >
      {LOCALES.map((locale) => {
        const current = locale === lang;

        return (
          <li key={locale}>
            {current ? (
              <span
                aria-current="true"
                className="block font-mono text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-ink nav:text-[0.75rem] nav:tracking-[0.14em] nav:[writing-mode:vertical-rl]"
              >
                {LOCALE_SHORT_LABEL[locale]}
              </span>
            ) : (
              <Link
                href={switchLocalePath(pathname, locale)}
                hrefLang={locale}
                aria-label={copy.toLocale[locale]}
                className={clsx(
                  "block font-mono text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-muted transition-colors ease-epure hover:text-blue",
                  "nav:text-[0.75rem] nav:tracking-[0.14em] nav:[writing-mode:vertical-rl]"
                )}
              >
                {LOCALE_SHORT_LABEL[locale]}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
