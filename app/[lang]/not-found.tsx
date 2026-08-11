import { lang as rootLang } from "next/root-params";

import Wrap from "@/components/Wrap";
import Eyebrow from "@/components/Eyebrow";
import CtaLink from "@/components/CtaLink";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * `not-found.tsx` receives no `params` — React renders it in place of a page
 * that failed, not as a route of its own. `next/root-params` is the way out:
 * `[lang]` is a ROOT dynamic segment (this app has no layout above it), so its
 * value is readable from any Server Component in the tree, including this one.
 * A 404 reached through `/en/…` therefore answers in English, inside the same
 * rail and footer as every other English page.
 */
export default async function NotFound() {
  const raw = await rootLang();
  const locale =
    typeof raw === "string" && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale);

  return (
    <main>
      <Wrap>
        <div className="grid gap-x-16 gap-y-10 py-32 md:py-44 nav:grid-cols-[1.45fr_1fr] nav:items-end">
          <div>
            <Eyebrow>{t.notFound.eyebrow}</Eyebrow>
            <h1 className="mt-5 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.02] text-ink">
              {t.notFound.title}
            </h1>
          </div>
          <div className="flex flex-col items-start gap-7 nav:pb-2">
            <p className="max-w-[42ch] text-muted">{t.notFound.body}</p>
            <CtaLink href={localePath(locale, "/")}>{t.notFound.cta}</CtaLink>
          </div>
        </div>
      </Wrap>
    </main>
  );
}
