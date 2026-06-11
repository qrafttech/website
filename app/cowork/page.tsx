import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

import PageHero from "../components/PageHero";
import JsonLd from "../components/JsonLd";
import CoworkGallery from "../components/CoworkGallery.client";
import CallToAction from "../components/CallToAction";
import FluidContainer from "../../components/FluidContainer";
import SectionTitle from "../../components/SectionTitle";
import { SITE_URL } from "../../lib/site";

import coworkOpenSpace from "../../public/images/cowork_open_space.jpg";
import coworkMeeting from "../../public/images/cowork_meeting.jpg";
import coworkMeeting2 from "../../public/images/cowork_meeting2.jpg";
import coworkKitchen from "../../public/images/cowork_kitchen.jpg";
import coworkBalcon from "../../public/images/cowork_balcon.jpg";
import coworkLunch2 from "../../public/images/cowork_lunch2.jpg";
import marseille from "../../public/images/marseille.svg";
import underline from "../../public/images/underline.svg";

const COWORK_DESCRIPTION =
  "Le cowork de Qraft : 150 m² d'espace lumineux au cœur de Marseille, à 2 min du Vieux-Port. 22 postes, salles de réunion, callboxes, accès 24/7. 240 € H.T. / mois, sans engagement.";

const GRADIENT_BLUE = "from-[#2650e1] to-[#1079f4]";
const GRADIENT_PURPLE = "from-[#8732c8] to-[#db73ff]";
const GRADIENT_GREEN = "from-[#048e33] to-[#04b23f]";
const GRADIENT_GOLD = "from-brand-orange to-brand-gold";

const COWORK_ADDRESS = {
  street: "36 rue Sainte",
  postalCode: "13001",
  city: "Marseille",
};

const MAPS_QUERY = `${COWORK_ADDRESS.street}, ${COWORK_ADDRESS.postalCode} ${COWORK_ADDRESS.city}`;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY
)}&output=embed`;

export const metadata: Metadata = {
  title: "Cowork à Marseille",
  description: COWORK_DESCRIPTION,
  alternates: { canonical: "/cowork" },
};

const stats = [
  { value: "150 m²", label: "d'espace lumineux" },
  { value: "22", label: "postes de travail" },
  { value: "2", label: "salles de réunion" },
  { value: "3", label: "callboxes" },
];

const spaces = [
  {
    number: "01",
    title: "L'open space",
    description:
      "22 postes de travail baignés de lumière, dont 8 équipés d'écrans externes en libre accès : 4K, QHD ou ultrawide 21:9 selon les postes. Tu poses ton laptop, tu branches un seul câble USB-C, et tout suit : écran, charge, accessoires. Le câble management est caché sous le bureau, le poste reste net.",
  },
  {
    number: "02",
    title: "Les salles de réunion",
    description:
      "Deux salles fermées, disponibles sans réservation, pour les ateliers, les points d'équipe ou les visios à plusieurs.",
  },
  {
    number: "03",
    title: "Les callboxes",
    description:
      "Trois cabines individuelles pour passer tes calls et tes visios au calme, sans déranger l'open space — et sans être dérangé.",
  },
  {
    number: "04",
    title: "Le bureau debout",
    description:
      "Un bureau debout en libre accès, pour alterner les postures au fil de la journée.",
  },
];

const features = [
  "Accès 24/7, pour s'adapter au rythme de chacun",
  "Imprimante et casiers personnels",
  "Fruits frais, café et thé à volonté pour l'énergie quotidienne",
  "Cuisine 100 % équipée (four, frigo, machine à eau gazeuse...)",
  "Réunions dev chaque mardi matin (optionnelles) : un moment pour partager ses trouvailles tech",
];

const photos = [
  { src: coworkOpenSpace, alt: "Open space lumineux du cowork de Qraft" },
  { src: coworkMeeting, alt: "Salle de réunion du cowork" },
  {
    src: coworkMeeting2,
    alt: "Salon cosy avec canapé pour une pause au calme",
  },
  { src: coworkKitchen, alt: "Cuisine équipée du cowork" },
  { src: coworkBalcon, alt: "Balcon du cowork de Qraft" },
  {
    src: coworkLunch2,
    alt: "Grande table en bois pour déjeuner ou travailler ensemble",
  },
];

const residents = [
  {
    name: "Embarq",
    url: "https://embarq.fr",
    description: "la plateforme qui simplifie la gestion du portage salarial",
  },
  {
    name: "Wisetax",
    url: "https://wisetax.fr",
    description: "l'IA au service des professionnels du droit fiscal et social",
  },
  {
    name: "We Are Etendart",
    url: "https://www.weareetendart.org",
    description:
      "le mouvement éducatif qui révèle le potentiel des jeunes à travers le sport et l'art",
  },
];

const locationPoints = [
  `${COWORK_ADDRESS.street}, ${COWORK_ADDRESS.postalCode} ${COWORK_ADDRESS.city}`,
  "Métro Vieux-Port à 2 min à pied",
  "Restaurants & cafés à proximité",
];

function Section({
  gradient,
  title,
  children,
}: {
  gradient: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <FluidContainer>
      <div className="py-16">
        <SectionTitle className={`${gradient} py-4`}>{title}</SectionTitle>
        {children}
      </div>
    </FluidContainer>
  );
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircleIcon className="mt-1 h-6 w-6 flex-none text-[#048e33]" />
      <span>{children}</span>
    </li>
  );
}

export default function CoworkPage() {
  return (
    <main>
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
            Vieux-Port. Pour les freelancers, entrepreneurs et start ups.
          </>
        }
      />

      <FluidContainer>
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 py-16 text-center md:justify-between">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-4xl font-bold text-[#2650e1] lg:text-5xl">
                {stat.value}
              </p>
              <p className="pt-2 text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </FluidContainer>

      <Section gradient={GRADIENT_PURPLE} title="Les espaces">
        <ol className="mt-6 divide-y divide-gray-200">
          {spaces.map((space) => (
            <li
              key={space.number}
              className="flex flex-col gap-2 py-10 md:flex-row md:gap-12"
            >
              <span
                aria-hidden="true"
                className="font-scribble text-2xl text-brand-orange md:pt-1"
              >
                {space.number}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#8732c8] md:w-72 md:flex-none">
                {space.title}
              </h3>
              <p className="flex-1 text-gray-700">{space.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section gradient={GRADIENT_GREEN} title="Tout pour bien bosser">
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <CheckItem key={feature}>{feature}</CheckItem>
          ))}
        </ul>
      </Section>

      <Section gradient={GRADIENT_BLUE} title="Bienvenue chez nous">
        <CoworkGallery photos={photos} />
      </Section>

      <Section gradient={GRADIENT_GOLD} title="Ils travaillent ici">
        <p className="max-w-2xl pt-4 text-gray-700">
          Le cowork accueille des boîtes qu&#39;on croise tous les jours à la
          machine à café :
        </p>
        <ul className="mt-8 flex flex-col gap-6">
          {residents.map((resident) => (
            <li key={resident.name}>
              <a
                href={resident.url}
                target="_blank"
                rel="noreferrer"
                className="font-serif text-xl font-bold text-[#2650e1] underline decoration-2 underline-offset-4 hover:text-[#1079f4]"
              >
                {resident.name}
              </a>
              <span className="text-gray-700"> — {resident.description}.</span>
            </li>
          ))}
        </ul>
        <p className="max-w-2xl pt-8 text-gray-700">
          Ils y côtoient aussi une avocate et plusieurs freelances Product &
          Tech.
        </p>
      </Section>

      <Section gradient={GRADIENT_PURPLE} title="On est où ?">
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-[4_4_0%] flex-col justify-center gap-8">
            <ul className="flex flex-col gap-3">
              {locationPoints.map((point) => (
                <CheckItem key={point}>{point}</CheckItem>
              ))}
            </ul>
            <Image
              src={marseille}
              alt="Handwriting of 'Marseille' with a location pinpoint and a curly arrow"
              className="max-w-[60%] self-center lg:self-start"
            />
          </div>
          <div className="flex-[6_6_0%]">
            <iframe
              src={MAPS_EMBED_URL}
              title="Carte du cowork de Qraft, 36 rue Sainte, Marseille"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full rounded-xl border-0"
            />
          </div>
        </div>
      </Section>

      <FluidContainer>
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <SectionTitle className={`${GRADIENT_BLUE} py-4`}>
            Combien ça coûte ?
          </SectionTitle>
          <div className="relative">
            <p className="font-serif text-5xl font-bold text-[#2650e1] lg:text-6xl">
              240 € <span className="text-2xl lg:text-4xl">H.T. / mois</span>
            </p>
            <Image
              src={underline}
              alt="Handrawing of a strike through to mimic an underline"
              className="mx-auto mt-2"
            />
          </div>
          <p className="-rotate-3 font-scribble text-2xl text-[#059034]">
            sans engagement !
          </p>
          <p className="max-w-xl text-gray-700">
            Un poste dans l&#39;open space, et tout le reste avec : accès 24/7,
            salles de réunion, callboxes, café, thé et fruits frais.
          </p>
        </div>
      </FluidContainer>

      <FluidContainer className="bg-gradient-to-r from-[#2B0AB1] via-[#324DB1] to-[#4AA7B8]">
        <CallToAction
          title="Tu trouveras ta place parmi nous"
          subtitle="Viens visiter le cowork de Qraft."
        />
      </FluidContainer>
    </main>
  );
}
