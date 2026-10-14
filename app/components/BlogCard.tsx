import Link from "next/link";
import clsx from "clsx";

import Eyebrow from "@/components/Eyebrow";
import type { ArticleMeta } from "@/lib/blog";
import type { Dictionary } from "@/lib/i18n/types";

interface BlogCardProps {
  article: ArticleMeta;
  /** Locale-prefixed by the caller — the card does not know its locale. */
  href: string;
  status: Dictionary["blog"]["status"];
}

/**
 * One ledger row: the date in the margin, the title and its lede in the body,
 * the cover beside them when the article has one. Below `nav` the row stacks,
 * cover first. The cover is letterboxed, not cropped: covers come in every ratio.
 */
export default function BlogCard({ article, href, status }: BlogCardProps) {
  const { title, date, dateISO, author, excerpt, cover } = article;
  const statusLabel =
    article.status === "published" ? null : status[article.status];
  return (
    <Link
      href={href}
      className={clsx(
        "group grid gap-x-[clamp(1.5rem,3.2vw,3.25rem)] gap-y-2 border-b border-hair py-8 transition-colors ease-epure hover:border-line",
        cover
          ? "nav:grid-cols-[9rem_1fr_13rem_auto]"
          : "nav:grid-cols-[9rem_1fr_auto]"
      )}
    >
      <Eyebrow className="nav:pt-1.5">
        {statusLabel && (
          <>
            {statusLabel}
            {date && <span className="mx-1.5">&middot;</span>}
          </>
        )}
        {dateISO ? <time dateTime={dateISO}>{date}</time> : date}
      </Eyebrow>
      <div className="min-w-0">
        <h2 className="font-display text-lg font-semibold leading-[1.3] text-ink transition-colors ease-epure group-hover:text-blue md:text-[1.3125rem]">
          {title}
        </h2>
        {excerpt && (
          <p className="mt-2.5 max-w-[68ch] overflow-hidden text-[0.9375rem] leading-[1.7] text-muted [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box]">
            {excerpt}
          </p>
        )}
        {author && <Eyebrow className="mt-3">{author}</Eyebrow>}
      </div>
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="order-first mb-4 aspect-[3/2] w-full bg-tint object-contain nav:order-none nav:mb-0"
        />
      )}
      <span
        aria-hidden="true"
        className="hidden text-muted transition-transform ease-epure group-hover:translate-x-1 group-hover:text-blue nav:block nav:pt-1"
      >
        &rarr;
      </span>
    </Link>
  );
}
