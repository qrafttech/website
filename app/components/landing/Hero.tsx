import Image from "next/image";

import Rich from "@/components/Rich";
import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import Terminal from "@/app/components/landing/Terminal.client";
import { hero } from "@/lib/i18n/fr/landing";
import qLogo from "@/public/images/q-logo.png";

const CHEVRON_PATH = "M8 1v10M3.5 8 8 12.5 12.5 8";

const CUES = [
  { opacity: "opacity-30", delay: "" },
  { opacity: "opacity-[0.55]", delay: "[animation-delay:0.18s]" },
  { opacity: "opacity-[0.85]", delay: "[animation-delay:0.36s]" },
];

export default function Hero() {
  return (
    <section className="border-b border-line">
      <div className="grid grid-cols-1 nav:min-h-[calc(100vh-var(--header-h))] nav:grid-cols-[1.55fr_1fr] nav:grid-rows-[0.92fr_1.08fr]">
        <div className="relative flex min-h-[46vh] flex-col border-b border-line p-[clamp(28px,4.5vh,56px)_clamp(24px,3.2vw,52px)] nav:col-start-1 nav:row-start-1 nav:min-h-0 nav:border-r">
          <div className="my-auto">
            <h1 className="text-[clamp(34px,4.8vw,74px)] font-bold leading-none">
              <RiseLine trigger="mount" duration={0.9}>
                {hero.titleLine1}
              </RiseLine>
              <RiseLine trigger="mount" delay={0.12} duration={0.9}>
                <Rich content={hero.titleLine2} />
              </RiseLine>
            </h1>
          </div>
        </div>

        <div className="relative flex flex-col justify-center gap-5 border-b border-line bg-sand p-[clamp(24px,3vh,44px)_clamp(20px,2vw,36px)] nav:col-start-2 nav:row-start-1">
          <Reveal trigger="mount" delay={0.7}>
            <p className="max-w-[26ch] font-display text-[clamp(17px,1.5vw,22px)] font-semibold leading-[1.3] tracking-[-0.02em]">
              {hero.lead}
            </p>
          </Reveal>
          <Reveal
            trigger="mount"
            delay={1}
            className="mt-[clamp(16px,3vh,36px)] flex flex-col items-start gap-2.5"
          >
            <CtaLink href={hero.cta.href}>{hero.cta.label}</CtaLink>
          </Reveal>
        </div>

        <div className="relative hidden flex-col overflow-hidden bg-sand nav:col-start-1 nav:row-start-2 nav:flex nav:border-r nav:border-line">
          <Terminal />
        </div>

        <div className="relative flex flex-col justify-center nav:col-start-2 nav:row-start-2">
          <a
            href="#offres"
            aria-label={hero.scrollCue}
            className="hidden flex-col items-center gap-1 text-ink2 hover:text-blue nav:flex"
          >
            <Image
              src={qLogo}
              alt=""
              aria-hidden
              sizes="92px"
              className="mb-2.5 h-auto w-[clamp(56px,6vw,92px)] animate-qbob"
            />
            {CUES.map((cue, index) => (
              <svg
                key={index}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={`block h-[18px] w-[18px] animate-scrolldown ${cue.opacity} ${cue.delay}`}
              >
                <path d={CHEVRON_PATH} />
              </svg>
            ))}
          </a>
        </div>
      </div>
    </section>
  );
}
