"use client";

import FluidContainer from "../../components/FluidContainer";

export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <FluidContainer>
      <div className="flex flex-col items-center gap-4 pt-16 pb-24 text-center">
        <h2 className="font-serif text-2xl font-bold">
          Une erreur est survenue
        </h2>
        <p className="text-zinc-500">
          Impossible de charger les articles. Veuillez reessayer.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-2xl border border-black bg-transparent px-8 py-3 font-medium text-black hover:bg-black/10"
        >
          Reessayer
        </button>
      </div>
    </FluidContainer>
  );
}
