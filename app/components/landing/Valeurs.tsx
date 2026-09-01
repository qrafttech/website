import Ledger from "@/components/Ledger";
import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionLead from "@/components/SectionLead";
import SectionTitle from "@/components/SectionTitle";
import type { Dictionary } from "@/lib/i18n/types";

/** Header over a full-measure pair of columns — see `Offre.tsx`. */
export default function Valeurs({
  valeurs,
}: {
  valeurs: Dictionary["valeurs"];
}) {
  return (
    <Section band="band">
      <SectionTitle className="max-w-[20ch]">
        <Rich content={valeurs.title} />
      </SectionTitle>
      <SectionLead>{valeurs.lead}</SectionLead>

      {/* « Nos plus-values » sat here as a mono label over the four blocks and
          is cut at the client's instruction: the section title already says
          what the list is, and a label that only announces the list underneath
          it is a caption for something nobody was going to misread. The rule
          that opened the list stays — it is what separates the argument from
          the four blocks, and it does that job without a word. */}
      <Ledger
        blocks={valeurs.values}
        className="mt-[clamp(2.5rem,6vh,4rem)] border-rule"
      />
    </Section>
  );
}
