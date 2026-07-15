import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ClientCase from "@/app/components/ClientCase";
import { clients, getClient } from "@/lib/i18n/fr/clients";

interface ClientPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return clients.map((client) => ({ slug: client.slug }));
}

export async function generateMetadata({
  params,
}: ClientPageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = getClient(slug);

  if (!client) return {};

  const title = `${client.name} — ${client.sector}`;

  return {
    title,
    description: client.lede,
    alternates: { canonical: `/realisations/${slug}` },
    openGraph: {
      type: "article",
      title,
      description: client.lede,
      url: `/realisations/${slug}`,
    },
    twitter: { card: "summary_large_image", title, description: client.lede },
  };
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { slug } = await params;
  const client = getClient(slug);

  if (!client) notFound();

  return <ClientCase client={client} />;
}
