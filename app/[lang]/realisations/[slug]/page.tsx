import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ClientCase from "@/app/components/ClientCase";
import { isLocale } from "@/lib/i18n/config";
import { getClient, getDictionary } from "@/lib/i18n/dictionaries";
import { articleMetadata } from "@/lib/i18n/metadata";

interface ClientPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/** Slugs are identical across locales, so `/realisations/billi` and
 *  `/en/realisations/billi` are the same case in two languages. */
export async function generateStaticParams({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) return [{ slug: "_" }];

  const t = await getDictionary(params.lang);
  return t.clients.map((client) => ({ slug: client.slug }));
}

export async function generateMetadata({
  params,
}: ClientPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const t = await getDictionary(lang);
  const client = getClient(t.clients, slug);

  if (!client) return {};

  const title = `${client.name} — ${client.sector}`;

  return articleMetadata(lang, `/realisations/${slug}`, title, client.lede);
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getDictionary(lang);
  const client = getClient(t.clients, slug);

  if (!client) notFound();

  return <ClientCase lang={lang} client={client} caseUi={t.caseUi} />;
}
