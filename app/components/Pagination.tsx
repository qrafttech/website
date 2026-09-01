import Link from "next/link";
import clsx from "clsx";

import { type Locale, localePath } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  lang: Locale;
  copy: Dictionary["blog"]["pagination"];
}

type PageItem = number | "ellipsis";

function getPageNumbers(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: PageItem[] = [1];

  if (currentPage <= 3) {
    pages.push(2, 3, 4, "ellipsis", totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    );
  } else {
    pages.push(
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages
    );
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  lang,
  copy,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const index = localePath(lang, "/blog");
  const pageHref = (page: number) =>
    page === 1 ? index : `${index}?page=${page}`;

  return (
    <nav
      aria-label={copy.label}
      className="flex items-center justify-center gap-2 pt-12"
    >
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="border border-line px-5 py-2 text-sm text-ink transition-colors ease-epure hover:bg-tint"
        >
          {copy.previous}
        </Link>
      ) : (
        <span className="border border-hair px-5 py-2 text-sm text-muted/40">
          {copy.previous}
        </span>
      )}

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="grid h-10 w-10 place-items-center text-sm text-muted"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={clsx(
              "grid h-10 w-10 place-items-center border text-sm transition-colors ease-epure",
              page === currentPage
                ? "border-ink2 bg-ink2 text-canvas"
                : "border-line text-ink hover:bg-tint"
            )}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="border border-line px-5 py-2 text-sm text-ink transition-colors ease-epure hover:bg-tint"
        >
          {copy.next}
        </Link>
      ) : (
        <span className="border border-hair px-5 py-2 text-sm text-muted/40">
          {copy.next}
        </span>
      )}
    </nav>
  );
}
