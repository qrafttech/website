import Link from "next/link";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({
  totalPages,
  currentPage,
}: PaginationProps) {
  const createPageURL = (pageNumber: number) => `/blog?page=${pageNumber}`;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {currentPage <= 1 ? (
        <span className="rounded-md px-3 py-2 text-sm text-zinc-300">
          Precedent
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage - 1)}
          className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
        >
          Precedent
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
        page === currentPage ? (
          <span
            key={page}
            className="rounded-md bg-black px-3 py-2 text-sm text-white"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={createPageURL(page)}
            className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            {page}
          </Link>
        )
      )}

      {currentPage >= totalPages ? (
        <span className="rounded-md px-3 py-2 text-sm text-zinc-300">
          Suivant
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage + 1)}
          className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
        >
          Suivant
        </Link>
      )}
    </div>
  );
}
