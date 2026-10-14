import { NextResponse, type NextRequest } from "next/server";

import {
  DEFAULT_LOCALE,
  PREFIXED_LOCALES,
  localePath,
} from "@/lib/i18n/config";

/**
 * Locale routing — a REWRITE, never a redirect.
 *
 * The official Next i18n example redirects `/` to `/<locale>`, which is
 * exactly what this site must not do: French is the default locale and keeps
 * every URL it has today, so `/cowork` must stay `/cowork` in the address bar
 * and must answer 200, not 307. A rewrite changes the internal path only —
 * Next renders `app/[lang]/cowork` with `lang = "fr"` and the browser never
 * learns that `/fr` exists.
 *
 * `/en/*` is already an internal path and passes through untouched.
 * `/fr/*` is the internal form leaking out; it is redirected back to the
 * canonical unprefixed URL so the two forms never both index. That is safe —
 * `/fr/*` has never been a public URL on this site, so no live link breaks.
 *
 * Rewrites do not re-enter the proxy, so there is no loop here.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const locale of PREFIXED_LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return NextResponse.next();
    }
  }

  if (
    pathname === `/${DEFAULT_LOCALE}` ||
    pathname.startsWith(`/${DEFAULT_LOCALE}/`)
  ) {
    const canonical = request.nextUrl.clone();
    canonical.pathname = localePath(
      DEFAULT_LOCALE,
      pathname.slice(DEFAULT_LOCALE.length + 1) || "/"
    );
    return NextResponse.redirect(canonical, 308);
  }

  const internal = request.nextUrl.clone();
  internal.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(internal);
}

export const config = {
  /**
   * Everything except the API routes, the PostHog proxy (`/ingest`, rewritten
   * in next.config.js), Next's own asset pipelines, the
   * root-level metadata routes (`app/robots.ts`, `app/sitemap.ts` — they live
   * outside `[lang]` and a rewrite would 404 them) and anything with a file
   * extension, which is `public/` and the favicons. No page slug on this site
   * contains a dot.
   *
   * `middleware.ts` is the deprecated spelling of this file in Next 16; the
   * convention is `proxy.ts` with a named `proxy` export.
   */
  matcher: [
    "/((?!api|ingest|_next/static|_next/image|robots\\.txt|sitemap\\.xml|.*\\.[^/]*$).*)",
  ],
};
