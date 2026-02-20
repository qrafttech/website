import FluidContainer from "../../components/FluidContainer";

export default function BlogLoading() {
  return (
    <FluidContainer>
      <div className="pt-16 pb-24">
        <div className="mx-auto h-12 w-48 animate-pulse rounded bg-zinc-200 p-6" />
        <div className="space-y-4 py-12">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-black/10 py-6"
            >
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FluidContainer>
  );
}
