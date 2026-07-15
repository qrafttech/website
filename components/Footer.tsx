import Link from "next/link";

import Brand from "@/components/Brand";
import Eyebrow from "@/components/Eyebrow";
import Rich from "@/components/Rich";
import Wrap from "@/components/Wrap";
import { footer } from "@/lib/i18n/fr/shell";

export default function Footer() {
  return (
    <footer className="border-t border-hair pt-16">
      <Wrap>
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 max-nav:grid-cols-2">
          <div>
            <p className="max-w-[30ch] text-sm leading-normal text-muted">
              <Rich content={footer.tagline} />
            </p>
          </div>
          {footer.columns.map((column) => (
            <div key={column.title}>
              <Eyebrow as="h4" className="mb-3.5 font-normal">
                {column.title}
              </Eyebrow>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => {
                  const LinkComponent = link.href.startsWith("mailto:")
                    ? "a"
                    : Link;
                  return (
                    <li key={link.label}>
                      <LinkComponent
                        href={link.href}
                        className="text-[0.9375rem] text-ink2 hover:text-blue"
                      >
                        {link.label}
                      </LinkComponent>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-end justify-between gap-6 border-t border-hair pb-7 pt-8 max-nav:flex-col max-nav:items-start">
          <Brand
            className="text-[clamp(1.75rem,4vw,2.75rem)]"
            markClassName="w-[clamp(2.125rem,5vw,3.25rem)]"
          />
          <div className="text-right font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted max-nav:text-left">
            <Rich content={footer.meta} />
            <br />
            {footer.copyright}
          </div>
        </div>
      </Wrap>
    </footer>
  );
}
