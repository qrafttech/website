import { cache } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import FluidContainer from "../../../components/FluidContainer";
import NotionRenderer from "../../components/NotionRenderer";
import { fetchArticles, fetchArticleById } from "../../../lib/notion";

const getArticle = cache(fetchArticleById);

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const articles = await fetchArticles();
    return articles.map((article) => ({ slug: article.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.title,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  return (
    <FluidContainer>
      <div className="pt-8 pb-24">
        <Link
          href="/blog"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-800"
        >
          &larr; Retour aux articles
        </Link>
        <article className="mx-auto max-w-prose pt-12">
          <h1 className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text font-serif text-2xl font-bold text-transparent md:text-4xl">
            {article.title}
          </h1>
          <p className="pt-4 text-sm text-zinc-400">{article.date}</p>
          <div className="pt-8">
            <NotionRenderer blocks={article.blocks} />
          </div>
        </article>
      </div>
    </FluidContainer>
  );
}
