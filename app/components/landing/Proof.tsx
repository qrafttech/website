import Link from "next/link";

import Rich from "@/components/Rich";
import Wrap from "@/components/Wrap";
import Reveal from "@/components/motion/Reveal.client";
import RiseLine from "@/components/motion/RiseLine.client";
import { proof } from "@/lib/i18n/fr/landing";
import { clients } from "@/lib/i18n/fr/clients";

export default function Proof() {
  return (
    <section
      id="proof"
      className="border-t border-hair py-24 nav:py-[9.375rem]"
    >
      <Wrap>
        <h2 className="text-[clamp(2rem,5.4vw,4.25rem)] font-bold leading-[1.02]">
          <RiseLine trigger="view">
            <Rich content={proof.title} />
          </RiseLine>
        </h2>

        <Reveal className="mt-12 nav:mt-[4.5rem]">
          <ul className="divide-y divide-hair">
            {clients.map((client) => (
              <li key={client.slug}>
                <Link
                  href={`/realisations/${client.slug}`}
                  className="group flex items-center justify-between gap-6 py-6 transition-colors ease-epure"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-semibold leading-tight transition-colors ease-epure group-hover:text-blue nav:text-[1.75rem]">
                      {client.name}
                    </span>
                    <span className="mt-1.5 block font-mono text-xs uppercase tracking-[0.08em] text-muted">
                      {client.sector}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-lg text-muted transition-all ease-epure group-hover:translate-x-1 group-hover:text-blue"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Wrap>
    </section>
  );
}
