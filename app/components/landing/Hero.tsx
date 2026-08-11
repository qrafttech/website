import Image, { type StaticImageData } from "next/image";

import Rich from "@/components/Rich";
import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import { hero } from "@/lib/i18n/fr/landing";

import nicolasImg from "@/public/images/nicolas.jpeg";
import alexisImg from "@/public/images/alexis.jpeg";
import adrienImg from "@/public/images/adrien.jpeg";

type FaceKey = typeof hero.team[number]["key"];

const FACE_IMAGES: Record<FaceKey, StaticImageData> = {
  nicolas: nicolasImg,
  alexis: alexisImg,
  adrien: adrienImg,
};

function Face({ face }: { face: typeof hero.team[number] }) {
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

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-3.375rem)] flex-col overflow-hidden bg-panel px-gutter pb-hero-b pt-[clamp(1.25rem,3vh,2.25rem)] text-ink nav:min-h-[100svh]">
      <div className="relative z-[1] flex flex-1 flex-col">
        {/* The terminal and its « agent · qraft/website » caption are gone, but
            design.md:90-91 keeps « Discutons » in the hero rather than the nav,
            so the row survives carrying only the CTA. */}
        <div className="flex items-center justify-end">
          <CtaLink
            href={hero.contactCta.href}
            size="sm"
            className="normal-case tracking-normal"
          >
            {hero.contactCta.label}
          </CtaLink>
        </div>

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
          {/* `items-end`: the headline's last line and the CTA sit on one
              shared baseline, which is what makes two halves of unequal
              content read as a pair rather than as two loose blocks. */}
          <div className="grid gap-x-[clamp(1.5rem,3.2vw,3.25rem)] gap-y-[clamp(1.5rem,4vh,2.5rem)] nav:grid-cols-2 nav:items-end">
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
              <CtaLink href={hero.cta.href} size="lg">
                {hero.cta.label}
              </CtaLink>
            </Reveal>
          </div>

          {/* Three equal cells over one hairline — the page's own ledger
              grammar, and the most symmetric thing the hero has. Stacked below
              900px, where three cells of 114px cannot hold a portrait and a
              name side by side. */}
          <Reveal
            trigger="mount"
            delay={0.7}
            className="grid gap-x-[clamp(1.5rem,3.2vw,3.25rem)] gap-y-4 border-t border-line pt-6 nav:grid-cols-3 nav:gap-y-[clamp(1rem,2.4vh,1.5rem)] nav:pt-[clamp(1.25rem,3vh,2.25rem)]"
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
