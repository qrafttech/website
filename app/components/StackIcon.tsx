import clsx from "clsx";

import { STACK_ICONS, type StackIconSlug } from "@/lib/stack-icons";

interface StackIconProps {
  slug?: StackIconSlug;
  /** Sizing utilities. Case-study stacks run at the 20px default; the arsenal
   *  chips run at 16px, where 20px crowds a 14px label. */
  className?: string;
}

export default function StackIcon({
  slug,
  className = "h-5 w-5",
}: StackIconProps) {
  if (!slug) {
    return (
      <span
        className={clsx("flex shrink-0 items-center justify-center", className)}
      >
        <span className="h-2 w-2 bg-ink/25" />
      </span>
    );
  }

  const icon = STACK_ICONS[slug];

  return (
    <svg
      className={clsx("shrink-0", className)}
      viewBox="0 0 24 24"
      style={{ fill: `#${icon.hex}` }}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}
