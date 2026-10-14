import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Markdown from "@/app/components/Markdown";
import JsonLd from "@/app/components/JsonLd";
import Wrap from "@/components/Wrap";
import Eyebrow from "@/components/Eyebrow";
import MonoLink from "@/components/MonoLink";
import {
  type ArticleMeta,
  fetchArticles,
  fetchArticleBySlug,
  fetchTranslation,
} from "@/lib/blog";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import {
  type Locale,
  isLocale,
  localePath,
  otherLocale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type LocalePaths, articleMetadata } from "@/lib/i18n/metadata";

const getArticle = cache(fetchArticleBySlug);

interface ArticlePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * Where this article lives in each locale. Each language file has its own
 * slug; the translation is the other file of the same folder. An
 * untranslated article advertises one locale only.
 */
function articlePaths(
  lang: Locale,
  slug: string,
  translation: ArticleMeta | null
): LocalePaths {
  return {
    [lang]: `/blog/${slug}`,
    ...(translation
      ? { [otherLocale(lang)]: `/blog/${translation.slug}` }
      : {}),
  };
}

/**
 * With Cache Components enabled, Next requires every `generateStaticParams`
 * to yield at least one result so it can prove at build time that the route
 * has no unguarded dynamic access. When no article is published yet this
 * returns a placeholder rather than `[]`.
 */
const NO_SUCH_ARTICLE = "_";

export async function generateStaticParams({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) return [{ slug: NO_SUCH_ARTICLE }];

  const articles = await fetchArticles(params.lang);
  return articles.length > 0
    ? articles.map((article) => ({ slug: article.slug }))
    : [{ slug: NO_SUCH_ARTICLE }];
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const article = await getArticle(lang, slug);
  if (!article) return {};

  const translation = await fetchTranslation(lang, article);

  return articleMetadata(
    lang,
    articlePaths(lang, slug, translation),
    article.title,
    article.excerpt.slice(0, 160) || article.title
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const [article, t] = await Promise.all([
    getArticle(lang, slug),
    getDictionary(lang),
  ]);

  if (!article) notFound();

  const translation = await fetchTranslation(lang, article);
  const other = otherLocale(lang);
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
          inLanguage: lang,
        }}
      />
      <Wrap>
        <div className="pt-8 pb-24">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <MonoLink href={localePath(lang, "/blog")} className="text-muted">
              &larr; {t.blog.backToArticles}
            </MonoLink>
            {/* The exact twin, which the nav's switcher cannot know — it is a
                client component and the twin's slug is in the twin's file. Labelled
                in the target language, as a reader of that language expects. */}
            {translation ? (
              <MonoLink
                href={localePath(other, `/blog/${translation.slug}`)}
                hrefLang={other}
                lang={other}
                className="text-muted"
              >
                {t.blog.translation} &rarr;
              </MonoLink>
            ) : null}
          </div>
          <article className="mx-auto max-w-prose pt-12">
            <h1 className="font-display text-section font-bold text-ink">
              {article.title}
            </h1>
            <Eyebrow className="pt-4">
              {article.status !== "published" && (
                <>
                  {t.blog.status[article.status]}
                  {article.date && <span className="mx-1.5">&middot;</span>}
                </>
              )}
              {article.dateISO ? (
                <time dateTime={article.dateISO}>{article.date}</time>
              ) : (
                article.date
              )}
            </Eyebrow>
            <div className="pt-8">
              <Markdown body={article.body} dir={article.dir} />
            </div>
          </article>
        </div>
      </Wrap>
    </main>
  );
}
