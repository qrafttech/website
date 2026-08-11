import clsx from "clsx";
import Image, { type StaticImageData } from "next/image";

/**
 * Figure — a documentary photograph with a mandatory mono caption.
 *
 * `design.md` sanctions documentary photographs as a proof tier and mono as the
 * caption register. Two rules are enforced here rather than left to the caller:
 *
 *  1. **The caption is required.** An uncaptioned photograph is decor; a
 *     captioned one is a document. There is no default and no optional escape.
 *  2. **Never colour.** The frame is always greyscale, so it stays ink on paper
 *     and never competes with the ≤5 % blue. There is no prop to turn this off.
 *
 * Server component — no client JS.
 */

export type FigureSize = "bleed" | "inline" | "small";

/**
 * `sizes` must describe the slot the frame actually occupies, because the
 * browser picks a srcset candidate from it before layout exists. Every default
 * below assumes the shipped case — the frame sits in ONE HALF of a diptych,
 * inside the page column, which is the viewport minus the 5.75rem rail. An
 * over-stated `sizes` is not a rounding error: claiming the full column for a
 * half-column slot doubles the computed need and jumps the browser two
 * candidates up the srcset. Measured at a 1440 viewport, alongside the box each
 * one really renders at. Pass `sizes` explicitly for any other placement.
 */
const SIZES: Record<FigureSize, { frame: string; sizes: string }> = {
  /** Full-bleed to the hairline, 60–80vh. The anchor scene. The section that
   *  holds it must drop `Wrap`/`px-gutter` on this half; the caption re-applies
   *  the gutter itself so it never touches the edge.
   *  Box: 674px at 1440 — exactly half the page column, the diptych gutter
   *  being 0 for a bleed frame. Full width once the halves stack. */
  bleed: {
    frame: "h-[clamp(19rem,56vh,26rem)] nav:h-[clamp(30rem,72vh,46rem)]",
    sizes: "(min-width: 900px) calc((100vw - 5.75rem) / 2), 100vw",
  },
  /** A supporting frame inside a diptych half or a `Wrap`.
   *  Box: 568px at 1440 — half the page column, less the `px-gutter` its half
   *  carries on both sides. Below 900px, full width less that same gutter. */
  inline: {
    frame: "aspect-[16/10]",
    sizes: "(min-width: 900px) 40vw, calc(100vw - 3rem)",
  },
  /** The small frame that sits beside a CTA. Portrait.
   *  Box: 238px at 1440 — a fixed width set by the caller, not a fraction. */
  small: {
    frame: "aspect-[3/4]",
    sizes: "(min-width: 900px) 15rem, 11rem",
  },
};

interface FigureProps {
  src: StaticImageData;
  /** Describe what is in the frame, for someone who cannot see it. */
  alt: string;
  /**
   * Space Mono caption. **Required — a photograph without one is not shippable.**
   *
   * Pass it from the copy file (`origine.photos[].caption`), never as a literal
   * written at the call site: a caption is reviewed prose and must not be able
   * to drift from the reviewed text. There is deliberately no `date` prop —
   * nobody has the years for the archival frames, so the captions carry
   * « dans l'ancien bureau » instead, and a guessed year on a photograph of a
   * former colleague is exactly the checkable false detail this page cannot
   * ship. If real dates arrive, they belong inside the caption string, in the
   * copy file, next to the sentence they qualify.
   */
  caption: string;
  size?: FigureSize;
  /**
   * Override the variant's `sizes`. The defaults describe a frame in one half
   * of a diptych; a frame placed anywhere else — full width, a third column,
   * a fixed box — must declare its real slot here, or the browser will pick
   * its candidate from a lie.
   */
  sizes?: string;
  /** Ship the paper dot-screen treatment. Off by default. */
  halftone?: boolean;
  /** `object-position` for the crop, e.g. `"50% 35%"`. */
  focus?: string;
  priority?: boolean;
  /** Set the caption beside the frame instead of beneath it (≥900px). */
  captionBeside?: boolean;
  className?: string;
}

export default function Figure({
  src,
  alt,
  caption,
  size = "inline",
  sizes,
  halftone = false,
  focus,
  priority = false,
  captionBeside = false,
  className,
}: FigureProps) {
  const { frame, sizes: defaultSizes } = SIZES[size];
  const isBleed = size === "bleed";

  return (
    <figure
      className={clsx(
        captionBeside && "nav:flex nav:items-start nav:gap-6",
        className
      )}
    >
      <div
        className={clsx(
          "relative overflow-hidden bg-tint",
          frame,
          captionBeside ? "nav:min-w-0 nav:flex-1" : "w-full",
          !isBleed && "border border-hair",
          halftone && "figure-halftone"
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? defaultSizes}
          priority={priority}
          placeholder="blur"
          style={focus ? { objectPosition: focus } : undefined}
          className={clsx(
            "object-cover grayscale",
            // Never colour: greyscale IS ink on paper. The contrast nudge is
            // what keeps a photograph from going flat against canvas #fbfbf8;
            // the halftone screen lifts the shadows, so it gets a little more.
            halftone ? "brightness-[1.04] contrast-[1.1]" : "contrast-[1.04]"
          )}
        />
      </div>

      <figcaption
        className={clsx(
          "mt-3 font-mono text-[0.6875rem] leading-[1.6] text-muted",
          captionBeside && "nav:mt-0 nav:w-[13rem] nav:flex-none",
          isBleed && "px-gutter"
        )}
      >
        <span className="block max-w-[46ch]">{caption}</span>
      </figcaption>
    </figure>
  );
}
