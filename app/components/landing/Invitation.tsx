import CtaLink from "@/components/CtaLink";
import Rich from "@/components/Rich";
import Section from "@/components/Section";
import Diptych from "@/components/Diptych";
import Figure from "@/components/Figure";
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

  /* The dictionaries store locale-relative hrefs and every other link on the
     page is prefixed by `localeHref` at its call site. This is the one link
     that arrives inside a `RichText`, so it is resolved here rather than
     teaching `Rich` about locales. */
  const subtitle = invitation.subtitle.map((segment) =>
    segment.href
      ? { ...segment, href: localeHref(lang, segment.href) }
      : segment
  );

  return (
    /* `sand` rather than the default canvas: with `victoires` moved up, the
       page descends panel → band → sand into the footer, and a canvas section
       here would have jumped two steps of the surface scale. The footer's own
       canvas is the step after it, so the last band change still lands. */
    <Section id={invitation.id} band="sand" rhythm="py-24 nav:py-[10.5rem]">
      <Diptych
        side="left"
        emphasis="text"
        text={
          <div>
            {/* Two lines, not three, and on the section anchor's scale rather
                than above it. At 4.5rem over three lines the address block was
                the largest object on the site by a wide margin — a heading that
                loud makes the invitation under it read as fine print. */}
            <h2 className="text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.03] tracking-[-0.035em]">
              <span className="block">{invitation.titleLine1}</span>
              <span className="block bg-brand bg-clip-text text-transparent">
                {invitation.titleLine2}
              </span>
            </h2>

            {/* The invitation itself, demoted out of the heading into a
                subtitle: it is a sentence a person says, not a display line,
                and it still carries « cowork » as the door. Underlined rather
                than coloured — the gradient above spends this block's one
                accent. */}
            <p className="mt-5 max-w-[24ch] text-[clamp(1.25rem,1.9vw,1.5rem)] font-medium leading-[1.35] tracking-[-0.01em] text-ink2">
              <Rich
                content={subtitle}
                linkClassName="underline decoration-[0.05em] underline-offset-[0.14em] transition-colors ease-epure hover:text-blue"
              />
            </p>
            <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-muted nav:text-[1.1875rem]">
              {invitation.lead}
            </p>
            {/* The « Passez nous voir → » secondary link is gone: the heading
                above now carries those words and the link to /cowork, and the
                row was saying them twice. One CTA left, so the row is no
                longer a row. */}
            <div className="mt-9">
              <CtaLink href={localeHref(lang, invitation.cta.href)} size="lg">
                {invitation.cta.label}
              </CtaLink>
            </div>
            <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-[1.7] text-muted">
              {invitation.secondaryNote}
            </p>
          </div>
        }
        proof={
          <div className="flex flex-col items-start gap-8">
            {balcon ? (
              <Figure
                src={balconImg}
                alt={balcon.alt}
                caption={balcon.caption}
                size="small"
                className="w-[15rem] max-nav:w-[11rem]"
              />
            ) : null}
          </div>
        }
      />
    </Section>
  );
}
