import type { ReactNode } from "react";

import Wrap from "@/components/Wrap";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: ReactNode;
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="border-b border-line bg-sand">
      <Wrap>
        <div className="py-16 md:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-[clamp(34px,4.8vw,64px)] font-bold leading-[1.02]">
            {title}
          </h1>
          <p className="mt-5 max-w-[48ch] text-muted">{subtitle}</p>
        </div>
      </Wrap>
    </section>
  );
}
