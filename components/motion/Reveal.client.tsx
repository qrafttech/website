"use client";

import { ReactNode } from "react";
import { m } from "motion/react";

import { EASE, VIEWPORT_ONCE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Reveal-once on scroll: fade up, no scrub, no rebound. */
export default function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </m.div>
  );
}
