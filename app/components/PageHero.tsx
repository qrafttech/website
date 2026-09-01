import type { ReactNode } from "react";

import Wrap from "@/components/Wrap";

interface PageHeroProps {
  title: string;
  subtitle: ReactNode;
}

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="border-b border-line">
      <Wrap>
        <div className="grid gap-x-16 gap-y-4 py-16 md:py-24 nav:grid-cols-[1.45fr_1fr] nav:items-end">
          <h1 className="text-[clamp(2.125rem,4.8vw,4rem)] font-bold leading-[1.02]">
            {title}
          </h1>
          <p className="max-w-[44ch] text-muted nav:pb-2.5">{subtitle}</p>
        </div>
      </Wrap>
    </section>
  );
}
