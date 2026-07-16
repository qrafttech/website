import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import Wrap from "@/components/Wrap";
import { final } from "@/lib/i18n/fr/landing";

export default function FinalCta() {
  return (
    <section id="contact" className="py-28 nav:py-[11.5rem]">
      <Wrap>
        <div className="grid gap-x-16 gap-y-10 nav:grid-cols-[1.45fr_1fr] nav:items-end">
          <h2 className="text-[clamp(2.375rem,6.2vw,5.5rem)] font-bold leading-none tracking-[-0.035em]">
            <RiseLine trigger="view">{final.titleLine1}</RiseLine>
            <RiseLine
              trigger="view"
              className="bg-brand bg-clip-text text-transparent"
            >
              {final.titleLine2}
            </RiseLine>
          </h2>
          <Reveal className="flex flex-col items-start gap-8 nav:pb-3">
            <p className="max-w-[38ch] text-[1.0625rem] text-muted nav:text-[1.1875rem]">
              {final.lead}
            </p>
            <CtaLink href={final.cta.href}>{final.cta.label}</CtaLink>
          </Reveal>
        </div>
      </Wrap>
    </section>
  );
}
