"use client";

import { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
