import Image from "next/image";
import clsx from "clsx";

import qPixel from "@/public/images/q_pixel.png";

interface BrandProps {
  className?: string;
  priority?: boolean;
}

/**
 * The lockup, and why both numbers are what they are.
 *
 * `q_pixel.png` is a tight square: the glyph touches all four edges, and the
 * bottom 6.8 % of it is the Q's tail alone — the bowl ends at 93.2 % of the
 * file's height. Two things follow, and getting either wrong is what makes the
 * mark read as pasted next to the word rather than set with it.
 *
 * 1. WIDTH. Sora's cap height is 0.751 em, so a bowl of that height needs a
 *    mark of 0.751 / 0.932 = 0.806 em. 0.82 em adds the ~2 % overshoot a round
 *    letter takes against flat-topped neighbours. At 1.08 em — what the footer
 *    carried — the bowl stood 19 % taller than the « ft » ascenders beside it.
 * 2. BASELINE. `align-self: baseline` puts the image's BOTTOM edge on the text
 *    baseline, which is the tail's bottom, so the bowl floated a pixel and a
 *    half above the line. Pushing the mark down by its own tail (6.8 %) sits
 *    the bowl on the baseline and lets the tail descend below it, which is
 *    where a Q's tail belongs. A transform, so nothing in the row moves.
 */
const MARK_WIDTH = "w-[0.82em]";

export default function Brand({ className, priority = false }: BrandProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-baseline gap-0.5 font-display font-bold tracking-[-0.02em]",
        className
      )}
    >
      <span className="sr-only">Q</span>
      <Image
        src={qPixel}
        alt=""
        aria-hidden
        priority={priority}
        sizes="32px"
        className={clsx("h-auto translate-y-[6.8%] self-baseline", MARK_WIDTH)}
      />
      raft
    </span>
  );
}
