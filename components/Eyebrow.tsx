import clsx from "clsx";
import type { ElementType, ReactNode } from "react";

const BASE = "font-mono text-xs uppercase tracking-[0.08em] text-muted";

interface EyebrowProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export default function Eyebrow({
  children,
  as: Tag = "p",
  className,
}: EyebrowProps) {
  return <Tag className={clsx(BASE, className)}>{children}</Tag>;
}
