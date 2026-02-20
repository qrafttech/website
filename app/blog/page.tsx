import FluidContainer from "../../components/FluidContainer";
import SectionTitle from "../../components/SectionTitle";
import BlogCard from "../components/BlogCard";
import Pagination from "./components/Pagination";
import { articles } from "./data";

const PAGE_SIZE = 10;

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams;
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const currentPage = Math.max(1, Math.min(Number(page) || 1, totalPages));
  const pageArticles = articles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <FluidContainer>
      <div className="pt-16 pb-24">
        <SectionTitle className="from-brand-orange to-brand-gold p-6 text-center">
          Nos articles
        </SectionTitle>
        <div className="py-12">
          {pageArticles.map((article) => (
            <BlogCard
              key={article.slug}
              slug={article.slug}
              title={article.title}
              date={article.date}
              preview={article.content.split("\n\n")[0]}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        )}
      </div>
    </FluidContainer>
  );
}
