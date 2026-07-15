import { STACK_ICONS, type StackIconSlug } from "@/lib/stack-icons";

interface StackIconProps {
  slug?: StackIconSlug;
}

export default function StackIcon({ slug }: StackIconProps) {
  if (!slug) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        <span className="h-2 w-2 bg-ink/25" />
      </span>
    );
  }

  const icon = STACK_ICONS[slug];

  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      style={{ fill: `#${icon.hex}` }}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}
