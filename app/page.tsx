import { Suspense } from "react";

import JsonLd from "@/app/components/JsonLd";
import Hero from "@/app/components/landing/Hero";
import Ticker from "@/app/components/landing/Ticker";
import Offre from "@/app/components/landing/Offre";
import Valeurs from "@/app/components/landing/Valeurs";
import Arsenal from "@/app/components/landing/Arsenal";
import Origine from "@/app/components/landing/Origine";
import Victoires from "@/app/components/landing/Victoires";
import Invitation from "@/app/components/landing/Invitation";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          logo: `${SITE_URL}/favicons/android-chrome-512x512.png`,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        }}
      />
      {/* promesse → blog → offre → constat → valeurs → origine (le pivot) →
          arsenal → victoires → invitation. See .claude/work/arc.md.

          `origine` sits before `arsenal`, not after: the arsenal is a stack
          table and puts the reader into spec-scanning mode, which the origin
          story cannot break out of once it follows. */}
      <Hero />
      <Suspense>
        <Ticker />
      </Suspense>
      <Offre />
      <Valeurs />
      <Origine />
      <Arsenal />
      <Victoires />
      <Invitation />
    </main>
  );
}
