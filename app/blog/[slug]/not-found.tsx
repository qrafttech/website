import Link from "next/link";

import FluidContainer from "../../../components/FluidContainer";

export default function ArticleNotFound() {
  return (
    <FluidContainer>
      <div className="flex flex-col items-center gap-4 pt-16 pb-24 text-center">
        <h2 className="font-serif text-2xl font-bold">Article introuvable</h2>
        <p className="text-zinc-500">
          Cet article n&apos;existe pas ou a ete supprime.
        </p>
        <Link
          href="/blog"
          className="inline-block rounded-2xl border border-black bg-transparent px-8 py-3 font-medium text-black hover:bg-black/10"
        >
          Retour aux articles
        </Link>
      </div>
    </FluidContainer>
  );
}
