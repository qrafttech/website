import Ledger from "@/components/Ledger";
import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionLead from "@/components/SectionLead";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/motion/Reveal.client";
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

      {/* The old site set « Nos plus-values » over these four and the slot has
          been empty since the rebuild. It is one of only two double meanings
          this house coined for itself, so it returns in the label register —
          subordinate to the section title, the way it originally sat. */}
      <Reveal>
        <h3 className="mt-[clamp(2.5rem,6vh,4rem)] font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
          {valeurs.valuesLabel}
        </h3>
        {/* The rule under the label opens the list. */}
        <Ledger blocks={valeurs.values} className="mt-6 border-rule" />
      </Reveal>
    </Section>
  );
}
