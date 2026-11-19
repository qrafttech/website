import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageHero from "@/app/components/PageHero";
import BlogCard from "@/app/components/BlogCard";
import BlogTabs from "@/app/components/BlogTabs";
import Wrap from "@/components/Wrap";
import CtaLink from "@/components/CtaLink";
import { articlePath, fetchArticles } from "@/lib/content";
import { fetchTmbaStats, fillTmbaStats } from "@/lib/tmba";
import { type Locale, isLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeAlternates } from "@/lib/i18n/metadata";
import type { Dictionary } from "@/lib/i18n/types";

/**
 * Tech My Breath Away, the Tuesday tech breakfast: the format, how to come or
 * give a talk, and the talks. Like the blog, one list per locale — a talk is
 * a folder of `content/tmba` with one Markdown file per language.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const t = await getDictionary(lang);

  return {
    title: t.tmba.title,
    description: t.tmba.metaDescription,
    alternates: localeAlternates(lang, "/tmba"),
  };
}

async function TalkList({
  lang,
  copy,
}: {
  lang: Locale;
  copy: Dictionary["tmba"];
}) {
  const talks = await fetchArticles("tmba", lang);

  if (talks.length === 0) {
    return (
      <p role="status" className="py-12 text-center text-muted">
        {copy.empty}
      </p>
    );
  }

  return (
    <ul>
      {talks.map((talk) => (
        <li key={talk.slug}>
          <BlogCard
            article={talk}
            href={localePath(lang, articlePath("tmba", talk.slug))}
            status={copy.status}
          />
        </li>
      ))}
    </ul>
  );
}

export default async function TmbaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [dictionary, stats] = await Promise.all([
    getDictionary(lang),
    fetchTmbaStats(),
  ]);
  const t = dictionary.tmba;

  return (
    <main>
      <PageHero title={t.title} subtitle={t.subtitle} />
      <BlogTabs lang={lang} current="tmba" copy={dictionary.blog.tabs} />

      <Wrap>
        <div className="grid gap-12 py-16 md:py-24 nav:grid-cols-[1.45fr_1fr] nav:gap-16">
          <section>
            <h2 className="text-section font-bold">{t.format.title}</h2>
            <div className="mt-6 max-w-[60ch] space-y-5 text-[1.0625rem] leading-[1.7] text-muted">
              {t.format.paragraphs.map((paragraph) => (
                <p key={paragraph}>{fillTmbaStats(paragraph, stats)}</p>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-5">
            {t.join.map((block) => (
              <section key={block.key} className="border border-hair p-6">
                <h3 className="font-display text-lg font-semibold">
                  {block.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.7] text-muted">
                  {block.body}
                </p>
                <CtaLink href={block.cta.href} size="sm" className="mt-5">
                  {block.cta.label}
                </CtaLink>
              </section>
            ))}
          </div>
        </div>

        <section className="pb-24">
          <h2 className="border-b border-line pb-6 text-section font-bold">
            {t.talksTitle}
          </h2>
          <TalkList lang={lang} copy={t} />
        </section>
      </Wrap>
    </main>
  );
}
