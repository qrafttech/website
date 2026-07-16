import Rich from "@/components/Rich";
import RiseLine from "@/components/motion/RiseLine.client";
import { offres } from "@/lib/i18n/fr/landing";

export default function Offres() {
  const { title, subtitle, tiles } = offres;

  return (
    <section id="offres" className="border-b border-line bg-canvas">
      <div className="px-[clamp(1.5rem,3.6vw,3.75rem)] py-[clamp(3rem,9vh,6rem)]">
        <h2 className="max-w-[16ch] text-[clamp(1.875rem,3.8vw,3.625rem)] font-bold leading-[1.03]">
          <RiseLine trigger="view" duration={1}>
            <Rich content={title} />
          </RiseLine>
        </h2>
        <p className="mt-5 max-w-[52ch] text-[clamp(0.9375rem,1.3vw,1.1875rem)] leading-[1.55] text-muted">
          {subtitle}
        </p>

        <ul className="mt-[clamp(2.25rem,6vh,3.5rem)] border-t border-line">
          {tiles.map((tile) => (
            <li
              key={tile.title}
              className="grid gap-x-14 gap-y-2 border-b border-line py-[1.875rem] nav:grid-cols-[minmax(0,16.25rem)_minmax(0,1fr)]"
            >
              <h3 className="text-[1.3125rem] font-bold leading-[1.15]">
                {tile.title}
              </h3>
              <p className="max-w-[52ch] text-[0.9375rem] leading-[1.55] text-muted">
                {tile.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
