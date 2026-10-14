import Link from "next/link";

import { type Locale, localeHref, localePath } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { fetchArticles } from "@/lib/blog";

const MOBILE_ARTICLES = 3;

export default async function Ticker({
  lang,
  ticker,
}: {
  lang: Locale;
  ticker: Dictionary["ticker"];
}) {
  const articles = (await fetchArticles(lang)).slice(0, 6);

  if (articles.length === 0) return null;

  /* M5 — a signed, dated article is a person thinking in public; an unsigned
     title is content. */
  const links = articles.map((article) => ({
    key: article.slug,
    href: localePath(lang, `/blog/${article.slug}`),
    title: article.title,
    meta: [
      article.author ? `${ticker.bylinePrefix}${article.author}` : "",
      article.date,
    ]
      .filter(Boolean)
      .join(ticker.metaSeparator),
  }));

  const marqueeLinkClass =
    "flex flex-col justify-center whitespace-nowrap border-r border-line px-7 py-[0.875rem] text-[1.0625rem] text-ink2 hover:text-blue";

  const mobileLinkClass = "block px-6 py-4 text-[0.9375rem] text-ink2";

  const metaClass = "font-mono text-[0.6875rem] text-muted";

  return (
    <div className="border-b border-line bg-band nav:flex nav:items-stretch">
      <span className="flex items-center gap-[0.5625rem] bg-blue px-[1.625rem] py-[1.125rem] font-mono text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-white nav:flex-none nav:whitespace-nowrap">
        <span aria-hidden className="h-1.5 w-1.5 bg-white" />
        {ticker.label}
      </span>

      <ul className="nav:hidden">
        {links.slice(0, MOBILE_ARTICLES).map((link) => (
          <li key={link.key} className="border-t border-line first:border-t-0">
            <Link
              href={link.href}
              className={`${mobileLinkClass} hover:text-blue`}
            >
              <span className="block truncate">{link.title}</span>
              {link.meta ? (
                <span className={`mt-1 block ${metaClass}`}>{link.meta}</span>
              ) : null}
            </Link>
          </li>
        ))}
        <li className="border-t border-line">
          <Link
            href={localeHref(lang, ticker.more.href)}
            className={`${mobileLinkClass} font-bold hover:text-blue`}
          >
            {ticker.more.label}
          </Link>
        </li>
      </ul>

      <div className="group hidden flex-1 overflow-hidden motion-reduce:overflow-x-auto nav:block">
        <div className="flex w-max animate-tick items-stretch group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {links.map((link) => (
            <Link key={link.key} href={link.href} className={marqueeLinkClass}>
              <span>{link.title}</span>
              {link.meta ? (
                <span className={`mt-0.5 ${metaClass}`}>{link.meta}</span>
              ) : null}
            </Link>
          ))}
          {links.map((link) => (
            <Link
              key={`dup-${link.key}`}
              href={link.href}
              aria-hidden
              tabIndex={-1}
              className={marqueeLinkClass}
            >
              <span>{link.title}</span>
              {link.meta ? (
                <span className={`mt-0.5 ${metaClass}`}>{link.meta}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
