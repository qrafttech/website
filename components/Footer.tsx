import Link from "next/link";

import Brand from "@/components/Brand";
import Rich from "@/components/Rich";
import Wrap from "@/components/Wrap";
import { nav, footer } from "@/lib/i18n/fr/shell";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <Wrap>
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-5 pb-7 pt-9">
          <Brand className="text-[1.5rem]" markClassName="w-[1.625rem]" />
          <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-2.5">
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.08em] text-ink2 transition-colors ease-epure hover:text-blue"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-hair pb-10 pt-7">
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
