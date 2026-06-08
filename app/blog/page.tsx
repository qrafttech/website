import { Suspense } from "react";
import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import FluidContainer from "../../components/FluidContainer";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import { fetchArticles } from "../../lib/notion";

export const metadata: Metadata = {
  title: "Nos articles",
  description:
    "Retours d'expérience, guides techniques et bonnes pratiques de l'équipe Qraft.",
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
        title="Nos articles"
        subtitle={
          <>
            Retours d&#39;expérience, guides techniques et bonnes pratiques de
            notre équipe.
          </>
        }
      />

      <FluidContainer>
        <div className="-mt-8 pb-24">
          <Suspense>
            <ArticleList page={searchParams.then((sp) => sp.page)} />
          </Suspense>
        </div>
      </FluidContainer>
    </main>
  );
}
