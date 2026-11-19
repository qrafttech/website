import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageHero from "@/app/components/PageHero";
import clsx from "clsx";

import BlogCard from "@/app/components/BlogCard";
import Pagination from "@/app/components/Pagination";
import Wrap from "@/components/Wrap";
import CtaLink from "@/components/CtaLink";
import MonoLink from "@/components/MonoLink";
import { fetchArticles } from "@/lib/blog";
import { type Locale, isLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeAlternates } from "@/lib/i18n/metadata";
import type { Dictionary } from "@/lib/i18n/types";
import { fetchTmbaStats, fillTmbaStats } from "@/lib/tmba";

/**
 * One list per locale. An article is a folder with one Markdown file per
 * language, so `/blog` lists the French files and `/en/blog` the English ones
 * — an article that exists in only one language appears in that list alone.
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
    title: t.blog.title,
    description: t.blog.metaDescription,
    alternates: localeAlternates(lang, "/blog"),
  };
}

const ARTICLES_PER_PAGE = 10;

/** `?type=tmba` keeps the Tech My Breath Away talks only. */
type Filter = "all" | "tmba";

function Filters({
  lang,
  current,
  copy,
}: {
  lang: Locale;
  current: Filter;
  copy: Dictionary["blog"]["filters"];
}) {
  const index = localePath(lang, "/blog");
  const filters = [
    { key: "all", label: copy.all, href: index },
    { key: "tmba", label: copy.tmba, href: `${index}?type=tmba` },
  ] as const;

  return (
    <nav aria-label={copy.label} className="flex gap-8 border-b border-hair">
      {filters.map((filter) => (
        <MonoLink
          key={filter.key}
          href={filter.href}
          aria-current={filter.key === current ? "page" : undefined}
          className={clsx(
            "-mb-px border-b-2 py-4",
            filter.key === current
              ? "border-ink text-ink"
              : "border-transparent text-muted"
          )}
        >
          {filter.label}
        </MonoLink>
      ))}
    </nav>
  );
}

/** Above the talks: what the Tuesday breakfast is, and how to join it. */
async function TmbaIntro({ copy }: { copy: Dictionary["tmba"] }) {
  const stats = await fetchTmbaStats();

  return (
    <div className="grid gap-10 pt-12 pb-4 nav:grid-cols-[1.45fr_1fr] nav:gap-16">
      <section>
        <h2 className="text-section font-bold">{copy.title}</h2>
        <div className="mt-6 max-w-[60ch] space-y-5 text-[1.0625rem] leading-[1.7] text-muted">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{fillTmbaStats(paragraph, stats)}</p>
          ))}
        </div>
      </section>
      <div className="flex flex-col gap-5">
        {copy.join.map((block) => (
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
  );
}

async function ArticleList({
  search,
  lang,
  t,
}: {
  search: Promise<{ page?: string; type?: string }>;
  lang: Locale;
  t: Dictionary;
}) {
  const copy = t.blog;
  const [{ page: pageParam, type }, all] = await Promise.all([
    search,
    fetchArticles(lang),
  ]);
  const filter: Filter = type === "tmba" ? "tmba" : "all";
  const articles =
    filter === "tmba" ? all.filter((article) => article.tmba) : all;

  const totalPages = Math.max(
    1,
    Math.ceil(articles.length / ARTICLES_PER_PAGE)
  );
  const currentPage = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  return (
    <>
      <Filters lang={lang} current={filter} copy={copy.filters} />
      {filter === "tmba" && <TmbaIntro copy={t.tmba} />}
      {paginatedArticles.length === 0 ? (
        <p role="status" className="py-12 text-center text-muted">
          {copy.empty}
        </p>
      ) : (
        <>
          <ul>
            {paginatedArticles.map((article) => (
              <li key={article.slug}>
                <BlogCard
                  article={article}
                  href={localePath(lang, `/blog/${article.slug}`)}
                  status={copy.status}
                  tmbaLabel={copy.tmba}
                />
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            lang={lang}
            copy={copy.pagination}
            query={filter === "tmba" ? "type=tmba" : undefined}
          />
        </>
      )}
    </>
  );
}

interface BlogPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}

export default async function BlogPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getDictionary(lang);

  return (
    <main>
      <PageHero title={t.blog.title} subtitle={t.blog.subtitle} />

      <Wrap>
        <div className="pb-16 md:pb-24">
          <Suspense>
            <ArticleList search={searchParams} lang={lang} t={t} />
          </Suspense>
        </div>
      </Wrap>
    </main>
  );
}
