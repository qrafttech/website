import Link from "next/link";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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

      {pages.map((page) => (
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
      ))}

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
