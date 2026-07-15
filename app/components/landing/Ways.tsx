import clsx from "clsx";

import GrowBar from "@/components/motion/GrowBar.client";
import Reveal from "@/components/motion/Reveal.client";
import Wrap from "@/components/Wrap";
import { ways } from "@/lib/i18n/fr/landing";

export default function Ways() {
  return (
    <section className="bg-panel py-24 text-ink nav:py-[9.375rem]">
      <Wrap>
        <div className="grid grid-cols-3 border-t border-line max-nav:grid-cols-1">
          {ways.columns.map((column, index) => (
            <Reveal
              key={column.title}
              className={clsx(
                "border-r border-line pb-2 pr-8 pt-8",
                index > 0 && "pl-8",
                index === ways.columns.length - 1 && "border-r-0",
                "max-nav:border-b max-nav:border-r-0 max-nav:border-line max-nav:px-0 max-nav:py-7"
              )}
            >
              <GrowBar className="mb-5 h-[0.3125rem] bg-blue" />
              <h3 className="text-[1.3125rem] font-semibold">{column.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] text-muted">
                {column.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
