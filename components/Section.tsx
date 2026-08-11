import { ReactNode } from "react";
import clsx from "clsx";

import Wrap from "@/components/Wrap";

/** Secondary surfaces, ordered as the surface scale. design.md:110 allows at
 *  most one step of this scale between adjacent sections. */
const BANDS = {
  canvas: "bg-canvas",
  sand: "bg-sand",
  band: "bg-band",
  panel: "bg-panel",
} as const;

const RULES = {
  none: "",
  top: "border-t border-line",
  bottom: "border-b border-line",
} as const;

const RHYTHM = "py-24 nav:py-[9.375rem]";

const CONTAINERS = {
  measure: "",
  gutter: "px-gutter",
  bleed: "",
} as const;

export type Band = keyof typeof BANDS;

interface SectionProps {
  children: ReactNode;
  id?: string;
  band?: Band;
  rule?: keyof typeof RULES;
  /** Vertical rhythm utilities. Replaces the default rather than adding to it,
   *  so an override cannot collide with it. design.md:59 — the final CTA and
   *  404 deliberately run larger. */
  rhythm?: string;
  /** `measure` constrains to 75rem. `gutter` is full-width with only the page
   *  gutter, as a full-width ledger uses. `bleed` applies no padding at all,
   *  for a section whose own halves carry their padding — the only way a
   *  photograph can reach the page edge. */
  contain?: keyof typeof CONTAINERS;
  className?: string;
}

export default function Section({
  children,
  id,
  band = "canvas",
  rule = "none",
  rhythm = RHYTHM,
  contain = "measure",
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(BANDS[band], RULES[rule], rhythm, className)}
    >
      {contain === "measure" ? (
        <Wrap>{children}</Wrap>
      ) : (
        <div className={CONTAINERS[contain]}>{children}</div>
      )}
    </section>
  );
}
