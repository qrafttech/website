"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { m, useInView } from "motion/react";

import Rich from "@/components/Rich";
import Wrap from "@/components/Wrap";
import Reveal from "@/components/motion/Reveal.client";
import { EASE } from "@/lib/motion";
import { rotor } from "@/lib/i18n/fr/landing";
import railsLogo from "@/public/images/logos/rails-logo.svg";
import nextjsLogo from "@/public/images/logos/nextjs-logo.svg";
import nestjsLogo from "@/public/images/logos/nestjs-logo.svg";
import postgresLogo from "@/public/images/logos/posgres-logo.svg";
import dockerLogo from "@/public/images/logos/docker-logo.svg";
import typescriptLogo from "@/public/images/logos/typescript-logo.svg";
import langchainLogo from "@/public/images/logos/langchain-logo.svg";
import claudeCodeLogo from "@/public/images/logos/claude-code-logo.svg";

const LOGOS: Record<string, { src: StaticImageData; name: string }> = {
  rails: { src: railsLogo, name: "Rails" },
  nextjs: { src: nextjsLogo, name: "Next.js" },
  nestjs: { src: nestjsLogo, name: "NestJS" },
  postgres: { src: postgresLogo, name: "Postgres" },
  docker: { src: dockerLogo, name: "Docker" },
  typescript: { src: typescriptLogo, name: "TypeScript" },
  langchain: { src: langchainLogo, name: "LangChain" },
  "claude-code": { src: claudeCodeLogo, name: "Claude Code" },
};

const H2_CLASS = "font-bold text-[clamp(1.75rem,3.8vw,3rem)] leading-[1.06]";
const DESC_CLASS = "mt-5 max-w-[46ch] text-[1.0625rem] text-muted";
const N_CLASS = "font-mono text-[0.6875rem] tracking-[0.03em] text-muted";
const CONV_DELAYS = [0.15, 0.25, 0.35] as const;

const HIDDEN = { opacity: 0, y: 14 } as const;
const SHOWN = { opacity: 1, y: 0 } as const;

function reveal(show: boolean, delay: number) {
  return {
    initial: HIDDEN,
    animate: show ? SHOWN : HIDDEN,
    transition: { duration: 0.55, ease: EASE, delay: show ? delay : 0 },
  };
}

function StackItem({
  logoKey,
  variant,
}: {
  logoKey: string;
  variant: "grid" | "row";
}) {
  const logo = LOGOS[logoKey];
  const row = variant === "row";

  return (
    <div
      className={clsx("flex items-center", row ? "gap-3" : "flex-col gap-3.5")}
    >
      <Image
        src={logo.src}
        alt=""
        className={clsx(
          "object-contain",
          row
            ? "h-8 w-8"
            : "h-[3.625rem] w-[3.625rem] max-nav:h-[2.875rem] max-nav:w-[2.875rem]"
        )}
      />
      <span className={N_CLASS}>{logo.name}</span>
    </div>
  );
}

const ARROW_PATHS = {
  prev: "M10 3 5 8l5 5",
  next: "M6 3l5 5-5 5",
} as const;

function ArrowButton({
  direction,
  label,
  onClick,
}: {
  direction: keyof typeof ARROW_PATHS;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-[4rem] w-[4rem] place-items-center border border-line text-ink transition-colors duration-200 ease-epure hover:border-ink hover:bg-ink hover:text-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
    >
      <svg
        className="h-[2.25rem] w-[2.25rem]"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={ARROW_PATHS[direction]} />
      </svg>
    </button>
  );
}

export default function Rotor() {
  const slides = rotor.slides;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi]);

  const scroll = useCallback(
    (direction: "prev" | "next") => {
      if (!emblaApi) return;
      if (direction === "prev") emblaApi.scrollPrev();
      else emblaApi.scrollNext();
    },
    [emblaApi]
  );

  return (
    <section
      ref={sectionRef}
      id="agents"
      className="bg-panel py-24 nav:py-[9.375rem]"
      aria-roledescription={rotor.roleDescription}
      aria-label={rotor.ariaLabel}
    >
      <Wrap>
        <Reveal>
          <div className="relative">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex">
                {slides.map((slide, i) => {
                  const show = inView && i === selectedIndex;

                  return (
                    <article
                      key={slide.key}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={slide.tab}
                      aria-hidden={i !== selectedIndex}
                      className="min-w-0 flex-[0_0_100%]"
                    >
                      <div className="grid grid-cols-2 items-center gap-24 max-nav:grid-cols-1 max-nav:gap-12">
                        <div>
                          <m.h2 {...reveal(show, 0)} className={H2_CLASS}>
                            <Rich content={slide.title} />
                          </m.h2>

                          {slide.key === "apps" && (
                            <m.p {...reveal(show, 0.1)} className={DESC_CLASS}>
                              {slide.desc}
                            </m.p>
                          )}

                          {slide.key === "agentic" && (
                            <m.div
                              {...reveal(show, 0.18)}
                              className="mt-9 flex flex-wrap gap-y-[1.125rem] gap-x-9"
                            >
                              {slide.stackRow.map((logoKey) => (
                                <StackItem
                                  key={logoKey}
                                  logoKey={logoKey}
                                  variant="row"
                                />
                              ))}
                            </m.div>
                          )}
                        </div>

                        {slide.key === "apps" && (
                          <div>
                            <m.div
                              {...reveal(show, 0)}
                              className="inline-block border-b-2 border-blue pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.05em] text-ink2"
                            >
                              {slide.stackLabel}
                            </m.div>
                            <m.div
                              {...reveal(show, 0.18)}
                              className="mt-10 grid grid-cols-3 gap-y-11 gap-x-5 max-nav:gap-y-8 max-nav:gap-x-3"
                            >
                              {slide.stack.map((logoKey) => (
                                <StackItem
                                  key={logoKey}
                                  logoKey={logoKey}
                                  variant="grid"
                                />
                              ))}
                            </m.div>
                          </div>
                        )}

                        {slide.key === "agentic" && (
                          <div>
                            {slide.convictions.map((conviction, ri) => (
                              <m.div
                                key={conviction.key}
                                {...reveal(show, CONV_DELAYS[ri] ?? 0.35)}
                                className="border-t border-rule py-[1.375rem] last:border-b"
                              >
                                <div className="font-mono text-[0.6875rem] uppercase tracking-[0.05em] text-ink2">
                                  {conviction.key}
                                </div>
                                <p className="mt-1.5 max-w-[46ch] text-[0.9375rem] leading-normal text-muted">
                                  {conviction.value}
                                </p>
                              </m.div>
                            ))}
                          </div>
                        )}

                        {slide.key === "equipes" && (
                          <m.p {...reveal(show, 0.1)} className={DESC_CLASS}>
                            {slide.desc}
                          </m.p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="mt-[4.5rem] flex items-center justify-center gap-1.5 max-nav:mt-12">
              <ArrowButton
                direction="prev"
                label={rotor.prev}
                onClick={() => scroll("prev")}
              />
              <ArrowButton
                direction="next"
                label={rotor.next}
                onClick={() => scroll("next")}
              />
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}
