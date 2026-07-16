import Image, { type StaticImageData } from "next/image";

import Rich from "@/components/Rich";
import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import Stream from "@/app/components/landing/Stream";
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
      <span className="relative block h-16 w-16 flex-none overflow-hidden bg-tint">
        <Image
          src={FACE_IMAGES[face.key]}
          alt={face.name}
          fill
          sizes="64px"
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
    <section className="relative flex min-h-[calc(100svh-3.375rem)] flex-col overflow-hidden bg-panel px-[clamp(1.5rem,3.6vw,3.75rem)] pb-[clamp(2.75rem,7vh,4.75rem)] pt-[clamp(1.25rem,3.5vh,2.5rem)] text-ink nav:min-h-[100svh]">
      <Stream />

      <div className="relative z-[1] flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-6 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
          <span className="inline-flex items-center gap-2">
            <b className="h-1.5 w-1.5 flex-none animate-tpulse rounded-full bg-term-ok" />
            <span>
              {hero.topline.agent}
              <span className="max-nav:hidden">{hero.topline.path}</span>
              {hero.topline.live}
            </span>
          </span>
          <CtaLink
            href={hero.topline.cta.href}
            size="sm"
            className="normal-case tracking-normal"
          >
            {hero.topline.cta.label}
          </CtaLink>
        </div>

        <div className="my-auto flex flex-col py-[clamp(1.75rem,5vh,3.5rem)]">
          <h1 className="text-[clamp(2.75rem,6.3vw,6.875rem)] font-bold leading-[0.98] tracking-[-0.035em]">
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
            className="mt-[clamp(2rem,6vh,4.5rem)] flex max-w-[30rem] flex-col gap-[clamp(0.875rem,2.2vh,1.375rem)]"
          >
            {hero.team.map((face) => (
              <Face key={face.key} face={face} />
            ))}
          </Reveal>

          <Reveal
            trigger="mount"
            delay={0.7}
            className="mt-[clamp(2.5rem,9vh,6.875rem)] flex flex-col items-start gap-[clamp(1.25rem,3vh,1.875rem)]"
          >
            <p className="max-w-[22ch] font-display text-[clamp(1.25rem,2.1vw,1.9375rem)] font-bold leading-[1.25] tracking-[-0.02em]">
              {hero.lead}
            </p>
            <CtaLink href={hero.cta.href} size="lg">
              {hero.cta.label}
            </CtaLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
