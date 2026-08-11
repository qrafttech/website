import Image from "next/image";

import StackIcon from "@/app/components/StackIcon";
import Wrap from "@/components/Wrap";
import Eyebrow from "@/components/Eyebrow";
import MonoLink from "@/components/MonoLink";
import CtaLink from "@/components/CtaLink";
import Rich from "@/components/Rich";
import { type Locale, localeHref } from "@/lib/i18n/config";
import type { Client, Dictionary, StackItem } from "@/lib/i18n/types";
import { CONTACT_EMAIL } from "@/lib/site";
import { clientLogos } from "@/lib/client-logos";
import { clientScreenshots } from "@/lib/client-screenshots";

const H1 =
  "font-display text-[clamp(2.125rem,4.8vw,4rem)] font-bold leading-[1.02]";
const H2 = "font-display text-[1.375rem] font-bold";
const BODY = "text-[1.0625rem] leading-[1.65] text-ink2";

function StackRow({ item }: { item: StackItem }) {
  return (
    <li className="flex items-center gap-3.5 border border-hair bg-chip px-4 py-3">
      <StackIcon slug={item.icon} />
      <span className="font-mono text-sm">{item.label}</span>
    </li>
  );
}

function ClientHero({ client }: { client: Client }) {
  return (
    <section className="border-b border-line bg-sand">
      <Wrap>
        <div
          className={
            client.anonymous
              ? "py-16 nav:py-24"
              : "grid gap-10 py-16 nav:grid-cols-[1fr_16rem] nav:items-center nav:py-24"
          }
        >
          <div>
            <h1 className={client.anonymous ? `max-w-[18ch] ${H1}` : H1}>
              {client.name}
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg leading-[1.55] text-muted">
              {client.lede}
            </p>
            {client.ndaMention ? (
              <Eyebrow className="mt-8">{client.ndaMention}</Eyebrow>
            ) : null}
            {client.website ? (
              <div className="mt-8">
                <MonoLink
                  href={`https://${client.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline decoration-blue decoration-2 underline-offset-4"
                >
                  {client.website} ↗
                </MonoLink>
              </div>
            ) : null}
          </div>
          {client.anonymous ? null : (
            <div className="flex aspect-[4/3] items-center justify-center border border-line bg-canvas p-8">
              {clientLogos[client.slug] ? (
                <Image
                  src={clientLogos[client.slug]}
                  alt={client.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-center font-display text-2xl font-bold leading-tight">
                  {client.name}
                </span>
              )}
            </div>
          )}
        </div>
      </Wrap>
    </section>
  );
}

function ClientScreenshots({
  client,
  altTemplate,
}: {
  client: Client;
  altTemplate: string;
}) {
  const images = clientScreenshots[client.slug];
  if (!images || images.length === 0) return null;

  const alt = altTemplate.replace("%s", client.name);

  return (
    <section className="border-b border-line bg-canvas">
      <Wrap className="py-12 nav:py-16">
        <div
          className={
            images.length === 1
              ? ""
              : `grid gap-4 ${
                  images.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
                }`
          }
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[16/10] overflow-hidden border border-line"
            >
              <Image
                src={image}
                alt={alt}
                fill
                placeholder="blur"
                sizes={
                  images.length === 1
                    ? "100vw"
                    : `(min-width: 1024px) ${Math.round(
                        100 / images.length
                      )}vw, 100vw`
                }
                className="object-cover object-top"
              />
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

function ClientAside({
  client,
  caseUi,
}: {
  client: Client;
  caseUi: Dictionary["caseUi"];
}) {
  return (
    <aside className="space-y-10 self-start nav:sticky nav:top-24 nav:order-2">
      {client.stack ? (
        <div>
          <Eyebrow as="h2">{caseUi.stack}</Eyebrow>
          <ul className="mt-4 space-y-1.5">
            {client.stack.map((item) => (
              <StackRow key={item.label} item={item} />
            ))}
          </ul>
        </div>
      ) : null}
      {client.integrations ? (
        <div>
          <Eyebrow as="h2">{caseUi.integrations}</Eyebrow>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {client.integrations.map((name) => (
              <li
                key={name}
                className="border border-hair bg-chip px-4 py-2.5 font-mono text-sm"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

export default function ClientCase({
  lang,
  client,
  caseUi,
}: {
  lang: Locale;
  client: Client;
  caseUi: Dictionary["caseUi"];
}) {
  const hasAside = Boolean(client.stack || client.integrations);

  return (
    <main>
      <ClientHero client={client} />
      <ClientScreenshots client={client} altTemplate={caseUi.screenshotAlt} />

      <section className="py-16 nav:py-24">
        <Wrap>
          <MonoLink href={localeHref(lang, "/#proof")} className="text-muted">
            &larr; {caseUi.backToClients}
          </MonoLink>

          <div
            className={
              hasAside
                ? "mt-10 grid gap-14 nav:grid-cols-[1fr_20rem] nav:gap-20"
                : "mt-10"
            }
          >
            <article className="max-w-[64ch] nav:order-1">
              <h2 className={H2}>{caseUi.project}</h2>
              <p className={`mt-4 ${BODY}`}>{client.project}</p>

              {client.points ? (
                <>
                  <h2 className={`mt-12 ${H2}`}>{client.points.title}</h2>
                  <ul className="mt-4 space-y-2.5 text-[1.0625rem] leading-[1.55] text-ink2">
                    {client.points.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="font-mono text-blue">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <h2 className={`mt-12 ${H2}`}>{caseUi.role}</h2>
              <p className={`mt-4 ${BODY}`}>
                <Rich
                  content={client.role}
                  strongClassName="font-medium text-blue"
                />
              </p>
            </article>

            {hasAside ? <ClientAside client={client} caseUi={caseUi} /> : null}
          </div>
        </Wrap>
      </section>

      <section className="border-t border-line bg-band">
        <Wrap className="flex flex-col gap-6 py-16 nav:flex-row nav:items-center nav:justify-between nav:py-20">
          <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.06]">
            {caseUi.ctaTitle}
          </h2>
          <CtaLink
            href={`mailto:${CONTACT_EMAIL}`}
            tone="ink"
            className="self-start font-medium nav:self-auto"
          >
            {caseUi.ctaLabel}
          </CtaLink>
        </Wrap>
      </section>
    </main>
  );
}
