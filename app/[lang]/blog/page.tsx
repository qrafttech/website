import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageHero from "@/app/components/PageHero";
import BlogCard from "@/app/components/BlogCard";
import Pagination from "@/app/components/Pagination";
import Wrap from "@/components/Wrap";
import { fetchArticles } from "@/lib/blog";
import { type Locale, isLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeAlternates } from "@/lib/i18n/metadata";

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

async function ArticleList({
  page,
  lang,
  copy,
}: {
  page: Promise<string | undefined>;
  lang: Locale;
  copy: Awaited<ReturnType<typeof getDictionary>>["blog"];
}) {
  const [pageParam, articles] = await Promise.all([page, fetchArticles(lang)]);

  const totalPages = Math.max(
    1,
    Math.ceil(articles.length / ARTICLES_PER_PAGE)
  );
  const currentPage = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  if (paginatedArticles.length === 0) {
    return (
      <p role="status" className="py-12 text-center text-muted">
        {copy.empty}
      </p>
    );
  }

  return (
    <>
      <ul>
        {paginatedArticles.map((article) => (
          <li key={article.slug}>
            <BlogCard
              article={article}
              href={localePath(lang, `/blog/${article.slug}`)}
            />
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        lang={lang}
        copy={copy.pagination}
      />
    </>
  );
}

interface BlogPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
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
        <div className="py-16 md:py-24">
          <Suspense>
            <ArticleList
              page={searchParams.then((sp) => sp.page)}
              lang={lang}
              copy={t.blog}
            />
          </Suspense>
        </div>
      </Wrap>
    </main>
  );
}
