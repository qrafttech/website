import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import NotionRenderer from "@/app/components/NotionRenderer";
import JsonLd from "@/app/components/JsonLd";
import Wrap from "@/components/Wrap";
import Eyebrow from "@/components/Eyebrow";
import MonoLink from "@/components/MonoLink";
import {
  fetchArticles,
  fetchArticleBySlug,
  extractPlainText,
} from "@/lib/notion";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { hasBlog, isLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { articleMetadata } from "@/lib/i18n/metadata";

const getArticle = cache(fetchArticleBySlug);

interface ArticlePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * Articles are French-only. For any other locale this returns a single
 * placeholder slug rather than the real list, so `/en/blog/<slug>` costs one
 * prerendered 404 instead of thirty-odd, and every other English article URL
 * is resolved on demand — where the page's own guard 404s it too.
 *
 * It cannot simply return `[]`: with Cache Components enabled, Next requires
 * every `generateStaticParams` to yield at least one result so it can prove at
 * build time that the route has no unguarded dynamic access.
 */
const NO_SUCH_ARTICLE = "_";

export async function generateStaticParams({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLocale(params.lang) || !hasBlog(params.lang)) {
    return [{ slug: NO_SUCH_ARTICLE }];
  }

  try {
    const articles = await fetchArticles();
    return articles.map((article) => ({ slug: article.slug }));
  } catch {
    return [{ slug: NO_SUCH_ARTICLE }];
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !hasBlog(lang)) return {};

  const article = await getArticle(slug);

  if (!article) return {};

  let description = article.title;
  for (const block of article.blocks) {
    if (block.type === "paragraph" && block.paragraph.rich_text.length > 0) {
      description = extractPlainText(block.paragraph.rich_text).slice(0, 160);
      break;
    }
  }

  return articleMetadata(lang, `/blog/${slug}`, article.title, description);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !hasBlog(lang)) notFound();

  const [article, t] = await Promise.all([
    getArticle(slug),
    getDictionary(lang),
  ]);

  if (!article) notFound();

  const path = localePath(lang, `/blog/${slug}`);

  return (
    <main>
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
          url: `${SITE_URL}${path}`,
          mainEntityOfPage: `${SITE_URL}${path}`,
          inLanguage: "fr",
        }}
      />
      <Wrap>
        <div className="pt-8 pb-24">
          <MonoLink href={localePath(lang, "/blog")} className="text-muted">
            &larr; {t.blog.backToArticles}
          </MonoLink>
          <article className="mx-auto max-w-prose pt-12">
            <h1 className="font-display text-section font-bold text-ink">
              {article.title}
            </h1>
            <Eyebrow className="pt-4">
              {article.dateISO ? (
                <time dateTime={article.dateISO}>{article.date}</time>
              ) : (
                article.date
              )}
            </Eyebrow>
            <div className="pt-8">
              <NotionRenderer blocks={article.blocks} />
            </div>
          </article>
        </div>
      </Wrap>
    </main>
  );
}
