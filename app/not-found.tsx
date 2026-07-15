import Wrap from "@/components/Wrap";
import Eyebrow from "@/components/Eyebrow";
import CtaLink from "@/components/CtaLink";
import { notFound } from "@/lib/i18n/fr/blog";

export default function NotFound() {
  return (
    <main>
      <Wrap>
        <div className="flex flex-col items-center py-32 text-center md:py-40">
          <Eyebrow>{notFound.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-[clamp(40px,6vw,80px)] font-bold leading-[1.02] text-ink">
            {notFound.title}
          </h1>
          <p className="mt-5 max-w-[42ch] text-muted">{notFound.body}</p>
          <CtaLink href="/" className="mt-8">
            {notFound.cta}
          </CtaLink>
        </div>
      </Wrap>
    </main>
  );
}
