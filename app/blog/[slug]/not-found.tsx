import Link from "next/link";

import Wrap from "@/components/Wrap";
import { getDictionary } from "@/lib/i18n";

export default function ArticleNotFound() {
  const t = getDictionary();

  return (
    <main>
      <Wrap>
        <div className="flex flex-col items-center gap-4 pt-16 pb-24 text-center">
          <h2 className="font-display text-2xl font-bold text-ink">
            {t.blog.notFound.title}
          </h2>
          <p className="text-muted">{t.blog.notFound.body}</p>
          <Link
            href="/blog"
            className="inline-block border border-line px-5 py-3 text-[15px] text-ink transition-colors ease-epure hover:bg-tint"
          >
            {t.blog.notFound.cta}
          </Link>
        </div>
      </Wrap>
    </main>
  );
}
