import FluidContainer from "../../components/FluidContainer";
import SectionTitle from "../components/SectionTitle";
import BlogArticleCard from "./components/BlogArticleCard";
import { articles } from "./data";

export default function BlogPage() {
  return (
    <FluidContainer>
      <div className="pt-16 pb-24">
        <SectionTitle className="from-[#e77c40] to-[#f8c618] p-6 text-center">
          Nos articles
        </SectionTitle>
        <div className="py-12">
          {articles.map((article) => (
            <BlogArticleCard key={article.slug} {...article} />
          ))}
        </div>
      </div>
    </FluidContainer>
  );
}
