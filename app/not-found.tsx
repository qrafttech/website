import Wrap from "@/components/Wrap";
import Eyebrow from "@/components/Eyebrow";
import CtaLink from "@/components/CtaLink";
import { notFound } from "@/lib/i18n/fr/blog";

export default function NotFound() {
  return (
    <main>
      <Wrap>
        <div className="grid gap-x-16 gap-y-10 py-32 md:py-44 nav:grid-cols-[1.45fr_1fr] nav:items-end">
          <div>
            <Eyebrow>{notFound.eyebrow}</Eyebrow>
            <h1 className="mt-5 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.02] text-ink">
              {notFound.title}
            </h1>
          </div>
          <div className="flex flex-col items-start gap-7 nav:pb-2">
            <p className="max-w-[42ch] text-muted">{notFound.body}</p>
            <CtaLink href="/">{notFound.cta}</CtaLink>
          </div>
        </div>
      </Wrap>
    </main>
  );
}
