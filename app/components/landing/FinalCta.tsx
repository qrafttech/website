import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import Wrap from "@/components/Wrap";
import { final } from "@/lib/i18n/fr/landing";

export default function FinalCta() {
  return (
    <section id="contact" className="py-[200px] text-center">
      <Wrap>
        <h2 className="text-[clamp(38px,6.6vw,96px)] font-bold leading-none tracking-[-0.035em]">
          <RiseLine trigger="view">{final.titleLine1}</RiseLine>
          <RiseLine trigger="view" className="text-blue">
            {final.titleLine2}
          </RiseLine>
        </h2>
        <Reveal>
          <p className="mx-auto mb-9 mt-[26px] max-w-[44ch] text-[19px] text-muted">
            {final.lead}
          </p>
        </Reveal>
        <Reveal>
          <CtaLink href={final.cta.href}>{final.cta.label}</CtaLink>
        </Reveal>
      </Wrap>
    </section>
  );
}
