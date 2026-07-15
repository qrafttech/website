import type { ReactNode } from "react";

import Wrap from "@/components/Wrap";
import Eyebrow from "@/components/Eyebrow";

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
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-[clamp(34px,4.8vw,64px)] font-bold leading-[1.02]">
            {title}
          </h1>
          <p className="mt-5 max-w-[48ch] text-muted">{subtitle}</p>
        </div>
      </Wrap>
    </section>
  );
}
