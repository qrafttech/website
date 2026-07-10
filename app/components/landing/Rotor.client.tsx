"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { m, useReducedMotion } from "motion/react";

import Rich from "@/components/Rich";
import Wrap from "@/components/Wrap";
import Reveal from "@/components/motion/Reveal.client";
import { EASE } from "@/lib/motion";
import { getDictionary } from "@/lib/i18n";
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

const H2_CLASS = "font-bold text-[clamp(28px,3.8vw,48px)] leading-[1.06]";
const DESC_CLASS = "mt-5 max-w-[46ch] text-[17px] text-muted";
const N_CLASS = "font-mono text-[11px] tracking-[0.03em] text-muted";
const CONV_DELAYS = [0.15, 0.25, 0.35] as const;

const HIDDEN = { opacity: 0, y: 14 } as const;
const SHOWN = { opacity: 1, y: 0 } as const;

/** Fade+rise a slide's content in only once it is both current and in view. */
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

  if (variant === "row") {
    return (
      <div className="flex flex-row items-center gap-3">
        <Image
          src={logo.src}
          alt=""
          className="h-[32px] w-[32px] object-contain"
        />
        <span className={N_CLASS}>{logo.name}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3.5">
      <Image
        src={logo.src}
        alt=""
        className="h-[58px] w-[58px] object-contain max-[760px]:h-[46px] max-[760px]:w-[46px]"
      />
      <span className={N_CLASS}>{logo.name}</span>
    </div>
  );
}

export default function Rotor() {
  const t = getDictionary();
  const slides = t.rotor.slides;
  const reduceMotion = useReducedMotion() ?? false;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: 7000,
      playOnInit: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
      stopOnInteraction: false,
    }),
  ]);

  const sectionRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  // Remounting the active fill restarts its 7s animation, kept in lockstep
  // with the autoplay timer (bumped on every `autoplay:timerset`).
  const [fillKey, setFillKey] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onTimerSet = () => {
      setStarted(true);
      setPaused(false);
      setFillKey((k) => k + 1);
    };
    const onTimerStopped = () => setPaused(true);

    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    emblaApi.on("autoplay:timerset", onTimerSet);
    emblaApi.on("autoplay:timerstopped", onTimerStopped);

    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
      emblaApi.off("autoplay:timerset", onTimerSet);
      emblaApi.off("autoplay:timerstopped", onTimerStopped);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const el = sectionRef.current;
    if (!el) return;

    const autoplay = emblaApi.plugins().autoplay;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setRevealed(true);
          if (!reduceMotion) autoplay?.play();
          io.disconnect();
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);

    return () => io.disconnect();
  }, [emblaApi, reduceMotion]);

  const goTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      emblaApi.plugins().autoplay?.reset();
    },
    [emblaApi]
  );

  const goPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    emblaApi.plugins().autoplay?.reset();
  }, [emblaApi]);

  const goNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    emblaApi.plugins().autoplay?.reset();
  }, [emblaApi]);

  function fillClassName(isActive: boolean) {
    if (!isActive) return "w-0";
    if (reduceMotion) return "w-full";
    if (!started) return "w-0";
    return "w-0 animate-[rotorfill_7s_linear_forwards]";
  }

  return (
    <section
      ref={sectionRef}
      id="agents"
      className="bg-panel py-[150px]"
      aria-roledescription={t.rotor.roleDescription}
      aria-label={t.rotor.ariaLabel}
    >
      <Wrap>
        <Reveal>
          <div className="relative">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex">
                {slides.map((slide, i) => {
                  const show = revealed && i === selectedIndex;

                  return (
                    <article
                      key={slide.key}
                      role="tabpanel"
                      id={`rpanel-${slide.key}`}
                      aria-label={slide.tab}
                      aria-hidden={i !== selectedIndex}
                      className="min-w-0 flex-[0_0_100%]"
                    >
                      <div className="grid grid-cols-2 items-center gap-24 max-[900px]:grid-cols-1 max-[900px]:gap-12">
                        {slide.key === "apps" && (
                          <>
                            <div>
                              <m.h2 {...reveal(show, 0)} className={H2_CLASS}>
                                <Rich content={slide.title} />
                              </m.h2>
                              <m.p
                                {...reveal(show, 0.1)}
                                className={DESC_CLASS}
                              >
                                {slide.desc}
                              </m.p>
                            </div>
                            <div>
                              <m.div
                                {...reveal(show, 0)}
                                className="inline-block border-b-2 border-blue pb-2 font-mono text-[11px] uppercase tracking-[0.05em] text-ink2"
                              >
                                {slide.stackLabel}
                              </m.div>
                              <m.div
                                {...reveal(show, 0.18)}
                                className="mt-10 grid grid-cols-3 gap-y-11 gap-x-5 max-[760px]:gap-y-8 max-[760px]:gap-x-3"
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
                          </>
                        )}

                        {slide.key === "agentic" && (
                          <>
                            <div>
                              <m.h2 {...reveal(show, 0)} className={H2_CLASS}>
                                <Rich content={slide.title} />
                              </m.h2>
                              <m.div
                                {...reveal(show, 0.18)}
                                className="mt-9 flex flex-wrap gap-y-[18px] gap-x-9"
                              >
                                {slide.stackRow.map((logoKey) => (
                                  <StackItem
                                    key={logoKey}
                                    logoKey={logoKey}
                                    variant="row"
                                  />
                                ))}
                              </m.div>
                            </div>
                            <div>
                              {slide.convictions.map((conviction, ri) => (
                                <m.div
                                  key={conviction.key}
                                  {...reveal(show, CONV_DELAYS[ri] ?? 0.35)}
                                  className="border-t border-rule py-[22px] last:border-b"
                                >
                                  <div className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink2">
                                    {conviction.key}
                                  </div>
                                  <p className="mt-1.5 max-w-[46ch] text-[15px] leading-normal text-muted">
                                    {conviction.value}
                                  </p>
                                </m.div>
                              ))}
                            </div>
                          </>
                        )}

                        {slide.key === "equipes" && (
                          <>
                            <div>
                              <m.h2 {...reveal(show, 0)} className={H2_CLASS}>
                                <Rich content={slide.title} />
                              </m.h2>
                            </div>
                            <m.p {...reveal(show, 0.1)} className={DESC_CLASS}>
                              {slide.desc}
                            </m.p>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="mt-[72px] flex items-center gap-6 max-[760px]:mt-14 max-[760px]:flex-wrap max-[760px]:gap-4">
              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label={t.rotor.tablistLabel}
              >
                {slides.map((slide, i) => {
                  const isActive = i === selectedIndex;

                  return (
                    <button
                      key={slide.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`rpanel-${slide.key}`}
                      aria-label={`${t.rotor.goTo} ${i + 1} — ${slide.tab}`}
                      onClick={() => goTo(i)}
                      className="relative h-1 w-[54px] overflow-hidden bg-rule"
                    >
                      <span
                        key={isActive ? fillKey : "idle"}
                        className={clsx(
                          "absolute inset-0 bg-blue",
                          fillClassName(isActive)
                        )}
                        style={
                          isActive && started && !reduceMotion
                            ? {
                                animationPlayState: paused
                                  ? "paused"
                                  : "running",
                              }
                            : undefined
                        }
                      />
                    </button>
                  );
                })}
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={t.rotor.prev}
                  className="text-black/45 grid h-[52px] w-[52px] place-items-center transition-colors duration-200 ease-epure hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  <svg
                    className="h-[30px] w-[30px]"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M10 3 5 8l5 5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={t.rotor.next}
                  className="text-black/45 grid h-[52px] w-[52px] place-items-center transition-colors duration-200 ease-epure hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  <svg
                    className="h-[30px] w-[30px]"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}
