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
    margin: "nav:grid-cols-[1fr_2.4fr]",
  },
  left: {
    even: "nav:grid-cols-2",
    text: "nav:grid-cols-[1fr_1.45fr]",
    proof: "nav:grid-cols-[1.45fr_1fr]",
    margin: "nav:grid-cols-[2.4fr_1fr]",
  },
} as const;

const ALIGN = {
  stretch: "",
  start: "nav:items-start",
  center: "nav:items-center",
  end: "nav:items-end",
} as const;

interface DiptychProps {
  text: ReactNode;
  proof: ReactNode;
  /** Which half carries the proof. Flips down the page. design.md:19-21. */
  side?: keyof typeof COLUMNS;
  /**
   * Which half is the wider one. `margin` is the marginal-head ratio: a
   * section whose proof is a long ledger and whose text is only a heading
   * should not reserve a half-width column for it — the leftover reads as a
   * void rather than as composure. The narrow head also lets the ledger run
   * wider, so the section gets shorter at the same time.
   */
  emphasis?: keyof typeof COLUMNS["right"];
  align?: keyof typeof ALIGN;
  divider?: boolean;
  gutter?: string;
  rowGap?: string;
  className?: string;
}

export default function Diptych({
  text,
  proof,
  side = "right",
  emphasis = "even",
  align = "stretch",
  divider = true,
  gutter = GUTTER,
  rowGap = ROW_GAP,
  className,
}: DiptychProps) {
  const flip = side === "left";
  // Half a gutter outside the proof half, so the rule sits centred in the
  // gutter whatever the track ratio is.
  const offset = `calc(${gutter} / -2)`;

  return (
    <div
      className={clsx(
        "grid grid-cols-1",
        COLUMNS[side][emphasis],
        ALIGN[align],
        className
      )}
      style={{ columnGap: gutter, rowGap }}
    >
      <div className={clsx("min-w-0", flip && "nav:order-2")}>{text}</div>
      <div className={clsx("relative min-w-0", flip && "nav:order-1")}>
        {divider ? (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 z-[1] hidden w-px bg-line nav:block"
            style={flip ? { right: offset } : { left: offset }}
          />
        ) : null}
        {proof}
      </div>
    </div>
  );
}
