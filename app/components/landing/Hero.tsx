import Image, { type StaticImageData } from "next/image";

import Rich from "@/components/Rich";
import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import { type Locale, localeHref } from "@/lib/i18n/config";
import type { Dictionary, TeamKey, TeamMember } from "@/lib/i18n/types";

import nicolasImg from "@/public/images/nicolas.jpeg";
import alexisImg from "@/public/images/alexis.jpeg";
import adrienImg from "@/public/images/adrien.jpeg";

const FACE_IMAGES: Record<TeamKey, StaticImageData> = {
  nicolas: nicolasImg,
  alexis: alexisImg,
  adrien: adrienImg,
};

function Face({ face }: { face: TeamMember }) {
  return (
    <a
      href={face.href}
      target="_blank"
      rel="noopener"
      aria-label={face.linkLabel}
      className="group flex items-center gap-[1.125rem]"
    >
      {/* 104px on desktop, where the complaint was that 64px read as favicons
          in a list row. Left at 64px below 900px: there the hero is a single
          stacked column, three larger portraits pushed the primary CTA 31px
          below the fold, and 64px against a 390px viewport is already six
          times the share of the screen it holds at 1440. */}
      <span className="relative block h-16 w-16 flex-none overflow-hidden bg-tint nav:h-[6.5rem] nav:w-[6.5rem]">
        <Image
          src={FACE_IMAGES[face.key]}
          alt={face.name}
          fill
          sizes="(min-width: 900px) 104px, 64px"
          className="object-cover grayscale transition-[filter] duration-[350ms] ease-epure group-hover:grayscale-0"
        />
      </span>
      <span className="flex min-w-0 flex-col text-[0.8125rem] leading-[1.45] text-muted">
        <strong className="mb-0.5 text-[0.9375rem] font-bold text-ink">
          {face.name} ↗
        </strong>
        {face.role}
      </span>
    </a>
  );
}

export default function Hero({
  lang,
  hero,
}: {
  lang: Locale;
  hero: Dictionary["hero"];
}) {
  return (
    <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col overflow-hidden bg-panel px-gutter pb-hero-b pt-[clamp(1.25rem,3vh,2.25rem)] text-ink">
      <div className="relative z-[1] flex flex-1 flex-col">
        {/* The topline is gone with the terminal that used to fill it. It ended
            up holding « Discutons » alone, and N4 carries that CTA in the bar
            at every scroll depth — two identical blue buttons 40px apart is not
            a stronger contact path, it is the same one said twice. */}

        {/* Two over three, on one axis — the client asked for « plus de
            symétrie » and the terminal's deletion is what makes it possible.
            The old hero was an L of content around an empty fourth quadrant:
            headline top-left, crew top-right, lede and CTA bottom-left, the
            stream bottom-right. Now the headline and the promise are equal
            halves sharing a bottom edge, and the crew runs underneath as three
            equal cells over a hairline. Both rows span the same measure and
            share the same centre line, so the composition balances instead of
            leaning; every quadrant carries something.

            Centring the whole hero was the other honest answer to the
            instruction and was rejected: nothing else on this page is centred,
            and a centred display headline over centred body copy is the one
            move that would make an épure page read as a template.

            `justify-center` rather than the old `mt-auto`: a bottom-weighted
            stack put all the air above the headline, which is an asymmetry of
            its own on a tall viewport. */}
        <div className="flex flex-1 flex-col justify-center gap-8 py-2 nav:gap-[clamp(2rem,6.5vh,4.5rem)] nav:py-[clamp(0.75rem,2.2vh,2.5rem)]">
          {/* `items-start`, not `items-end`. Sharing a bottom edge aligned the
              two halves on a line that is only implied — the headline's last
              baseline against the CTA's box — while the two things a reader
              actually scans, the first line of the headline and the first line
              of the paragraph, started four lines apart. Aligning the tops puts
              the shared edge where the eye already is.

              The gutter roughly doubles with it: at ~52px the paragraph read as
              a continuation of the headline's measure rather than as the second
              of two columns, and top-aligning made that reading stronger. */}
          <div className="grid gap-x-[clamp(1.5rem,3.2vw,3.25rem)] gap-y-[clamp(1.5rem,4vh,2.5rem)] nav:grid-cols-2 nav:items-start nav:gap-x-[clamp(3.25rem,6.6vw,6rem)]">
            {/* Two clamps, because the floor means opposite things on either
                side of 900px. Stacked, the headline owns the full measure and
                2.25rem is the smallest it should ever be. Split into halves it
                owns roughly 620px at 1440 and only ~370px at 900, so the floor
                has to drop or « Construisons ensemble » wraps and the headline
                runs to five lines. The ceiling is set the same way: above
                3.25rem line one wraps at 1440 and the hero stops fitting 711. */}
            <h1 className="max-w-[19ch] text-[clamp(2.25rem,min(3.35vw,6.2svh),3.25rem)] font-bold leading-[1.0] tracking-[-0.035em] [text-wrap:balance] nav:text-[clamp(2rem,min(3.35vw,6.2svh),3.25rem)]">
              <RiseLine trigger="mount" duration={0.9}>
                {hero.titleLine1}
              </RiseLine>
              <RiseLine trigger="mount" delay={0.12} duration={0.9}>
                <Rich content={hero.titleLine2} />
              </RiseLine>
            </h1>

            <Reveal
              trigger="mount"
              delay={0.5}
              className="flex flex-col items-start gap-[clamp(0.875rem,2vh,1.5rem)]"
            >
              <p className="max-w-[52ch] text-[clamp(0.9375rem,min(1.1vw,1.9svh),1.0625rem)] leading-[1.7] text-ink2">
                {hero.lead}
              </p>
              <CtaLink href={localeHref(lang, hero.cta.href)} size="lg">
                {hero.cta.label}
              </CtaLink>
            </Reveal>
          </div>

          {/* Three equal cells, stacked below 900px where three cells of 114px
              cannot hold a portrait and a name side by side.

              CLIENT RULING: no rule above them. Three portraits in a row on a
              band of their own already read as a separate register from the
              headline; the hairline was drawing a boundary the composition had
              drawn for it, which is exactly the separator habit the redesign
              set out to lose. The air stays. */}
          <Reveal
            trigger="mount"
            delay={0.7}
            className="grid gap-x-[clamp(1.5rem,3.2vw,3.25rem)] gap-y-4 pt-6 nav:grid-cols-3 nav:gap-y-[clamp(1rem,2.4vh,1.5rem)] nav:pt-[clamp(1.25rem,3vh,2.25rem)]"
          >
            {hero.team.map((face) => (
              <Face key={face.key} face={face} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
