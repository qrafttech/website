"use client";

import { m, useReducedMotion } from "motion/react";

import { EASE, VIEWPORT_ONCE } from "@/lib/motion";

export default function GrowBar({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className} style={{ width: 34 }} />;
  }

  return (
    <m.div
      className={className}
      initial={{ width: 0 }}
      whileInView={{ width: 34 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
    />
  );
}
