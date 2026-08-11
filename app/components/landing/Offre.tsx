import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionTitle, { MARGINAL } from "@/components/SectionTitle";
import Reveal from "@/components/motion/Reveal.client";
import type { Dictionary } from "@/lib/i18n/types";

/**
 * Header over a full-measure pair of columns, not a diptych.
 *
 * A diptych whose text half holds only a heading is not a diptych — it is one
 * column with a hole beside it, and this section set the page's temperature
 * because it is the first thing after the hero. Running the ledger across the
 * full measure in two columns keeps each block at the same line length it had
 * in the old single column, so nothing gets harder to read, while halving the
 * section's height and removing the void.
 *
 * `offre` and `constat` deliberately share the sand band — the rise to the
 * origin pivot needs two steps — so the boundary between them is carried by a
 * hairline instead of a band change.
 */
export default function Offre({ offre }: { offre: Dictionary["offre"] }) {
  return (
    <Section id={offre.id} band="sand" rule="bottom">
      <SectionTitle size={MARGINAL} className="max-w-[16ch]">
        <Rich content={offre.title} />
      </SectionTitle>
      <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-muted">
        {offre.lead}
      </p>

      <Reveal>
        <dl className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-x-[clamp(2rem,4vw,4rem)] border-t border-line nav:grid-cols-2">
          {offre.blocks.map((block) => (
            <div key={block.key} className="border-b border-line py-7">
              <dt className="font-display text-[1.3125rem] font-bold leading-[1.2]">
                {block.title}
              </dt>
              <dd className="mt-2.5 max-w-[58ch] text-[0.9375rem] leading-[1.7] text-muted">
                {block.body}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
