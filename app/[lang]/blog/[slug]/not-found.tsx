import Link from "next/link";

import Wrap from "@/components/Wrap";
import { DEFAULT_LOCALE, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** The blog only exists in French, so this 404 is French by construction. */
export default async function ArticleNotFound() {
  const t = await getDictionary(DEFAULT_LOCALE);

  return (
    <main>
      <Wrap>
        <div className="flex flex-col items-center gap-4 pt-16 pb-24 text-center">
          <h2 className="font-display text-2xl font-bold text-ink">
            {t.blog.notFound.title}
          </h2>
          <p className="text-muted">{t.blog.notFound.body}</p>
          <Link
            href={localePath(DEFAULT_LOCALE, "/blog")}
            className="inline-block border border-line px-5 py-3 text-[0.9375rem] text-ink transition-colors ease-epure hover:bg-tint"
          >
            {t.blog.notFound.cta}
          </Link>
        </div>
      </Wrap>
    </main>
  );
}
