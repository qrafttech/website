import ArticlePage, {
  type ArticlePageProps,
  articlePageMetadata,
  articleStaticParams,
} from "@/app/components/ArticlePage";

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return articleStaticParams("blog", params.lang);
}

export function generateMetadata(props: ArticlePageProps) {
  return articlePageMetadata("blog", props);
}

export default function BlogArticlePage(props: ArticlePageProps) {
  return <ArticlePage collection="blog" {...props} />;
}
