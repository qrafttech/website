import Link from "next/link";

import { Article } from "../data";

export default function BlogArticleCard({
  slug,
  title,
  date,
  content,
}: Article) {
  const preview = content.split("\n\n")[0];

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex items-center justify-between border-b border-black/10 py-6 transition-colors hover:border-black/30"
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg font-bold transition-transform group-hover:translate-x-1">
          {title}
        </h3>
        <p className="line-clamp-2 pt-1 text-sm text-zinc-500">{preview}</p>
        <p className="pt-1 text-sm text-zinc-400">{date}</p>
      </div>
      <span className="ml-4 text-zinc-400 transition-transform group-hover:translate-x-1">
        &rarr;
      </span>
    </Link>
  );
}
