import CoverBackground from "../components/CoverBackground";
import Menu from "../components/Menu.client";
import FluidContainer from "../../components/FluidContainer";
import BlogCard from "../components/BlogCard";
import { fetchArticles } from "../../lib/notion";

export default async function BlogPage() {
  const articles = await fetchArticles();

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
          {articles.map((article) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      </FluidContainer>
    </main>
  );
}
