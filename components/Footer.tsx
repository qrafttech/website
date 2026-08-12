import Link from "next/link";

import Brand from "@/components/Brand";
import Rich from "@/components/Rich";
import Wrap from "@/components/Wrap";
import { type Locale, hasBlog, localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Footer({
  lang,
  nav,
  footer,
}: {
  lang: Locale;
  nav: Dictionary["nav"];
  footer: Dictionary["footer"];
}) {
  const links = nav.links.filter(
    (link) => link.key !== "blog" || hasBlog(lang)
  );

  return (
    <footer className="border-t border-line">
      <Wrap>
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-5 pb-7 pt-9">
          {/* No `markClassName`: the lockup's proportion is `Brand`'s to keep,
              and the 1.625rem override here is what made the footer's Q stand
              a fifth taller than the word it belongs to. */}
          <Brand className="text-[1.5rem]" />
          <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-2.5">
            {links.map((link) => (
              <li key={link.key}>
                <Link
                  href={localeHref(lang, link.href)}
                  className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.08em] text-ink2 transition-colors ease-epure hover:text-blue"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* No second rule inside the footer. The one at the top separates the
            footer from the page, which nothing else does; between the link row
            and the colophon there are 56px and a jump from Inter to Space
            Mono, which is already two signals. */}
        <div className="pb-10 pt-7">
          <p className="max-w-[64ch] font-mono text-xs leading-[1.9] text-muted">
            <Rich content={footer.tagline} strongClassName="font-normal" />{" "}
            {footer.contact}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-ink2 underline decoration-hair underline-offset-4 transition-colors ease-epure hover:text-blue"
            >
              {CONTACT_EMAIL}
            </a>
            . {footer.copyright}.
          </p>
        </div>
      </Wrap>
    </footer>
  );
}
