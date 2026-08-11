import { ReactNode } from "react";
import clsx from "clsx";

import RiseLine from "@/components/motion/RiseLine.client";

/** design.md:52 — the section display anchor. For a heading with the full
 *  content width behind it, such as the origin dateline. */
export const ANCHOR = "text-[clamp(2rem,5vw,4rem)]";

/** The step below the anchor, for a heading set in the narrow marginal column
 *  of a diptych. Measured: that column is ~450px at 1440 and ~350px at 1024,
 *  so the anchor's 5vw slope leaves roughly seven characters per line at mid
 *  widths and strands words no matter how the measure is tuned. The gentler
 *  3.4vw slope keeps every section heading to two lines from 390 to 1440. */
export const MARGINAL = "text-[clamp(1.75rem,3.4vw,3.25rem)]";

/** Display leading, plus balanced wrapping so a two-line heading breaks at a
 *  phrase boundary instead of stranding its last word. `text-wrap` inherits,
 *  so setting it here reaches the text inside `RiseLine`'s spans. Tailwind
 *  3.2 predates the `text-balance` utility, hence the arbitrary property. */
const DISPLAY = "leading-[1.04] [text-wrap:balance]";

interface SectionTitleProps {
  children: ReactNode;
  /** Font-size utility. Replaces the anchor rather than adding to it, so an
   *  override cannot collide with it. */
  size?: string;
  className?: string;
}

export default function SectionTitle({
  children,
  size = ANCHOR,
  className,
}: SectionTitleProps) {
  return (
    <h2 className={clsx("font-bold", DISPLAY, size, className)}>
      <RiseLine trigger="view">{children}</RiseLine>
    </h2>
  );
}
