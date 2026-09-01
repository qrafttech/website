import { Suspense } from "react";
import { notFound } from "next/navigation";

import JsonLd from "@/app/components/JsonLd";
import Hero from "@/app/components/landing/Hero";
import Ticker from "@/app/components/landing/Ticker";
import Offre from "@/app/components/landing/Offre";
import Valeurs from "@/app/components/landing/Valeurs";
import Arsenal from "@/app/components/landing/Arsenal";
import Origine from "@/app/components/landing/Origine";
import Victoires from "@/app/components/landing/Victoires";
import Invitation from "@/app/components/landing/Invitation";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL, SITE_NAME } from "@/lib/site";

interface HomeProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getDictionary(lang);
  const home = `${SITE_URL}${localePath(lang, "/")}`;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          description: t.meta.description,
          logo: `${SITE_URL}/favicons/android-chrome-512x512.png`,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: home,
          inLanguage: lang,
        }}
      />
      {/* promesse → blog → offre → victoires → valeurs → origine (le pivot) →
          arsenal → invitation. See .claude/work/arc.md.

          CLIENT RULING: `victoires` moves up, directly under the offer. The
          offer's four blocks are claims; the eight clients are the receipt, and
          a reader who has just been told what we sell asks who bought it — not
          what we believe. `valeurs` keeps its slot in the argument, but it now
          reads as the terms of an engagement the proof has already earned.

          `origine` sits before `arsenal`, not after: the arsenal is a stack
          table and puts the reader into spec-scanning mode, which the origin
          story cannot break out of once it follows.

          The ticker is the blog's shop window; it scrolls the articles of the
          page's own language. */}
      <Hero lang={lang} hero={t.hero} />
      <Suspense>
        <Ticker lang={lang} ticker={t.ticker} />
      </Suspense>
      <Offre offre={t.offre} />
      <Victoires lang={lang} victoires={t.victoires} clients={t.clients} />
      <Valeurs valeurs={t.valeurs} />
      <Origine origine={t.origine} />
      <Arsenal arsenal={t.arsenal} />
      <Invitation lang={lang} invitation={t.invitation} origine={t.origine} />
    </main>
  );
}
