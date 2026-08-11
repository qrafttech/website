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
import { hasBlog, isLocale, localePath } from "@/lib/i18n/config";
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
      {/* promesse → blog → offre → constat → valeurs → origine (le pivot) →
          arsenal → victoires → invitation. See .claude/work/arc.md.

          `origine` sits before `arsenal`, not after: the arsenal is a stack
          table and puts the reader into spec-scanning mode, which the origin
          story cannot break out of once it follows.

          The ticker is the blog's shop window, and the blog is French-only, so
          it is absent rather than translated — an English hero that scrolls
          into a wall of French headlines is worse than one section shorter. */}
      <Hero lang={lang} hero={t.hero} />
      {hasBlog(lang) ? (
        <Suspense>
          <Ticker lang={lang} ticker={t.ticker} />
        </Suspense>
      ) : null}
      <Offre offre={t.offre} />
      <Valeurs valeurs={t.valeurs} />
      <Origine origine={t.origine} />
      <Arsenal arsenal={t.arsenal} />
      <Victoires lang={lang} victoires={t.victoires} clients={t.clients} />
      <Invitation lang={lang} invitation={t.invitation} origine={t.origine} />
    </main>
  );
}
