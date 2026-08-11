import Image from "next/image";
import Link from "next/link";

import LangSwitcher from "@/components/LangSwitcher.client";
import {
  type Locale,
  hasBlog,
  localeHref,
  localePath,
} from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import qPixel from "@/public/images/q_pixel.png";

export default function Rail({
  lang,
  nav,
  langSwitcher,
}: {
  lang: Locale;
  nav: Dictionary["nav"];
  langSwitcher: Dictionary["langSwitcher"];
}) {
  // The blog is French-only, so on any other locale the item is dropped rather
  // than linked to French prose from an English nav.
  const links = nav.links.filter(
    (link) => link.key !== "blog" || hasBlog(lang)
  );

  return (
    <nav
      aria-label={nav.railLabel}
      className="sticky top-0 z-40 flex items-center gap-4 border-b border-line bg-canvas px-4 py-3 nav:h-[100svh] nav:flex-col nav:gap-[1.875rem] nav:self-start nav:border-b-0 nav:border-r nav:px-0 nav:pb-6 nav:pt-5"
    >
      <Link
        href={localePath(lang, "/")}
        aria-label={nav.brandLabel}
        className="block w-[1.875rem] flex-none nav:w-[2.375rem]"
      >
        <Image
          src={qPixel}
          alt=""
          aria-hidden
          priority
          sizes="38px"
          className="block h-auto w-full"
        />
      </Link>

      <ul className="ml-auto flex items-center gap-[0.875rem] nav:m-auto nav:flex-col nav:gap-[1.375rem]">
        {links.map((link) => (
          <li key={link.key}>
            <Link
              href={localeHref(lang, link.href)}
              className="whitespace-nowrap font-mono text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-ink2 transition-colors ease-epure hover:text-blue nav:text-[0.8125rem] nav:tracking-[0.14em] nav:[writing-mode:vertical-rl]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Below the nav links and above the blue tick, so the rail reads
          navigation → locale → mark. URL-only locale switching is
          undiscoverable; this is the only affordance that says the site has
          two languages at all. */}
      <LangSwitcher lang={lang} copy={langSwitcher} />

      <span
        aria-hidden="true"
        className="hidden h-2 w-2 flex-none bg-blue nav:block"
      />
    </nav>
  );
}
