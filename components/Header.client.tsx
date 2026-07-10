"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";

import Brand from "@/components/Brand";
import { getDictionary } from "@/lib/i18n";

const MENU_ID = "mobile-nav";

export default function Header() {
  const t = getDictionary();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-hair bg-canvas">
      <nav className="flex h-14 items-center gap-9 px-6">
        <Link
          href="/"
          aria-label={t.nav.brandLabel}
          className="text-[20px]"
          onClick={() => setOpen(false)}
        >
          <Brand />
        </Link>

        <ul className="flex items-center max-[900px]:hidden">
          {t.nav.links.map((link, index) => (
            <li key={link.href} className="flex items-center">
              {index > 0 ? (
                <span aria-hidden className="mx-5 h-14 w-px bg-line" />
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
          <Link
            href={t.nav.ctaHref}
            className="bg-blue px-[18px] py-[9px] text-sm text-[#fafafa] hover:bg-ink2"
          >
            {t.nav.cta}
          </Link>
          <button
            type="button"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => setOpen((value) => !value)}
            className="-mr-1 inline-flex items-center justify-center p-1 text-ink2 hover:text-blue min-[900px]:hidden"
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
          className="absolute inset-x-0 top-full border-b border-hair bg-canvas min-[900px]:hidden"
        >
          <ul className="divide-y divide-hair">
            {t.nav.links.map((link) => (
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
                href={t.nav.ctaHref}
                onClick={() => setOpen(false)}
                className="block px-6 py-3.5 font-display text-lg text-blue hover:text-ink2"
              >
                {t.nav.cta}
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
