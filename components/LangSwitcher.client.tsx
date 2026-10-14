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
 * The language switcher, in the N4 bar's own register: Space Mono, uppercase,
 * horizontal at every width, exactly like the nav links beside it. The two
 * locales are separated by a hairline slash rather than by air — at the right
 * end of a bar that also holds a CTA, two loose mono words read as two more
 * nav items.
 *
 * A client component for one reason — it needs the CURRENT path, so that
 * `/cowork` switches to `/en/cowork` rather than dumping the reader on the
 * home page. `usePathname()` reports the PUBLIC path (the middleware's rewrite
 * is invisible to the router), which is what makes `switchLocalePath` a pure
 * string function: `/cowork` in, `/en/cowork` out. Reading the path on the
 * server would mean `headers()`, and `headers()` would make every page on the
 * site dynamic to render two links.
 *
 * On a blog article the twin's slug is in the twin's file, which this
 * component cannot read, so `switchLocalePath` sends the reader to the target locale's article
 * list; the article page itself links to its exact translation.
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
    <ul aria-label={copy.label} className="flex items-center">
      {LOCALES.map((locale, index) => {
        const current = locale === lang;

        return (
          <li key={locale} className="flex items-center">
            {index > 0 && (
              <span
                aria-hidden="true"
                className="px-1.5 text-[0.6875rem] text-line"
              >
                /
              </span>
            )}
            {current ? (
              <span
                aria-current="true"
                className="block font-mono text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-ink"
              >
                {LOCALE_SHORT_LABEL[locale]}
              </span>
            ) : (
              <Link
                href={switchLocalePath(pathname, locale)}
                hrefLang={locale}
                aria-label={copy.toLocale[locale]}
                className={clsx(
                  "block font-mono text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-muted",
                  "transition-colors ease-epure hover:text-blue"
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
