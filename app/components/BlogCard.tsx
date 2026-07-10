import clsx from "clsx";
import Link from "next/link";
import type { ArticleMeta } from "@/lib/notion";

interface BlogCardProps {
  article: ArticleMeta;
  compact?: boolean;
}

export default function BlogCard({ article, compact }: BlogCardProps) {
  const { slug, title, date, author } = article;
  return (
    <Link
      href={`/blog/${slug}`}
      className={clsx(
        "group flex items-center justify-between border-b border-hair transition-colors ease-epure hover:border-line",
        compact ? "py-3" : "py-5"
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-base font-semibold text-ink transition-colors ease-epure group-hover:text-blue md:text-lg">
          {title}
        </h3>
        <p className="pt-2 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {date}
          {author && (
            <>
              <span className="mx-1.5">&middot;</span>
              {author}
            </>
          )}
        </p>
      </div>
      <span className="ml-4 text-muted transition-transform ease-epure group-hover:translate-x-1 group-hover:text-blue">
        &rarr;
      </span>
    </Link>
  );
}
