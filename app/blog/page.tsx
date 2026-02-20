import FluidContainer from "../../components/FluidContainer";
import SectionTitle from "../components/SectionTitle";
import BlogArticleCard from "./components/BlogArticleCard";
import Pagination from "./components/Pagination";
import { articles } from "./data";

const PAGE_SIZE = 10;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const pageArticles = articles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <FluidContainer>
      <div className="pt-16 pb-24">
        <SectionTitle className="from-[#e77c40] to-[#f8c618] p-6 text-center">
          Nos articles
        </SectionTitle>
        <div className="py-12">
          {pageArticles.map((article) => (
            <BlogArticleCard key={article.slug} {...article} />
          ))}
        </div>
        {totalPages > 1 && <Pagination totalPages={totalPages} />}
      </div>
    </FluidContainer>
  );
}
