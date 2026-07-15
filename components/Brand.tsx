import Image from "next/image";
import clsx from "clsx";

import qPixel from "@/public/images/q_pixel.png";

interface BrandProps {
  className?: string;
  markClassName?: string;
  priority?: boolean;
}

export default function Brand({
  className,
  markClassName,
  priority = false,
}: BrandProps) {
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
        sizes="52px"
        className={clsx(
          "h-auto self-baseline",
          markClassName ?? "w-[1.375rem]"
        )}
      />
      raft
    </span>
  );
}
