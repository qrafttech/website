"use client";

import clsx from "clsx";
import { m, useReducedMotion } from "motion/react";

import Reveal from "@/components/motion/Reveal.client";
import Wrap from "@/components/Wrap";
import { getDictionary } from "@/lib/i18n";
import { EASE, VIEWPORT_ONCE } from "@/lib/motion";

export default function Ways() {
  const t = getDictionary();
  const reduce = useReducedMotion();

  return (
    <section className="bg-panel py-[150px] text-ink">
      <Wrap>
        <div className="grid grid-cols-3 border-t border-line max-[900px]:grid-cols-1">
          {t.ways.columns.map((column, index) => (
            <Reveal
              key={column.title}
              className={clsx(
                "border-r border-line pb-2 pl-0 pr-8 pt-8",
                index > 0 && "pl-8",
                index === t.ways.columns.length - 1 && "border-r-0",
                "max-[900px]:border-b max-[900px]:border-r-0 max-[900px]:border-line max-[900px]:px-0 max-[900px]:py-7 max-[900px]:pl-0"
              )}
            >
              <m.div
                className="mb-5 h-[5px] bg-blue"
                initial={{ width: reduce ? 34 : 0 }}
                whileInView={{ width: 34 }}
                viewport={VIEWPORT_ONCE}
                transition={{
                  duration: reduce ? 0 : 0.9,
                  ease: EASE,
                  delay: reduce ? 0 : 0.2,
                }}
              />
              <h3 className="text-[21px] font-semibold">{column.title}</h3>
              <p className="mt-2.5 text-[15px] text-muted">{column.body}</p>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
