import Link from "next/link";

import Brand from "@/components/Brand";
import Rich from "@/components/Rich";
import Wrap from "@/components/Wrap";
import { getDictionary } from "@/lib/i18n";

export default function Footer() {
  const t = getDictionary();

  return (
    <footer className="border-t border-hair pt-16">
      <Wrap>
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 max-[900px]:grid-cols-2">
          <div>
            <p className="max-w-[30ch] text-sm leading-normal text-muted">
              <Rich content={t.footer.tagline} />
            </p>
          </div>
          {t.footer.columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-3.5 font-mono text-xs font-normal uppercase leading-normal text-muted">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="text-[15px] text-ink2 hover:text-blue"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[15px] text-ink2 hover:text-blue"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-end justify-between gap-6 border-t border-hair pb-7 pt-8 max-[900px]:flex-col max-[900px]:items-start">
          <Brand
            className="text-[clamp(28px,4vw,44px)]"
            markClassName="w-[clamp(34px,5vw,52px)]"
          />
          <div className="text-right font-mono text-[11px] uppercase tracking-[0.08em] text-muted max-[900px]:text-left">
            <Rich content={t.footer.meta} />
            <br />
            {t.footer.copyright}
          </div>
        </div>
      </Wrap>
    </footer>
  );
}
