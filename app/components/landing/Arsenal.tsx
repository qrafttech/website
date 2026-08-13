import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionTitle from "@/components/SectionTitle";
import Diptych from "@/components/Diptych";
import StackIcon from "@/app/components/StackIcon";
import type { Dictionary } from "@/lib/i18n/types";

export default function Arsenal({
  arsenal,
}: {
  arsenal: Dictionary["arsenal"];
}) {
  return (
    <Section band="band">
      <Diptych
        side="left"
        emphasis="proof"
        text={
          <div className="nav:sticky nav:top-16">
            <SectionTitle className="max-w-[15ch]">
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
          <>
            {/* Was eight runs of « Rails · NestJS · FastAPI » set in muted grey
                — a list of forty words with nothing to look at, on the one
                screen whose whole job is to be looked at. Each item is a chip
                now, carrying its own brand mark: the colour comes from the
                marks themselves rather than from anything painted behind them,
                so the page keeps its two inks and still stops being grey.

                The interpunct separators went with the change — a chip has an
                edge, and a separator between two bordered boxes is a mark that
                repeats what the boxes already say. */}
            <dl className="grid gap-x-10 gap-y-9 nav:grid-cols-2">
              {arsenal.groups.map((group) => (
                <div key={group.key} className="border-t border-line pt-4">
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink2">
                    {group.title}
                  </dt>
                  <dd className="mt-3">
                    <ul className="flex flex-wrap gap-x-2 gap-y-2">
                      {group.items.map((item) => (
                        <li
                          key={item.label}
                          className="inline-flex items-center gap-2 border border-hair bg-chip px-2.5 py-1.5 text-[0.875rem] leading-none text-ink2"
                        >
                          {/* No placeholder square when a brand ships no
                              official single-path SVG: a grey stand-in reads as
                              an image that failed to load, where a label-only
                              chip reads as a deliberate one. See the note in
                              `arsenal.groups` for which brands these are. */}
                          {item.icon ? (
                            <StackIcon slug={item.icon} className="h-4 w-4" />
                          ) : null}
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </>
        }
      />
    </Section>
  );
}
