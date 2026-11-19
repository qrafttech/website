import ArticlePage, {
  type ArticlePageProps,
  articlePageMetadata,
  articleStaticParams,
} from "@/app/components/ArticlePage";

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return articleStaticParams("tmba", params.lang);
}

export function generateMetadata(props: ArticlePageProps) {
  return articlePageMetadata("tmba", props);
}

export default function TalkPage(props: ArticlePageProps) {
  return <ArticlePage collection="tmba" {...props} />;
}
