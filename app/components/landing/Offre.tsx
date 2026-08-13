import Ledger from "@/components/Ledger";
import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionLead from "@/components/SectionLead";
import SectionTitle from "@/components/SectionTitle";
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
 * The rule that opens the ledger is doing work nothing else does — it is the
 * line between the argument and the list of what we sell.
 */
export default function Offre({ offre }: { offre: Dictionary["offre"] }) {
  return (
    <Section id={offre.id} band="sand">
      <SectionTitle className="max-w-[16ch]">
        <Rich content={offre.title} />
      </SectionTitle>
      <SectionLead>{offre.lead}</SectionLead>

      <Reveal>
        <Ledger
          blocks={offre.blocks}
          className="mt-[clamp(2.5rem,6vh,4rem)] border-line"
        />
      </Reveal>
    </Section>
  );
}
