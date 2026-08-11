import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionTitle, { MARGINAL } from "@/components/SectionTitle";
import Diptych from "@/components/Diptych";
import Reveal from "@/components/motion/Reveal.client";
import { arsenal } from "@/lib/i18n/fr/landing";

export default function Arsenal() {
  return (
    <Section band="band">
      <Diptych
        side="left"
        emphasis="proof"
        text={
          <div className="nav:sticky nav:top-16">
            <SectionTitle size={MARGINAL} className="max-w-[15ch]">
              <Rich content={arsenal.title} />
            </SectionTitle>
            <p className="mt-6 max-w-[38ch] font-display text-[1.1875rem] font-semibold leading-[1.35]">
              {arsenal.subtitle}
            </p>
            <p className="mt-4 max-w-[44ch] text-[0.9375rem] leading-[1.7] text-muted">
              {arsenal.note}
            </p>
          </div>
        }
        proof={
          <Reveal>
            <dl className="grid gap-x-10 gap-y-8 nav:grid-cols-2">
              {arsenal.groups.map((group) => (
                <div key={group.key} className="border-t border-line pt-4">
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink2">
                    {group.title}
                  </dt>
                  <dd className="mt-2.5 text-[0.9375rem] leading-[1.75] text-muted">
                    {group.items.join(" · ")}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        }
      />
    </Section>
  );
}
