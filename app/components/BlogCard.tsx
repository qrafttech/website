import clsx from "clsx";
import Link from "next/link";
import type { ArticleMeta } from "../../lib/notion";

interface BlogCardProps {
  article: ArticleMeta;
  compact?: boolean;
}

export default function BlogCard({ article, compact }: BlogCardProps) {
  const { id, title, date, author } = article;
  return (
    <Link
      href={`/blog/${id}`}
      className={clsx(
        "group flex items-center justify-between border-b border-black/10 transition-colors hover:border-black/30",
        compact ? "py-3" : "py-5"
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg font-bold transition-transform group-hover:translate-x-1">
          {title}
        </h3>
        <p className="pt-1 text-sm text-zinc-400">
          {date}
          {author && (
            <>
              <span className="mx-1.5">&middot;</span>
              {author}
            </>
          )}
        </p>
      </div>
      <span className="ml-4 text-zinc-400 transition-transform group-hover:translate-x-1">
        &rarr;
      </span>
    </Link>
  );
}
