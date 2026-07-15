import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps } from "react";

const BASE =
  "font-mono text-xs uppercase tracking-[0.08em] transition-colors ease-epure hover:text-blue";

type MonoLinkProps = ComponentProps<typeof Link>;

export default function MonoLink({
  className,
  children,
  ...props
}: MonoLinkProps) {
  return (
    <Link className={clsx(BASE, className)} {...props}>
      {children}
    </Link>
  );
}
