import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionTitle, { MARGINAL } from "@/components/SectionTitle";
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
      <SectionTitle size={MARGINAL} className="max-w-[20ch]">
        <Rich content={valeurs.title} />
      </SectionTitle>
      <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-muted">
        {valeurs.lead}
      </p>

      {/* The old site set « Nos plus-values » over these four and the slot has
          been empty since the rebuild. It is one of only two double meanings
          this house coined for itself, so it returns in the label register —
          subordinate to the section title, the way it originally sat. */}
      <Reveal>
        <h3 className="mt-[clamp(2.5rem,6vh,4rem)] font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
          {valeurs.valuesLabel}
        </h3>
        <dl className="mt-6 grid gap-x-[clamp(2rem,4vw,4rem)] border-t border-rule nav:grid-cols-2">
          {valeurs.values.map((value) => (
            <div key={value.key} className="border-b border-rule py-7">
              <dt className="font-display text-[1.3125rem] font-bold leading-[1.2]">
                {value.title}
              </dt>
              <dd className="mt-2.5 max-w-[58ch] text-[0.9375rem] leading-[1.7] text-muted">
                {value.body}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
