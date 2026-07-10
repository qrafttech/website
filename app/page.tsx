import { Suspense } from "react";

import JsonLd from "@/app/components/JsonLd";
import Hero from "@/app/components/landing/Hero";
import Offres from "@/app/components/landing/Offres";
import Ticker from "@/app/components/landing/Ticker";
import Rotor from "@/app/components/landing/Rotor.client";
import Proof from "@/app/components/landing/Proof";
import Ways from "@/app/components/landing/Ways";
import FinalCta from "@/app/components/landing/FinalCta";
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
      <Hero />
      <Offres />
      <Suspense>
        <Ticker />
      </Suspense>
      <Rotor />
      <Proof />
      <Ways />
      <FinalCta />
    </main>
  );
}
