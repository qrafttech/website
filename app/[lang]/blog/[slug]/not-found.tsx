import Link from "next/link";
import { lang as rootLang } from "next/root-params";

import Wrap from "@/components/Wrap";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * `not-found.tsx` receives no `params`; `[lang]` is a root segment, so its
 * value is read through `next/root-params` — see `app/[lang]/not-found.tsx`.
 */
export default async function ArticleNotFound() {
  const raw = await rootLang();
  const locale =
    typeof raw === "string" && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale);

  return (
    <main>
      <Wrap>
        <div className="flex flex-col items-center gap-4 pt-16 pb-24 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">
            {t.blog.notFound.title}
          </h1>
          <p className="text-muted">{t.blog.notFound.body}</p>
          <Link
            href={localePath(locale, "/blog")}
            className="inline-block border border-line px-5 py-3 text-[0.9375rem] text-ink transition-colors ease-epure hover:bg-tint"
          >
            {t.blog.notFound.cta}
          </Link>
        </div>
      </Wrap>
    </main>
  );
}
