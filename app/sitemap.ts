import type { MetadataRoute } from "next";
import { fetchArticles } from "../lib/notion";
import { SITE_URL } from "../lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await fetchArticles();
  const articleEntries = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    ...(a.dateISO ? { lastModified: new Date(a.dateISO) } : {}),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...articleEntries,
  ];
}
