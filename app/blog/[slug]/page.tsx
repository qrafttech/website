import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import FluidContainer from "../../../components/FluidContainer";
import { articles, getArticleBySlug } from "../data";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.content.split("\n\n")[0],
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const paragraphs = article.content.split("\n\n");

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
          <h1 className="bg-gradient-to-r from-[#e77c40] to-[#f8c618] bg-clip-text font-serif text-2xl font-bold text-transparent md:text-4xl">
            {article.title}
          </h1>
          <p className="pt-4 text-sm text-zinc-400">{article.date}</p>
          <div className="space-y-6 pt-8">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base text-zinc-700">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </FluidContainer>
  );
}
