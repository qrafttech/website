import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

const BASE =
  "bg-blue text-[#fafafa] transition-colors ease-epure hover:bg-ink2";

const SIZES = {
  md: "inline-block px-5 py-3 text-[0.9375rem]",
  sm: "inline-block px-[1.125rem] py-[0.5625rem] text-sm",
  block: "block py-3 text-center text-[0.9375rem]",
} as const;

interface CtaLinkProps {
  href: string;
  children: ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
}

export default function CtaLink({
  href,
  children,
  size = "md",
  className,
}: CtaLinkProps) {
  const cls = clsx(BASE, SIZES[size], className);

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
