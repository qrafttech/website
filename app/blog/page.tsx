import FluidContainer from "../../components/FluidContainer";
import SectionTitle from "../../components/SectionTitle";
import BlogCard from "../components/BlogCard";
import { articles } from "./data";

export default function BlogPage() {
  return (
    <FluidContainer>
      <div className="pt-16 pb-24">
        <SectionTitle className="from-brand-orange to-brand-gold p-6 text-center">
          Nos articles
        </SectionTitle>
        <div className="py-12">
          {articles.map((article) => (
            <BlogCard
              key={article.slug}
              slug={article.slug}
              title={article.title}
              date={article.date}
              preview={article.content.split("\n\n")[0]}
            />
          ))}
        </div>
      </div>
    </FluidContainer>
  );
}
