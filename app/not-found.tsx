import Link from "next/link";

import Wrap from "@/components/Wrap";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const t = getDictionary();

  return (
    <main>
      <Wrap>
        <div className="flex flex-col items-center py-32 text-center md:py-40">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            {t.notFound.eyebrow}
          </p>
          <h1 className="mt-5 text-[clamp(40px,6vw,80px)] font-bold leading-[1.02] text-ink">
            {t.notFound.title}
          </h1>
          <p className="mt-5 max-w-[42ch] text-muted">{t.notFound.body}</p>
          <Link
            href="/"
            className="mt-8 inline-block bg-blue px-5 py-3 text-[15px] text-[#fafafa] transition-colors ease-epure hover:bg-ink2"
          >
            {t.notFound.cta}
          </Link>
        </div>
      </Wrap>
    </main>
  );
}
