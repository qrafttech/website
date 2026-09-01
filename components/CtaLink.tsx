import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

const BASE = "transition-colors ease-epure";

const TONES = {
  blue: "bg-blue text-canvas hover:bg-ink2",
  ink: "border border-ink bg-ink text-canvas hover:bg-transparent hover:text-ink",
} as const;

const SIZES = {
  md: "inline-block px-5 py-3 text-[0.9375rem]",
  sm: "inline-block px-[1.125rem] py-[0.5625rem] text-sm",
  lg: "inline-block px-7 py-4 text-[1.0625rem]",
  block: "block py-3 text-center text-[0.9375rem]",
} as const;

interface CtaLinkProps {
  href: string;
  children: ReactNode;
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
  className?: string;
  /** For a caller that has UI to dismiss on activation — the mobile nav panel,
   *  whose anchor CTA never changes the pathname it could listen to. */
  onClick?: () => void;
}

export default function CtaLink({
  href,
  children,
  tone = "blue",
  size = "md",
  className,
  onClick,
}: CtaLinkProps) {
  const cls = clsx(BASE, TONES[tone], SIZES[size], className);

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}
