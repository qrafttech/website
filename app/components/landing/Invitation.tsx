import CtaLink from "@/components/CtaLink";
import MonoLink from "@/components/MonoLink";
import Section from "@/components/Section";
import Diptych from "@/components/Diptych";
import Figure from "@/components/Figure";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import { origine, invitation } from "@/lib/i18n/fr/landing";

import balconImg from "@/public/images/scene-balcon.jpg";

const BALCON = origine.photos.find((photo) => photo.key === "balcon");

export default function Invitation() {
  return (
    <Section
      id={invitation.id}
      band="canvas"
      rhythm="py-24 nav:py-[10.5rem]"
      className="scroll-mt-0"
    >
      <Diptych
        side="left"
        emphasis="text"
        text={
          <div>
            <h2 className="text-[clamp(2.25rem,5.4vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              <RiseLine trigger="view">{invitation.titleLine1}</RiseLine>
              <RiseLine
                trigger="view"
                className="bg-brand bg-clip-text text-transparent"
              >
                {invitation.titleLine2}
              </RiseLine>
            </h2>
            <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-muted nav:text-[1.1875rem]">
              {invitation.lead}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <CtaLink href={invitation.cta.href} size="lg">
                {invitation.cta.label}
              </CtaLink>
              {/* M7 — there is a real door, and almost no agency can say this. */}
              <MonoLink href={invitation.secondary.href} className="text-ink2">
                {invitation.secondary.label}
              </MonoLink>
            </div>
            <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-[1.7] text-muted">
              {invitation.secondaryNote}
            </p>
          </div>
        }
        proof={
          <Reveal className="flex flex-col items-start gap-8">
            {BALCON ? (
              <Figure
                src={balconImg}
                alt={BALCON.alt}
                caption={BALCON.caption}
                size="small"
                className="w-[15rem] max-nav:w-[11rem]"
              />
            ) : null}
          </Reveal>
        }
      />
    </Section>
  );
}
