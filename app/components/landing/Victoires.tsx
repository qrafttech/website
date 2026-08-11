import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import clsx from "clsx";

import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionTitle, { MARGINAL } from "@/components/SectionTitle";

import Reveal from "@/components/motion/Reveal.client";
import { clientLogos } from "@/lib/client-logos";
import { getClient } from "@/lib/i18n/dictionaries";
import { type Locale, localePath } from "@/lib/i18n/config";
import type { Client, Dictionary } from "@/lib/i18n/types";

/**
 * `victoires.cases` carries the narrative (what was built, why it mattered);
 * the falsifiable part — stack and integrations — lives in `clients.ts`, keyed
 * by the same slug. Join them here: the labels must never render without their
 * data, so a case that cannot be resolved is dropped rather than shown bare.
 */
function buildCases(
  victoires: Dictionary["victoires"],
  clients: readonly Client[]
) {
  return victoires.cases.flatMap((entry) => {
    const client = getClient(clients, entry.slug);
    if (!client) return [];

    return [
      {
        ...entry,
        name: client.name,
        sector: client.sector,
        stack: client.stack?.map((item) => item.label) ?? [],
        integrations: client.integrations ?? [],
        // The durability claim is only checkable if the reader can go and touch
        // the thing. Absent for the NDA case, which has no public address.
        website: client.website,
        logo: clientLogos[entry.slug],
        // The santé case has no mark and never will. `ndaMention` is the
        // existing, client-approved sentence for saying so.
        nda: client.anonymous ? client.ndaMention : undefined,
      },
    ];
  });
}

/**
 * The identifying mark for one case, opening the metadata block underneath the
 * prose. design.md:116-126 permits a client logo as a proof tier and still
 * forbids logo walls, so the mark is deliberately placed where it can never be
 * read on its own: after the sentences, in the same block as `Stack :` and at
 * the height of one of those lines. Greyscale, because seven brand palettes
 * would overrun a page whose only colour is a ≤5% blue rule.
 *
 * The mark is NOT decorative, so it takes the client's name as its `alt`. An
 * empty `alt` would be right if it sat against the case's `h3` as pure
 * duplication, but it does not: two paragraphs of prose separate them, and
 * what the mark actually does here is tell you which case the `Stack :` and
 * `Intégrations :` lines under it belong to. Hidden, those lines arrive
 * unowned.
 */
function Mark({
  logo,
  nda,
  name,
}: {
  logo?: StaticImageData;
  nda?: string;
  name: string;
}) {
  if (logo) {
    // Optical sizing, not measured sizing. A wordmark set to the height of a
    // `Stack :` line reads as one; a near-square mark set to the same height
    // reads as a speck, because it has a tenth of the area. Compact marks get
    // the taller cap so every case's mark carries the same visual weight.
    const compact = logo.width / logo.height < 1.6;

    return (
      <Image
        src={logo}
        alt={name}
        className={clsx(
          "mb-1 w-auto max-w-[11rem] object-contain object-left opacity-75 grayscale",
          compact ? "h-[1.875rem]" : "h-[1.375rem]"
        )}
      />
    );
  }

  // A case with no mark keeps the slot and says why, at the same height, so
  // the absence reads as a fact about the engagement rather than a gap.
  if (nda) {
    return (
      <p className="mb-1 font-mono text-[0.75rem] leading-[1.8] text-muted">
        {nda}
      </p>
    );
  }

  return null;
}

function Meta({ label, items }: { label: string; items: readonly string[] }) {
  if (items.length === 0) return null;

  return (
    <p className="font-mono text-[0.75rem] leading-[1.8] text-muted">
      <span className="text-ink2">{label}</span> {items.join(" · ")}
    </p>
  );
}

export default function Victoires({
  lang,
  victoires,
  clients,
}: {
  lang: Locale;
  victoires: Dictionary["victoires"];
  clients: readonly Client[];
}) {
  const cases = buildCases(victoires, clients);

  return (
    <Section id={victoires.id} band="sand">
      <SectionTitle size={MARGINAL} className="max-w-[15ch]">
        <Rich content={victoires.title} />
      </SectionTitle>
      <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-muted">
        {victoires.lead}
      </p>

      {/* Paired rather than stacked: four cases in one tall column left the
          half beside them blank for most of the section. Two columns halve the
          height — and the dividers that used to close each row are gone with
          them, because rows of metadata over hairlines are the visual grammar
          of a statement of account, which is the one thing this page cannot
          read as. One rule opens the list; the case names carry the rest. */}
      <Reveal>
        <ul className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-6 border-t border-line nav:grid-cols-2">
          {cases.map((entry) => (
            <li key={entry.slug} className="py-7">
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="font-display text-[1.5rem] font-semibold leading-tight">
                  <Link
                    href={localePath(lang, `/realisations/${entry.slug}`)}
                    className="group transition-colors ease-epure hover:text-blue"
                  >
                    {entry.name}
                    <span
                      aria-hidden="true"
                      className="ml-3 inline-block font-mono text-lg text-muted transition-transform ease-epure group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </h3>
                {/* design.md:81-82 — `→` internal, `↗` external. */}
                {entry.website ? (
                  <a
                    href={`https://${entry.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 font-mono text-xs tracking-[0.04em] text-muted transition-colors ease-epure hover:text-blue"
                  >
                    {entry.website} ↗
                  </a>
                ) : null}
              </div>
              <p className="mt-1.5 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                {entry.sector}
              </p>
              <p className="mt-4 max-w-[62ch] text-[1rem] leading-[1.6] text-ink2">
                {entry.what}
              </p>
              <p className="mt-2.5 max-w-[62ch] text-[0.9375rem] leading-[1.7] text-muted">
                {entry.note}
              </p>
              {/* Space, not a rule. The mark is a greyscale image and the two
                  lines under it are mono at 12px against Inter prose — the
                  register change already says the block has turned from
                  argument into record. */}
              <div className="mt-7 flex flex-col items-start gap-1">
                <Mark logo={entry.logo} nda={entry.nda} name={entry.name} />
                <Meta label={victoires.stackLabel} items={entry.stack} />
                <Meta
                  label={victoires.integrationsLabel}
                  items={entry.integrations}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-7 max-w-[62ch] text-[0.9375rem] leading-[1.7] text-muted">
          {victoires.others}
        </p>
      </Reveal>
    </Section>
  );
}
