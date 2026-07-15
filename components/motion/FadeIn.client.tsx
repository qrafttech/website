"use client";

import { ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeIn({
  children,
  className,
  delay = 0,
}: FadeInProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

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
