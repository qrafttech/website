import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

const BASE =
  "bg-blue text-[#fafafa] transition-colors ease-epure hover:bg-ink2";

const SIZES = {
  md: "inline-block px-5 py-3 text-[15px]",
  sm: "inline-block px-[18px] py-[9px] text-sm",
  block: "block py-3 text-center text-[15px]",
} as const;

interface CtaLinkProps {
  href: string;
  children: ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
  onClick?: () => void;
}

export default function CtaLink({
  href,
  children,
  size = "md",
  className,
  onClick,
}: CtaLinkProps) {
  const cls = clsx(BASE, SIZES[size], className);

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
