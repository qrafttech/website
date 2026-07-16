import Link from "next/link";

import { ticker } from "@/lib/i18n/fr/landing";
import { fetchArticles } from "@/lib/notion";

const MOBILE_ARTICLES = 3;

export default async function Ticker() {
  const articles = (await fetchArticles()).slice(0, 6);

  if (articles.length === 0) return null;

  const links = articles.map((article) => ({
    key: article.id,
    href: `/blog/${article.slug}`,
    title: article.title,
  }));

  const marqueeLinkClass =
    "flex items-center whitespace-nowrap border-r border-line px-7 py-[1.125rem] text-[1.0625rem] text-ink2 hover:text-blue";

  const mobileLinkClass =
    "block px-6 py-4 text-[0.9375rem] text-ink2 hover:text-blue";

  return (
    <div className="border-b border-line bg-band nav:flex nav:items-stretch">
      <span className="flex items-center gap-[0.5625rem] bg-blue px-[1.625rem] py-[1.125rem] font-mono text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-white nav:flex-none nav:whitespace-nowrap">
        <span aria-hidden className="h-1.5 w-1.5 bg-white" />
        {ticker.label}
      </span>

      <ul className="nav:hidden">
        {links.slice(0, MOBILE_ARTICLES).map((link) => (
          <li key={link.key} className="border-t border-line first:border-t-0">
            <Link href={link.href} className={`${mobileLinkClass} truncate`}>
              {link.title}
            </Link>
          </li>
        ))}
        <li className="border-t border-line">
          <Link
            href={ticker.more.href}
            className={`${mobileLinkClass} font-bold`}
          >
            {ticker.more.label}
          </Link>
        </li>
      </ul>

      <div className="group hidden flex-1 overflow-hidden motion-reduce:overflow-x-auto nav:block">
        <div className="flex w-max animate-tick items-stretch group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {links.map((link) => (
            <Link key={link.key} href={link.href} className={marqueeLinkClass}>
              {link.title}
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
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
