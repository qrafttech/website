import { ReactNode } from "react";
import clsx from "clsx";

/** design.md:58 — diptych gutters. */
const GUTTER = "clamp(1.5rem,3.2vw,3.25rem)";
const ROW_GAP = "3rem";

/** Track sizing, keyed by which half carries the proof and which half is the
 *  wider one. The proof half is placed with `order` rather than by swapping
 *  the markup, so the text always reads first in the DOM and on mobile. */
const COLUMNS = {
  right: {
    even: "nav:grid-cols-2",
    text: "nav:grid-cols-[1.45fr_1fr]",
    proof: "nav:grid-cols-[1fr_1.45fr]",
  },
  left: {
    even: "nav:grid-cols-2",
    text: "nav:grid-cols-[1fr_1.45fr]",
    proof: "nav:grid-cols-[1.45fr_1fr]",
  },
} as const;

interface DiptychProps {
  text: ReactNode;
  proof: ReactNode;
  /** Which half carries the proof. Flips down the page. design.md:19-21. */
  side?: keyof typeof COLUMNS;
  /** Which half is the wider one. */
  emphasis?: keyof typeof COLUMNS["right"];
  gutter?: string;
  className?: string;
}

export default function Diptych({
  text,
  proof,
  side = "right",
  emphasis = "even",
  gutter = GUTTER,
  className,
}: DiptychProps) {
  const flip = side === "left";
  // Half a gutter outside the proof half, so the rule sits centred in the
  // gutter whatever the track ratio is.
  const offset = `calc(${gutter} / -2)`;

  return (
    <div
      className={clsx("grid grid-cols-1", COLUMNS[side][emphasis], className)}
      style={{ columnGap: gutter, rowGap: ROW_GAP }}
    >
      <div className={clsx("min-w-0", flip && "nav:order-2")}>{text}</div>
      <div className={clsx("relative min-w-0", flip && "nav:order-1")}>
        <span
          aria-hidden="true"
          className="absolute inset-y-0 z-[1] hidden w-px bg-line nav:block"
          style={flip ? { right: offset } : { left: offset }}
        />
        {proof}
      </div>
    </div>
  );
}
