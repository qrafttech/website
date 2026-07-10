import Image from "next/image";
import clsx from "clsx";

import qPixel from "@/public/images/q_pixel.png";

interface BrandProps {
  className?: string;
  markClassName?: string;
}

/** The pixel Q standing in for the initial: `Q` + `raft`, baseline-aligned. */
export default function Brand({ className, markClassName }: BrandProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-baseline gap-[2px] font-display font-bold tracking-[-0.02em]",
        className
      )}
    >
      <Image
        src={qPixel}
        alt=""
        aria-hidden
        priority
        className={clsx("h-auto self-baseline", markClassName ?? "w-[22px]")}
      />
      raft
    </span>
  );
}
