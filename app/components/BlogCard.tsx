import Link from "next/link";

import Eyebrow from "@/components/Eyebrow";
import type { ArticleMeta } from "@/lib/blog";

interface BlogCardProps {
  article: ArticleMeta;
  /** Locale-prefixed by the caller — the card does not know its locale. */
  href: string;
}

export default function BlogCard({ article, href }: BlogCardProps) {
  const { title, date, dateISO, author } = article;
  return (
    <Link
      href={href}
      className="group flex items-center justify-between border-b border-hair py-5 transition-colors ease-epure hover:border-line"
    >
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-base font-semibold text-ink transition-colors ease-epure group-hover:text-blue md:text-lg">
          {title}
        </h2>
        <Eyebrow className="pt-2">
          {dateISO ? <time dateTime={dateISO}>{date}</time> : date}
          {author && (
            <>
              <span className="mx-1.5">&middot;</span>
              {author}
            </>
          )}
        </Eyebrow>
      </div>
      <span className="ml-4 text-muted transition-transform ease-epure group-hover:translate-x-1 group-hover:text-blue">
        &rarr;
      </span>
    </Link>
  );
}
