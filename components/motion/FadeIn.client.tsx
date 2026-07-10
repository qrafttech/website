"use client";

import { ReactNode } from "react";
import { m } from "motion/react";

import { EASE } from "@/lib/motion";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Above-the-fold entrance: fades in on mount, no viewport trigger. */
export default function FadeIn({
  children,
  className,
  delay = 0,
}: FadeInProps) {
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
