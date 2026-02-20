"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

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
