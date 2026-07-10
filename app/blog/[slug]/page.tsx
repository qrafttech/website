import { cache } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import NotionRenderer from "@/app/components/NotionRenderer";
import JsonLd from "@/app/components/JsonLd";
import Wrap from "@/components/Wrap";
import {
  fetchArticles,
  fetchArticleBySlug,
  extractPlainText,
} from "@/lib/notion";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { getDictionary } from "@/lib/i18n";

const getArticle = cache(fetchArticleBySlug);

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

  let description = article.title;
  for (const block of article.blocks) {
    if (block.type === "paragraph" && block.paragraph.rich_text.length > 0) {
      description = extractPlainText(block.paragraph.rich_text).slice(0, 160);
      break;
    }
  }

  return {
    title: article.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: `/blog/${slug}`,
    },
    twitter: { card: "summary_large_image", title: article.title, description },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const t = getDictionary();

  return (
    <Wrap>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          datePublished: article.dateISO || undefined,
          author: article.author
            ? { "@type": "Person", name: article.author }
            : undefined,
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
          url: `${SITE_URL}/blog/${slug}`,
          mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
        }}
      />
      <div className="pt-8 pb-24">
        <Link
          href="/blog"
          className="font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors ease-epure hover:text-blue"
        >
          &larr; {t.blog.backToArticles}
        </Link>
        <article className="mx-auto max-w-prose pt-12">
          <h1 className="font-display text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.06] text-ink">
            {article.title}
          </h1>
          <p className="pt-4 font-mono text-xs uppercase tracking-[0.08em] text-muted">
            {article.date}
          </p>
          <div className="pt-8">
            <NotionRenderer blocks={article.blocks} />
          </div>
        </article>
      </div>
    </Wrap>
  );
}
