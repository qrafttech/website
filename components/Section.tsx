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
  rhythm = RHYTHM,
  contain = "measure",
  className,
}: SectionProps) {
  return (
    /* No section-boundary rule. Every boundary on the page is carried by the
     * band change and the `py-24` / `nav:py-[9.375rem]` rhythm; the one section
     * that also ruled its bottom edge was the outlier, and a rule saying what
     * the surface and the air already say is the kind of separator this design
     * was asked to stop using. */
    <section id={id} className={clsx(BANDS[band], rhythm, className)}>
      {contain === "measure" ? (
        <Wrap>{children}</Wrap>
      ) : (
        <div className={CONTAINERS[contain]}>{children}</div>
      )}
    </section>
  );
}
