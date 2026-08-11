import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import {
  CheckIcon,
  ClockIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import PageHero from "@/app/components/PageHero";
import JsonLd from "@/app/components/JsonLd";
import CoworkGallery from "@/app/components/CoworkGallery.client";
import Wrap from "@/components/Wrap";
import Rich from "@/components/Rich";
import Eyebrow from "@/components/Eyebrow";
import CtaLink from "@/components/CtaLink";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeAlternates } from "@/lib/i18n/metadata";
import type {
  CoworkAmenityKey,
  CoworkGalleryKey,
  CoworkTileKey,
  Dictionary,
} from "@/lib/i18n/types";
import { SITE_URL } from "@/lib/site";

import coworkOpenSpace from "@/public/images/cowork_open_space.jpg";
import coworkOpenSpace2 from "@/public/images/cowork_open_space2.jpg";
import coworkMeeting from "@/public/images/cowork_meeting.jpg";
import coworkMeeting2 from "@/public/images/cowork_meeting2.jpg";
import coworkCallbox2 from "@/public/images/cowork_callbox2.jpg";
import coworkKitchen from "@/public/images/cowork_kitchen.jpg";
import coworkBabyfoot from "@/public/images/cowork_babyfoot.jpg";
import coworkBalcon from "@/public/images/cowork_balcon.jpg";
import coworkBureauDebout from "@/public/images/cowork_bureau_debout.jpg";
import coworkLunch2 from "@/public/images/cowork_lunch2.jpg";

type Cowork = Dictionary["cowork"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const t = (await getDictionary(lang)).cowork;

  return {
    title: t.metaTitle,
    description: t.description,
    alternates: localeAlternates(lang, "/cowork"),
  };
}

function mapsEmbedUrl(location: Cowork["location"]): string {
  const query = `${location.street}, ${location.postalCode} ${location.city}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(
    query
  )}&output=embed`;
}

function CoffeeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.25h13.5v6a4.5 4.5 0 0 1-4.5 4.5H7.5a4.5 4.5 0 0 1-4.5-4.5v-6Zm13.5 1.5h1.5a3 3 0 0 1 0 6h-1.5M6 3v1.5M9.75 3v1.5" />
    </svg>
  );
}

type Tile = Cowork["spaces"]["tiles"][number];

const TILE_IMAGES: Record<CoworkTileKey, StaticImageData> = {
  openSpace: coworkOpenSpace,
  kitchen: coworkKitchen,
  meeting: coworkMeeting,
  callbox: coworkCallbox2,
};

const TILE_OBJECT_POSITION: Record<CoworkTileKey, string> = {
  openSpace: "center 50%",
  kitchen: "center 62%",
  meeting: "center 62%",
  callbox: "center 62%",
};

const TILE_ICON: Record<CoworkTileKey, ReactNode> = {
  openSpace: <ComputerDesktopIcon className="h-5 w-5" />,
  kitchen: <CoffeeIcon className="h-5 w-5" />,
  meeting: <UsersIcon className="h-5 w-5" />,
  callbox: <PhoneIcon className="h-5 w-5" />,
};

const AMENITY_ICON: Record<CoworkAmenityKey, ReactNode> = {
  access: <ClockIcon className="h-6 w-6" />,
  coffee: <CoffeeIcon className="h-6 w-6" />,
  desks: <ComputerDesktopIcon className="h-6 w-6" />,
  techMeeting: <UsersIcon className="h-6 w-6" />,
};

const GALLERY_IMAGES: Record<CoworkGalleryKey, StaticImageData> = {
  meeting2: coworkMeeting2,
  babyfoot: coworkBabyfoot,
  balcon: coworkBalcon,
  openSpace2: coworkOpenSpace2,
  bureauDebout: coworkBureauDebout,
  lunch2: coworkLunch2,
};

function SectionHead({ title }: { title: string }) {
  return <h2 className="mb-10 max-w-[24ch] text-section font-bold">{title}</h2>;
}

function PhotoTile({ tile }: { tile: Tile }) {
  return (
    <div className="relative min-h-[18.75rem] overflow-hidden border border-hair md:row-span-2">
      <Image
        src={TILE_IMAGES[tile.key]}
        alt={tile.alt}
        fill
        placeholder="blur"
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
        style={{ objectPosition: TILE_OBJECT_POSITION[tile.key] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="bg-white/15 mb-2 inline-flex p-2 text-white backdrop-blur">
          {TILE_ICON[tile.key]}
        </div>
        <h3 className="font-display text-xl font-bold text-white">
          {tile.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-white/90">
          {tile.body}
        </p>
      </div>
    </div>
  );
}

export default async function CoworkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = (await getDictionary(lang)).cowork;

  const galleryPhotos = t.gallery.photos.map((photo) => ({
    src: GALLERY_IMAGES[photo.key],
    alt: photo.alt,
  }));

  return (
    <main className="bg-canvas">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: t.title,
          description: t.description,
          url: `${SITE_URL}${localePath(lang, "/cowork")}`,
          image: `${SITE_URL}/images/cowork_open_space.jpg`,
          priceRange: `${t.pricing.price} ${t.pricing.period}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: t.location.street,
            postalCode: t.location.postalCode,
            addressLocality: t.location.city,
            addressCountry: "FR",
          },
          makesOffer: {
            "@type": "Offer",
            name: t.pricing.offerName,
            price: t.pricing.priceAmount,
            priceCurrency: "EUR",
            description: t.pricing.offerDescription,
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
          },
        }}
      />

      <PageHero title={t.title} subtitle={t.subtitle} />

      <Wrap>
        <div className="py-16">
          <div className="flex flex-col divide-y divide-hair border border-hair bg-canvas md:flex-row md:divide-x md:divide-y-0">
            {t.stats.map((stat) => (
              <div key={stat.label} className="flex-1 px-6 py-6 text-center">
                <p className="font-display text-4xl font-bold text-ink2 lg:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Wrap>

      <Wrap>
        <div className="py-16">
          <SectionHead title={t.spaces.title} />
          <div className="grid grid-cols-1 gap-4 md:auto-rows-[13.75rem] md:grid-cols-2">
            {t.spaces.tiles.map((tile) => (
              <PhotoTile key={tile.key} tile={tile} />
            ))}
          </div>
        </div>
      </Wrap>

      <Wrap>
        <div className="py-16">
          <SectionHead title={t.amenities.title} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {t.amenities.items.map((amenity) => (
              <div
                key={amenity.key}
                className="border border-hair bg-canvas p-6"
              >
                <div className="mb-4 inline-flex bg-tint p-3 text-blue">
                  {AMENITY_ICON[amenity.key]}
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {amenity.label}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  <Rich
                    content={amenity.body}
                    strongClassName="font-semibold text-ink2"
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </Wrap>

      <Wrap>
        <div className="py-16">
          <SectionHead title={t.gallery.title} />
          <CoworkGallery
            photos={galleryPhotos}
            zoomLabel={t.gallery.zoomLabel}
            closeLabel={t.gallery.closeLabel}
          />
        </div>
      </Wrap>

      <Wrap>
        <div className="py-16">
          <SectionHead title={t.residents.title} />
          <div className="max-w-4xl border border-hair bg-canvas p-8 text-lg leading-relaxed text-muted">
            <Rich content={t.residents.body} />
          </div>
        </div>
      </Wrap>

      <Wrap>
        <div className="py-16">
          <SectionHead title={t.location.title} />
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <ul className="space-y-3 text-lg text-ink2">
              {t.location.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <MapPinIcon className="mt-0.5 h-5 w-5 flex-none text-blue" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <iframe
              src={mapsEmbedUrl(t.location)}
              title={t.location.mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full border border-hair"
            />
          </div>
        </div>
      </Wrap>

      <Wrap>
        <div className="py-16">
          <div className="mx-auto max-w-md border border-hair bg-canvas p-8">
            <Eyebrow as="span" className="inline-block bg-tint px-3 py-1">
              {t.pricing.badge}
            </Eyebrow>
            <p className="mt-4 font-display text-6xl font-bold text-ink2">
              {t.pricing.price}
            </p>
            <p className="text-muted">{t.pricing.period}</p>
            <p className="mt-5 text-sm font-medium text-ink2">
              {t.pricing.intro}
            </p>
            <ul className="mt-3 space-y-2 text-ink2">
              {t.pricing.includes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-none text-blue" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <CtaLink href={t.pricing.ctaHref} size="block" className="mt-7">
              {t.pricing.cta}
            </CtaLink>
            <p className="mt-4 bg-tint px-4 py-3 text-sm text-ink2">
              <Rich
                content={t.pricing.nudge}
                strongClassName="font-semibold text-ink2"
              />
            </p>
          </div>
        </div>
      </Wrap>

      <section className="py-32 text-center">
        <Wrap>
          <h2 className="text-section font-bold">{t.final.title}</h2>
          <p className="mx-auto mb-9 mt-5 max-w-[44ch] text-muted">
            {t.final.lead}
          </p>
          <CtaLink href={t.final.cta.href}>{t.final.cta.label}</CtaLink>
        </Wrap>
      </section>
    </main>
  );
}
