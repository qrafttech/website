"use client";

import { ReactNode } from "react";
import { m } from "motion/react";

import { EASE, VIEWPORT_ONCE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  trigger?: "mount" | "view";
  className?: string;
  delay?: number;
}

export default function Reveal({
  children,
  trigger = "view",
  className,
  delay = 0,
}: RevealProps) {
  if (trigger === "mount") {
    return (
      <m.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        {children}
      </m.div>
    );
  }

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
