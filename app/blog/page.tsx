import { Suspense } from "react";
import CoverBackground from "../components/CoverBackground";
import Menu from "../components/Menu.client";
import FluidContainer from "../../components/FluidContainer";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import { fetchArticles } from "../../lib/notion";

const ARTICLES_PER_PAGE = 10;

async function ArticleList({ page }: { page: Promise<string | undefined> }) {
  const [pageParam, articles] = await Promise.all([page, fetchArticles()]);

  const totalPages = Math.max(
    1,
    Math.ceil(articles.length / ARTICLES_PER_PAGE),
  );
  const currentPage = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE,
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
      <div className="relative">
        <Menu />
        <CoverBackground>
          <div className="w-full max-w-screen-2xl px-4 pt-28 pb-16 md:pt-32 md:pb-20 lg:px-24 xl:px-32">
            <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">
              Nos articles
            </h1>
            <p className="max-w-xl pt-3 text-white/60">
              Retours d&#39;expérience, guides techniques et bonnes pratiques de
              notre équipe.
            </p>
          </div>
        </CoverBackground>
      </div>

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
