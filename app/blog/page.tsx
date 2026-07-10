import { Suspense } from "react";
import type { Metadata } from "next";

import PageHero from "@/app/components/PageHero";
import BlogCard from "@/app/components/BlogCard";
import Pagination from "@/app/components/Pagination";
import Wrap from "@/components/Wrap";
import { fetchArticles } from "@/lib/notion";
import { getDictionary } from "@/lib/i18n";

const t = getDictionary();

export const metadata: Metadata = {
  title: t.blog.title,
  description: t.blog.metaDescription,
  alternates: { canonical: "/blog" },
};

const ARTICLES_PER_PAGE = 10;

async function ArticleList({ page }: { page: Promise<string | undefined> }) {
  const [pageParam, articles] = await Promise.all([page, fetchArticles()]);

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
      {paginatedArticles.map((article) => (
        <BlogCard key={article.id} article={article} />
      ))}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <main>
      <PageHero
        eyebrow={t.blog.eyebrow}
        title={t.blog.title}
        subtitle={t.blog.subtitle}
      />

      <Wrap>
        <div className="py-16 md:py-24">
          <Suspense>
            <ArticleList page={searchParams.then((sp) => sp.page)} />
          </Suspense>
        </div>
      </Wrap>
    </main>
  );
}
