"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { m, type Variants } from "motion/react";

import { EASE, VIEWPORT_ONCE } from "@/lib/motion";

interface RiseLineProps {
  children: ReactNode;
  /** `mount` for the hero (above the fold), `view` for section titles. */
  trigger?: "mount" | "view";
  delay?: number;
  duration?: number;
  className?: string;
}

const lineVariants: Variants = {
  hidden: { y: "112%" },
  show: { y: "0%" },
};

/**
 * A masked line of a display heading: the inner span starts pushed below its
 * clipping box and rises into place. The negative margin cancels the padding
 * that keeps descenders from being clipped.
 *
 * The viewport trigger lives on the mask, not on the span it clips: an
 * IntersectionObserver measures its target after ancestor clipping, so a span
 * parked below its own `overflow:hidden` parent never reports as visible.
 */
export default function RiseLine({
  children,
  trigger = "view",
  delay = 0,
  duration = 1,
  className,
}: RiseLineProps) {
  const triggerProps =
    trigger === "mount"
      ? { animate: "show" }
      : { whileInView: "show", viewport: VIEWPORT_ONCE };

  return (
    <m.span
      className="block overflow-hidden pb-[0.08em] [margin-bottom:-0.08em]"
      initial="hidden"
      {...triggerProps}
    >
      <m.span
        className={clsx("block", className)}
        variants={lineVariants}
        transition={{ duration, ease: EASE, delay }}
      >
        {children}
      </m.span>
    </m.span>
  );
}
