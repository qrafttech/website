import { ReactNode } from "react";
import clsx from "clsx";

/** design.md:52 — the section display size. Every section heading is set in
 *  the narrow marginal column of a diptych, which is ~450px at 1440 and ~350px
 *  at 1024. A 5vw slope leaves roughly seven characters per line at mid widths
 *  and strands words no matter how the measure is tuned; the gentler 3.4vw
 *  slope keeps every section heading to two lines from 390 to 1440. */
const MARGINAL = "text-[clamp(1.75rem,3.4vw,3.25rem)]";

/** Display leading, plus balanced wrapping so a two-line heading breaks at a
 *  phrase boundary instead of stranding its last word. Tailwind 3.2 predates
 *  the `text-balance` utility, hence the arbitrary property. */
const DISPLAY = "leading-[1.04] [text-wrap:balance]";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export default function SectionTitle({
  children,
  className,
}: SectionTitleProps) {
  return (
    <h2 className={clsx("font-bold", DISPLAY, MARGINAL, className)}>
      {children}
    </h2>
  );
}
