"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import Brand from "@/components/Brand";
import CtaLink from "@/components/CtaLink";
import LangSwitcher from "@/components/LangSwitcher.client";
import {
  type Locale,
  hasBlog,
  localeHref,
  localePath,
  splitLocale,
} from "@/lib/i18n/config";
import type { Dictionary, NavLink } from "@/lib/i18n/types";

/**
 * N4 — the top bar. Replaces the N3 side-rail (`design.md`).
 *
 * Ordinary shape on purpose: wordmark left, links in the middle, locale and the
 * one CTA right. What the rail could not do, and what this exists for:
 *
 *   1. It says where you are. The rail's links were five vertical labels of
 *      equal weight whatever page you were on; here the current page and the
 *      section under the reader's eye carry a blue underline (`aria-current`
 *      with it, so the statement is not colour-only).
 *   2. It carries « Discutons » at every scroll depth. The contact CTA used to
 *      live in the hero topline and left the viewport for good after the first
 *      screen — on a page this long that is the whole conversion path gone.
 *   3. It reads as a name, not a glyph. The rail showed the q_pixel mark alone;
 *      the bar has room for the wordmark.
 *
 * Client, for three reasons that are all the current path: the active state,
 * the locale switch, and closing the mobile panel on navigation.
 */

/** Nav items are `/#offres` etc.; split once rather than at every render site. */
function parseHref(href: string): { path: string; hash: string } {
  const at = href.indexOf("#");
  if (at === -1) return { path: href, hash: "" };
  return { path: href.slice(0, at) || "/", hash: href.slice(at + 1) };
}

/**
 * The id of the section the reader is currently in, or `null` above the first
 * one. Observed through a band across the upper third of the viewport: a
 * section becomes current when its top passes under the bar, and stops being
 * current when the next one takes the band. `ids` is empty off the home page,
 * where nothing is observed and no listener is attached.
 */
function useActiveSection(ids: readonly string[]): string | null {
  const key = ids.join(",");
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = key
      .split(",")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Off the home page there is nothing to observe. Whatever the last home
    // section was stays in state and is simply never read: `isActive` gates it
    // on the pathname, and remounting on `/` re-runs the observer, which fires
    // once for every target on connect.
    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Document order, so an overlap resolves to the section that owns the
        // top of the band rather than to whichever entry fired last.
        const current = sections.find((el) => visible.has(el.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

export default function Nav({
  lang,
  nav,
  langSwitcher,
}: {
  lang: Locale;
  nav: Dictionary["nav"];
  langSwitcher: Dictionary["langSwitcher"];
}) {
  const pathname = usePathname() ?? "/";
  const { path } = splitLocale(pathname);

  // The panel is open FOR a path, not open in the abstract. Navigating away
  // closes it by derivation — no effect watching the pathname to call
  // `setOpen(false)` one render late.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (value: boolean) => setOpenFor(value ? pathname : null);

  // The blog is French-only, so on any other locale the item is dropped rather
  // than linked to French prose from an English nav.
  const links = nav.links.filter(
    (link) => link.key !== "blog" || hasBlog(lang)
  );

  const onHome = path === "/";
  const sectionIds = onHome
    ? links.map((link) => parseHref(link.href).hash).filter(Boolean)
    : [];
  const activeSection = useActiveSection(sectionIds);

  // Escape closes the panel; navigation to another route closes it by
  // derivation, and the links close it themselves for same-page anchors.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      // `setOpenFor`, not the `setOpen` wrapper: the setter is stable, so the
      // listener is attached once per open rather than on every render.
      if (event.key === "Escape") setOpenFor(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (link: NavLink) => {
    const { path: linkPath, hash } = parseHref(link.href);
    if (hash) return onHome && activeSection === hash;
    return path === linkPath || path.startsWith(`${linkPath}/`);
  };

  return (
    <header className="bg-canvas/85 sticky top-0 z-40 border-b border-line backdrop-blur-md">
      <div className="mx-auto flex h-[var(--header-h)] items-center gap-4 px-gutter">
        <Link
          href={localePath(lang, "/")}
          aria-label={nav.brandLabel}
          className="flex-none"
          onClick={() => setOpen(false)}
        >
          <Brand className="text-[1.1875rem] nav:text-[1.375rem]" priority />
        </Link>

        <nav aria-label={nav.label} className="ml-auto hidden nav:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => {
              const active = isActive(link);

              return (
                <li key={link.key}>
                  <Link
                    href={localeHref(lang, link.href)}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      // The underline is state, never hover: design.md's hover
                      // budget is one signal, and colour is spending it.
                      "relative block whitespace-nowrap py-1 font-mono text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-colors ease-epure hover:text-blue",
                      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:bg-blue after:content-['']",
                      active ? "text-ink after:block" : "text-ink2 after:hidden"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Locale then CTA, both pinned right: URL-only locale switching is
            undiscoverable, and this is the only affordance that says the site
            has two languages at all. */}
        <div className="ml-auto flex items-center gap-4 nav:ml-8 nav:gap-6">
          <LangSwitcher lang={lang} copy={langSwitcher} />

          <CtaLink
            href={localeHref(lang, nav.cta.href)}
            size="sm"
            className="hidden normal-case tracking-normal nav:inline-block"
          >
            {nav.cta.label}
          </CtaLink>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-panel"
            aria-label={open ? nav.menuClose : nav.menuOpen}
            onClick={() => setOpen(!open)}
            className="-mr-2 flex h-10 w-10 flex-none items-center justify-center text-ink nav:hidden"
          >
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={clsx(
                  "absolute inset-x-0 block h-[2px] bg-current transition-transform duration-200 ease-epure",
                  open ? "top-1.5 rotate-45" : "top-0"
                )}
              />
              <span
                className={clsx(
                  "absolute inset-x-0 top-1.5 block h-[2px] bg-current transition-opacity duration-200 ease-epure",
                  open && "opacity-0"
                )}
              />
              <span
                className={clsx(
                  "absolute inset-x-0 block h-[2px] bg-current transition-transform duration-200 ease-epure",
                  open ? "top-1.5 -rotate-45" : "top-3"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* One panel, rendered only when open. A hidden-but-present menu would
          put five links and a CTA in the tab order of every mobile page. */}
      {open && (
        <nav
          id="nav-panel"
          aria-label={nav.label}
          className="border-t border-hair bg-canvas px-gutter pb-6 pt-2 nav:hidden"
        >
          <ul className="flex flex-col">
            {links.map((link) => {
              const active = isActive(link);

              return (
                <li key={link.key} className="border-b border-hair">
                  <Link
                    href={localeHref(lang, link.href)}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      "block py-3.5 font-mono text-[0.8125rem] font-bold uppercase tracking-[0.1em] transition-colors ease-epure hover:text-blue",
                      active ? "text-blue" : "text-ink2"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <CtaLink
            href={localeHref(lang, nav.cta.href)}
            size="block"
            className="mt-6 normal-case tracking-normal"
            onClick={() => setOpen(false)}
          >
            {nav.cta.label}
          </CtaLink>
        </nav>
      )}
    </header>
  );
}
