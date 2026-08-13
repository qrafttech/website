import Ledger from "@/components/Ledger";
import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionLead from "@/components/SectionLead";
import SectionTitle from "@/components/SectionTitle";
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
      {/* Two beats, one measure: the argument, then the offer. The second
          paragraph sits closer than a fresh lead would, so the pair still reads
          as one block under the heading. */}
      {offre.lead.map((paragraph, index) => (
        <SectionLead key={index} className={index > 0 ? "mt-5" : undefined}>
          {paragraph}
        </SectionLead>
      ))}

      <Ledger
        blocks={offre.blocks}
        className="mt-[clamp(2.5rem,6vh,4rem)] border-line"
      />
    </Section>
  );
}
