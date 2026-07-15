import type { StaticImageData } from "next/image";
import Image from "next/image";

import Rich from "@/components/Rich";
import Wrap from "@/components/Wrap";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import { proof } from "@/lib/i18n/fr/landing";
import cevidentiaShot from "@/public/images/cevidentia-screenshot.jpg";
import easiwareShot from "@/public/images/easiware-screenshot.jpg";
import embarqShot from "@/public/images/embarq-screenshot.jpg";

const IMAGES: Record<typeof proof.stories[number]["key"], StaticImageData> = {
  cevidentia: cevidentiaShot,
  easiware: easiwareShot,
  embarq: embarqShot,
};

export default function Proof() {
  return (
    <section id="proof" className="border-t border-hair py-[150px]">
      <Wrap>
        <h2 className="text-[clamp(32px,5.4vw,68px)] font-bold leading-[1.02]">
          <RiseLine trigger="view">{proof.title}</RiseLine>
        </h2>

        <Reveal className="mt-[72px] grid grid-cols-1 gap-[22px] nav:grid-cols-3">
          {proof.stories.map((story) => (
            <a
              key={story.key}
              href={story.href}
              target="_blank"
              rel="noopener"
              className="group relative aspect-[4/3] overflow-hidden border border-hair"
            >
              <Image
                src={IMAGES[story.key]}
                alt={story.alt}
                placeholder="blur"
                sizes="(min-width: 900px) 33vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-[800ms] ease-epure group-hover:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(9,9,11,0.82)] to-transparent p-4 text-white">
                <div className="font-mono text-[11px] uppercase text-white/[0.68]">
                  {story.kind}
                </div>
                <div className="mt-[3px] font-display text-lg font-semibold">
                  {story.name}
                </div>
              </div>
            </a>
          ))}
        </Reveal>

        <Reveal>
          <p className="mt-9 max-w-[64ch] text-[17px] text-ink2">
            <Rich
              content={proof.proofline}
              strongClassName="font-medium text-blue"
            />
          </p>
        </Reveal>
      </Wrap>
    </section>
  );
}
