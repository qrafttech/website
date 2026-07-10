import Link from "next/link";

import { getDictionary } from "@/lib/i18n";
import { fetchArticles } from "@/lib/notion";

/** Titles shown in the mobile list; the desktop marquee shows all of them. */
const MOBILE_ARTICLES = 3;

export default async function Ticker() {
  const t = getDictionary();
  const articles = (await fetchArticles()).slice(0, 6);

  if (articles.length === 0) return null;

  const links = articles.map((article) => ({
    key: article.id,
    href: `/blog/${article.slug}`,
    title: article.title,
  }));

  const marqueeLinkClass =
    "flex items-center whitespace-nowrap border-r border-line px-7 py-[18px] text-[17px] text-ink2 hover:text-blue";

  return (
    <div className="border-b border-line bg-band min-[900px]:flex min-[900px]:items-stretch">
      <span className="flex items-center gap-[9px] bg-blue px-[26px] py-[18px] font-mono text-[13px] font-bold uppercase tracking-[0.05em] text-white min-[900px]:flex-none min-[900px]:whitespace-nowrap">
        <span aria-hidden className="h-[6px] w-[6px] bg-white" />
        {t.ticker.label}
      </span>

      <ul className="min-[900px]:hidden">
        {links.slice(0, MOBILE_ARTICLES).map((link) => (
          <li key={link.key} className="border-t border-line first:border-t-0">
            <Link
              href={link.href}
              className="block truncate px-6 py-4 text-[15px] text-ink2 hover:text-blue"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>

      <div className="group hidden flex-1 overflow-hidden motion-reduce:overflow-x-auto min-[900px]:block">
        <div className="flex w-max animate-tick items-stretch group-hover:[animation-play-state:paused] motion-reduce:animate-none">
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
