import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import {
  CheckIcon,
  ClockIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import PageHero from "../components/PageHero";
import JsonLd from "../components/JsonLd";
import CoworkGallery from "../components/CoworkGallery.client";
import CallToAction from "../components/CallToAction";
import FluidContainer from "../../components/FluidContainer";
import SectionTitle from "../../components/SectionTitle";
import { SITE_URL } from "../../lib/site";

import coworkOpenSpace from "../../public/images/cowork_open_space.jpg";
import coworkOpenSpace2 from "../../public/images/cowork_open_space2.jpg";
import coworkMeeting from "../../public/images/cowork_meeting.jpg";
import coworkMeeting2 from "../../public/images/cowork_meeting2.jpg";
import coworkCallbox2 from "../../public/images/cowork_callbox2.jpg";
import coworkKitchen from "../../public/images/cowork_kitchen.jpg";
import coworkBabyfoot from "../../public/images/cowork_babyfoot.jpg";
import coworkBalcon from "../../public/images/cowork_balcon.jpg";
import coworkBureauDebout from "../../public/images/cowork_bureau_debout.jpg";
import coworkLunch2 from "../../public/images/cowork_lunch2.jpg";

// Playful doodles reused from the homepage + two cowork-specific ones, as accents.
import shiningStar from "../../public/images/shining-star.svg";
import dancingStar from "../../public/images/dancing-star.svg";
import gem from "../../public/images/gem.svg";
import babyfootDoodle from "../../public/images/babyfoot-doodle.png";
import machinDoodle from "../../public/images/machin-doodle.png";

const COWORK_DESCRIPTION =
  "Le cowork de Qraft : 150 m² d'espace lumineux au cœur de Marseille, à 2 min du Vieux-Port. 22 postes, salles de réunion, callboxes, accès 24/7. 240 € H.T. / mois, sans engagement.";

const BOOKING_URL = "https://cal.com/nicolasrouanne/30min";

const COWORK_ADDRESS = {
  street: "36 rue Sainte",
  postalCode: "13001",
  city: "Marseille",
};

const MAPS_QUERY = `${COWORK_ADDRESS.street}, ${COWORK_ADDRESS.postalCode} ${COWORK_ADDRESS.city}`;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY
)}&output=embed`;

// Soft pastel wash spread over the whole page (like the homepage's light feel),
// in the page's accent colors. No repeat, so the blobs never seam, and bands are
// transparent so it shows continuously with no hard cuts. Content cards stay white.
const PAGE_BG: CSSProperties = {
  backgroundColor: "#ffffff",
  backgroundImage: [
    "radial-gradient(700px 600px at 12% 6%, rgba(135,50,200,0.16), transparent 70%)",
    "radial-gradient(760px 660px at 88% 20%, rgba(38,80,225,0.15), transparent 70%)",
    "radial-gradient(800px 700px at 8% 40%, rgba(252,68,166,0.13), transparent 70%)",
    "radial-gradient(760px 660px at 92% 56%, rgba(4,142,51,0.14), transparent 70%)",
    "radial-gradient(780px 680px at 14% 74%, rgba(231,124,64,0.15), transparent 70%)",
    "radial-gradient(760px 660px at 86% 92%, rgba(135,50,200,0.14), transparent 70%)",
  ].join(","),
  backgroundRepeat: "no-repeat",
};

export const metadata: Metadata = {
  title: "Cowork à Marseille",
  description: COWORK_DESCRIPTION,
  alternates: { canonical: "/cowork" },
};

const stats = [
  { value: "150 m²", label: "d'espace lumineux", accent: "text-[#8732c8]" },
  { value: "22", label: "postes de travail", accent: "text-[#2650e1]" },
  { value: "2", label: "salles de réunion", accent: "text-[#048e33]" },
  { value: "3", label: "callboxes", accent: "text-[#b5571d]" },
];

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

const spaceTiles: {
  title: string;
  body: string;
  icon: ReactNode;
  src: StaticImageData;
  alt: string;
  objectPosition: string;
}[] = [
  {
    title: "L'open space",
    body: "22 postes de travail baignés de lumière, en libre accès, au cœur de Marseille.",
    icon: <ComputerDesktopIcon className="h-5 w-5" />,
    src: coworkOpenSpace,
    alt: "Open space lumineux du cowork de Qraft",
    objectPosition: "center 50%",
  },
  {
    title: "La cuisine",
    body: "100 % équipée — four, frigo, machine à eau gazeuse.",
    icon: <CoffeeIcon className="h-5 w-5" />,
    src: coworkKitchen,
    alt: "Cuisine équipée du cowork",
    objectPosition: "center 62%",
  },
  {
    title: "Les salles de réunion",
    body: "Deux salles fermées, disponibles sans réservation, pour les ateliers, les points d'équipe ou les visios à plusieurs.",
    icon: <UsersIcon className="h-5 w-5" />,
    src: coworkMeeting,
    alt: "Salle de réunion du cowork",
    objectPosition: "center 62%",
  },
  {
    title: "Les callboxes",
    body: "Trois cabines individuelles pour passer tes calls et tes visios au calme, sans déranger l'open space — et sans être dérangé.",
    icon: <PhoneIcon className="h-5 w-5" />,
    src: coworkCallbox2,
    alt: "Callbox individuelle pour passer ses appels au calme",
    objectPosition: "center 62%",
  },
];

const amenities: { label: string; icon: ReactNode; body: ReactNode }[] = [
  {
    label: "Accès 24/7",
    icon: <ClockIcon className="h-6 w-6" />,
    body: (
      <>
        Accès <strong>24/7</strong>, pour s&#39;adapter au rythme de chacun.
      </>
    ),
  },
  {
    label: "Café, thé & fruits frais",
    icon: <CoffeeIcon className="h-6 w-6" />,
    body: (
      <>
        <strong>Café, thé et fruits frais</strong> à volonté.
      </>
    ),
  },
  {
    label: "Postes équipés",
    icon: <ComputerDesktopIcon className="h-6 w-6" />,
    body: (
      <>
        <strong>8 postes équipés d&#39;écrans externes</strong> en libre accès :{" "}
        <strong>4K, QHD ou ultrawide 21:9</strong> selon les postes. Tu poses
        ton laptop, tu branches <strong>un seul câble USB-C</strong>, et tout
        suit : écran, charge, accessoires.
      </>
    ),
  },
  {
    label: "Réunion dev du mardi",
    icon: <UsersIcon className="h-6 w-6" />,
    body: (
      <>
        Et chaque mardi matin, la <strong>réunion dev</strong> (optionnelle) :
        un moment pour partager ses trouvailles tech.
      </>
    ),
  },
];

const galleryPhotos = [
  {
    src: coworkMeeting2,
    alt: "Le coin salon avec canapé et fauteuils pour une pause au calme",
  },
  {
    src: coworkBabyfoot,
    alt: "Le babyfoot pour décompresser entre deux sessions",
  },
  { src: coworkBalcon, alt: "Le balcon avec vue sur une rue de Marseille" },
  {
    src: coworkOpenSpace2,
    alt: "L'équipe en train de travailler dans l'open space",
  },
  { src: coworkBureauDebout, alt: "Bureau debout en libre accès" },
  {
    src: coworkLunch2,
    alt: "Grande table en bois pour déjeuner ou travailler ensemble",
  },
];

const residents = [
  { name: "Embarq", url: "https://embarq.fr" },
  { name: "Wisetax", url: "https://wisetax.fr" },
  { name: "We Are Etendart", url: "https://www.weareetendart.org" },
];

const locationPoints = [
  `${COWORK_ADDRESS.street}, ${COWORK_ADDRESS.postalCode} ${COWORK_ADDRESS.city}`,
  "Métro Vieux-Port à 2 min à pied",
  "Restaurants & cafés à proximité",
];

const pricingIncludes = [
  "Accès 24/7",
  "Salles de réunion",
  "Callboxes",
  "Café, thé et fruits frais",
];

// A playful hand-drawn doodle, positioned absolutely as a faint background accent.
// Hidden on mobile (like the homepage decorations) to avoid clutter.
function Doodle({
  src,
  className,
}: {
  src: StaticImageData;
  className: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      className={`pointer-events-none absolute h-auto max-md:hidden ${className}`}
    />
  );
}

// Bands are transparent so the page's pastel background shows through. An optional
// decoration (a Doodle) floats behind the content, clipped to the band edges.
function Band({
  padding = "py-16",
  decoration,
  children,
}: {
  padding?: string;
  decoration?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`relative ${decoration ? "overflow-hidden" : ""}`}>
      {decoration}
      <FluidContainer>
        <div className={`relative z-10 ${padding}`}>{children}</div>
      </FluidContainer>
    </div>
  );
}

function SectionHead({
  eyebrow,
  eyebrowColor,
  gradient,
  title,
}: {
  eyebrow: string;
  eyebrowColor: string;
  gradient: string;
  title: string;
}) {
  return (
    <div className="mb-8">
      <p
        className={`mb-3 text-xs font-semibold uppercase tracking-[0.28em] ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <SectionTitle className={gradient}>{title}</SectionTitle>
    </div>
  );
}

function MiniHeading({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <h2
      className={`mb-5 text-xs font-semibold uppercase tracking-[0.28em] ${color}`}
    >
      {children}
    </h2>
  );
}

function PhotoTile({ tile }: { tile: typeof spaceTiles[number] }) {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-2xl md:row-span-2">
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        placeholder="blur"
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
        style={{ objectPosition: tile.objectPosition }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="bg-white/15 mb-2 inline-flex rounded-lg p-2 text-white backdrop-blur">
          {tile.icon}
        </div>
        <h3 className="font-serif text-xl font-bold text-white">
          {tile.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-white/90">
          {tile.body}
        </p>
      </div>
    </div>
  );
}

function AmenityCard({ amenity }: { amenity: typeof amenities[number] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 inline-flex rounded-xl bg-[#8732c8]/10 p-3 text-[#8732c8]">
        {amenity.icon}
      </div>
      <h3 className="font-serif text-lg font-bold text-gray-900">
        {amenity.label}
      </h3>
      <p className="mt-2 text-sm text-gray-600">{amenity.body}</p>
    </div>
  );
}

function ResidentLink({ resident }: { resident: typeof residents[number] }) {
  return (
    <a
      href={resident.url}
      target="_blank"
      rel="noreferrer"
      className="font-serif font-semibold text-[#2650e1] underline decoration-2 underline-offset-4 hover:text-[#1565d8]"
    >
      {resident.name}
    </a>
  );
}

export default function CoworkPage() {
  return (
    <main style={PAGE_BG}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Le cowork de Qraft",
          description: COWORK_DESCRIPTION,
          url: `${SITE_URL}/cowork`,
          image: `${SITE_URL}/images/cowork_open_space.jpg`,
          priceRange: "240 € H.T. / mois",
          address: {
            "@type": "PostalAddress",
            streetAddress: COWORK_ADDRESS.street,
            postalCode: COWORK_ADDRESS.postalCode,
            addressLocality: COWORK_ADDRESS.city,
            addressCountry: "FR",
          },
          makesOffer: {
            "@type": "Offer",
            name: "Poste en open space",
            price: "240",
            priceCurrency: "EUR",
            description:
              "Poste de travail en open space, tout inclus, sans engagement. 240 € H.T. par mois.",
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

      <PageHero
        title="Le cowork de Qraft"
        subtitle={
          <>
            150 m² d&#39;espace lumineux au cœur de Marseille, à 2 min du
            Vieux-Port. Pour les freelances, entrepreneurs et start-ups.
          </>
        }
      />

      <Band
        padding="py-12"
        decoration={
          <Doodle
            src={shiningStar}
            className="left-[42%] top-2 w-14 animate-waving-hand opacity-70"
          />
        }
      >
        <div className="flex flex-col divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white py-4 shadow-sm md:flex-row md:divide-x md:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="flex-1 px-6 py-3 text-center">
              <p
                className={`font-serif text-4xl font-extrabold lg:text-5xl ${stat.accent}`}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band
        decoration={
          <Doodle
            src={dancingStar}
            className="left-[50%] top-1 w-28 animate-float opacity-70"
          />
        }
      >
        <SectionHead
          eyebrow="Visite guidée"
          eyebrowColor="text-[#2650e1]"
          gradient="from-[#2650e1] to-[#1079f4]"
          title="Nos espaces"
        />
        <div className="grid grid-cols-1 gap-4 md:auto-rows-[220px] md:grid-cols-2">
          {spaceTiles.map((tile) => (
            <PhotoTile key={tile.title} tile={tile} />
          ))}
        </div>
      </Band>

      <Band
        decoration={
          <Doodle
            src={gem}
            className="right-[38%] top-2 w-14 animate-spin-slow opacity-70"
          />
        }
      >
        <SectionHead
          eyebrow="Tout pour bien bosser"
          eyebrowColor="text-[#8732c8]"
          gradient="from-[#8732c8] to-[#b25eff]"
          title="Le confort, inclus"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {amenities.map((amenity) => (
            <AmenityCard key={amenity.label} amenity={amenity} />
          ))}
        </div>
      </Band>

      <Band
        decoration={
          <Doodle
            src={babyfootDoodle}
            className="right-0 top-4 w-40 animate-float opacity-60"
          />
        }
      >
        <SectionHead
          eyebrow="La galerie"
          eyebrowColor="text-[#047a2c]"
          gradient="from-[#048e33] to-[#0a9e48]"
          title="En images"
        />
        <CoworkGallery photos={galleryPhotos} />
      </Band>

      <Band
        decoration={
          <Doodle
            src={machinDoodle}
            className="right-8 top-6 w-48 animate-bob opacity-50"
          />
        }
      >
        <MiniHeading color="text-[#b5571d]">Ils travaillent ici</MiniHeading>
        <p className="max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-lg leading-relaxed text-gray-700 shadow-sm">
          À la machine à café, tu croiseras les équipes d&#39;
          <ResidentLink resident={residents[0]} />, la plateforme qui simplifie
          la gestion du portage salarial, de{" "}
          <ResidentLink resident={residents[1]} />, l&#39;IA au service des
          professionnels du droit fiscal et social, et de{" "}
          <ResidentLink resident={residents[2]} />, le mouvement éducatif qui
          révèle le potentiel des jeunes à travers le sport et l&#39;art — ainsi
          qu&#39;une avocate et une poignée de freelances Product & Tech.
        </p>
      </Band>

      <Band>
        <MiniHeading color="text-[#8732c8]">On est où ?</MiniHeading>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ul className="space-y-3 text-lg text-gray-700">
            {locationPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 h-5 w-5 flex-none text-[#8732c8]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <iframe
            src={MAPS_EMBED_URL}
            title="Carte du cowork de Qraft, 36 rue Sainte, Marseille"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full rounded-2xl border-0"
          />
        </div>
      </Band>

      <Band
        padding="py-20"
        decoration={
          <Doodle
            src={shiningStar}
            className="left-[30%] top-8 w-14 animate-grow-and-shrink opacity-70"
          />
        }
      >
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <span className="inline-block rounded-full bg-[#048e33]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#047a2c]">
            sans engagement
          </span>
          <p className="mt-4 font-serif text-6xl font-extrabold text-[#2650e1]">
            240 €
          </p>
          <p className="text-gray-500">H.T. / mois</p>
          <p className="mt-5 text-left text-sm font-medium text-gray-700">
            Un poste dans l&#39;open space, et tout le reste avec :
          </p>
          <ul className="mt-3 space-y-2 text-left text-gray-700">
            {pricingIncludes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 h-5 w-5 flex-none text-[#048e33]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-7 block rounded-2xl bg-[#2650e1] py-3 font-semibold text-white transition hover:bg-[#1565d8]"
          >
            Réserver une visite
          </a>
        </div>
      </Band>

      <FluidContainer className="bg-gradient-to-r from-[#2B0AB1] via-[#324DB1] to-[#4AA7B8]">
        <CallToAction
          title="Tu trouveras ta place parmi nous"
          subtitle="Viens visiter le cowork de Qraft."
        />
      </FluidContainer>
    </main>
  );
}
