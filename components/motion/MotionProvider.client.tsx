"use client";

import { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * `domAnimation` keeps the bundle small (no layout/drag features), and
 * `reducedMotion="user"` drops every transform animation for users who ask for
 * it — which is what the proto's `noanim` class did by hand.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
