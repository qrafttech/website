import Image from "next/image";
import Link from "next/link";

import Rich from "@/components/Rich";
import Wrap from "@/components/Wrap";
import RiseLine from "@/components/motion/RiseLine.client";
import { proof } from "@/lib/i18n/fr/landing";
import { clients } from "@/lib/i18n/fr/clients";
import { clientLogos } from "@/lib/client-logos";

export default function Proof() {
  return (
    <section id="proof" className="py-24 nav:py-[9.375rem]">
      <Wrap>
        <div className="grid gap-x-16 gap-y-12 nav:grid-cols-[1fr_1.45fr]">
          <h2 className="max-w-[13ch] text-[clamp(2rem,4.6vw,3.75rem)] font-bold leading-[1.02]">
            <RiseLine trigger="view">
              <Rich content={proof.title} />
            </RiseLine>
          </h2>

          <ul className="divide-y divide-hair border-t border-hair">
            {clients.map((client) => (
              <li key={client.slug}>
                <Link
                  href={`/realisations/${client.slug}`}
                  className="group flex items-center justify-between gap-6 py-6 transition-colors ease-epure"
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="min-w-0">
                      <span className="block font-display text-xl font-semibold leading-tight transition-colors ease-epure group-hover:text-blue nav:text-[1.625rem]">
                        {client.name}
                      </span>
                      <span className="mt-1.5 block font-mono text-xs uppercase tracking-[0.08em] text-muted">
                        {client.sector}
                      </span>
                    </span>
                    {clientLogos[client.slug] ? (
                      <Image
                        src={clientLogos[client.slug]}
                        alt=""
                        className="h-8 w-auto max-w-[6rem] shrink-0 object-contain"
                      />
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-lg text-muted transition-transform ease-epure group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}
