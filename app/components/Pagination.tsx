import Link from "next/link";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
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
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-12"
    >
      {currentPage > 1 ? (
        <Link
          href={currentPage === 2 ? "/blog" : `/blog?page=${currentPage - 1}`}
          className="rounded-2xl border border-black bg-transparent px-5 py-2 text-sm font-medium text-black hover:bg-black/10"
        >
          Précédent
        </Link>
      ) : (
        <span className="rounded-2xl border border-black/20 px-5 py-2 text-sm font-medium text-black/30">
          Précédent
        </span>
      )}

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="grid h-10 w-10 place-items-center text-sm text-zinc-400"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={page === 1 ? "/blog" : `/blog?page=${page}`}
            className={clsx(
              "grid h-10 w-10 place-items-center rounded-2xl border text-sm font-medium",
              page === currentPage
                ? "border-black bg-black text-white"
                : "border-black bg-transparent text-black hover:bg-black/10"
            )}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className="rounded-2xl border border-black bg-transparent px-5 py-2 text-sm font-medium text-black hover:bg-black/10"
        >
          Suivant
        </Link>
      ) : (
        <span className="rounded-2xl border border-black/20 px-5 py-2 text-sm font-medium text-black/30">
          Suivant
        </span>
      )}
    </nav>
  );
}
