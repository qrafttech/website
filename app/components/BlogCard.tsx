import clsx from "clsx";
import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  date: string;
  preview?: string;
  compact?: boolean;
}

export default function BlogCard({
  slug,
  title,
  date,
  preview,
  compact,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className={clsx(
        "group flex items-center justify-between border-b border-black/10 transition-colors hover:border-black/30",
        compact ? "py-4" : "py-6"
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg font-bold transition-transform group-hover:translate-x-1">
          {title}
        </h3>
        {preview && (
          <p className="line-clamp-2 pt-1 text-sm text-zinc-500">{preview}</p>
        )}
        <p className="pt-1 text-sm text-zinc-400">{date}</p>
      </div>
      <span className="ml-4 text-zinc-400 transition-transform group-hover:translate-x-1">
        &rarr;
      </span>
    </Link>
  );
}
