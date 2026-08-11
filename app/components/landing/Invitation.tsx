import CtaLink from "@/components/CtaLink";
import MonoLink from "@/components/MonoLink";
import Section from "@/components/Section";
import Diptych from "@/components/Diptych";
import Figure from "@/components/Figure";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import { type Locale, localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

import balconImg from "@/public/images/scene-balcon.jpg";

export default function Invitation({
  lang,
  invitation,
  origine,
}: {
  lang: Locale;
  invitation: Dictionary["invitation"];
  origine: Dictionary["origine"];
}) {
  const balcon = origine.photos.find((photo) => photo.key === "balcon");

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
              <CtaLink href={localeHref(lang, invitation.cta.href)} size="lg">
                {invitation.cta.label}
              </CtaLink>
              {/* M7 — there is a real door, and almost no agency can say this. */}
              <MonoLink
                href={localeHref(lang, invitation.secondary.href)}
                className="text-ink2"
              >
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
            {balcon ? (
              <Figure
                src={balconImg}
                alt={balcon.alt}
                caption={balcon.caption}
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
