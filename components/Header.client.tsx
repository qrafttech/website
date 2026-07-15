"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";

import Brand from "@/components/Brand";
import CtaLink from "@/components/CtaLink";
import { nav } from "@/lib/i18n/fr/shell";

const MENU_ID = "mobile-nav";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-hair bg-canvas">
      <nav className="flex h-[var(--header-h)] items-center gap-9 px-6">
        <Link
          href="/"
          aria-label={nav.brandLabel}
          className="text-[20px]"
          onClick={() => setOpen(false)}
        >
          <Brand priority />
        </Link>

        <ul className="flex items-center max-nav:hidden">
          {nav.links.map((link, index) => (
            <li key={link.href} className="flex items-center">
              {index > 0 ? (
                <span
                  aria-hidden
                  className="mx-5 h-[var(--header-h)] w-px bg-line"
                />
              ) : null}
              <Link
                href={link.href}
                className="text-[15px] text-ink2 hover:text-blue"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <CtaLink href={nav.ctaHref} size="sm">
            {nav.cta}
          </CtaLink>
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            aria-expanded={open}
            aria-controls={open ? MENU_ID : undefined}
            onClick={() => setOpen((value) => !value)}
            className="-mr-1 inline-flex items-center justify-center p-1 text-ink2 hover:text-blue nav:hidden"
          >
            {open ? (
              <XMarkIcon className="w-6" />
            ) : (
              <Bars3Icon className="w-6" />
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id={MENU_ID}
          className="absolute inset-x-0 top-full border-b border-hair bg-canvas nav:hidden"
        >
          <ul className="divide-y divide-hair">
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3.5 font-display text-lg hover:text-blue"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={nav.ctaHref}
                onClick={() => setOpen(false)}
                className="block px-6 py-3.5 font-display text-lg text-blue hover:text-ink2"
              >
                {nav.cta}
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
