import Link from "next/link";

import Wrap from "@/components/Wrap";
import { blog } from "@/lib/i18n/fr/blog";

export default function ArticleNotFound() {
  return (
    <main>
      <Wrap>
        <div className="flex flex-col items-center gap-4 pt-16 pb-24 text-center">
          <h2 className="font-display text-2xl font-bold text-ink">
            {blog.notFound.title}
          </h2>
          <p className="text-muted">{blog.notFound.body}</p>
          <Link
            href="/blog"
            className="inline-block border border-line px-5 py-3 text-[0.9375rem] text-ink transition-colors ease-epure hover:bg-tint"
          >
            {blog.notFound.cta}
          </Link>
        </div>
      </Wrap>
    </main>
  );
}
