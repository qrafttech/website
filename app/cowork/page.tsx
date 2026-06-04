import type { Metadata } from "next";
import type { ReactNode } from "react";
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
import coworkCallbox from "../../public/images/cowork_callbox.jpg";
import coworkKitchen from "../../public/images/cowork_kitchen.jpg";
import coworkLunch from "../../public/images/cowork_lunch.jpg";
import coworkBalcon from "../../public/images/cowork_balcon.jpg";

const COWORK_DESCRIPTION =
  "Le cowork de Qraft : 150 m² d'espace lumineux au cœur de Marseille, à 2 min du Vieux-Port. 25 postes, salles de réunion, callboxes, accès 24/7.";

const GRADIENT_BLUE = "from-[#2650e1] to-[#1079f4]";
const GRADIENT_PURPLE = "from-[#8732c8] to-[#db73ff]";
const ACCENT_PURPLE = "text-[#8732c8]";

const COWORK_ADDRESS = {
  street: "36 rue Sainte",
  postalCode: "13001",
  city: "Marseille",
};

const MAPS_QUERY = `${COWORK_ADDRESS.street}, ${COWORK_ADDRESS.postalCode} ${COWORK_ADDRESS.city}`;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY
)}&output=embed`;
const MAPS_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAPS_QUERY
)}`;

export const metadata: Metadata = {
  title: "Cowork à Marseille",
  description: COWORK_DESCRIPTION,
  alternates: { canonical: "/cowork" },
};

const stats = [
  { value: "150 m²", label: "d'espace lumineux" },
  { value: "25", label: "postes de travail" },
  { value: "2", label: "salles de réunion" },
  { value: "3", label: "callboxes" },
];

const features = [
  "Accès 24/7, pour s'adapter au rythme de chacun",
  "Équipements pro : écrans partagés, imprimante, casiers personnels",
  "Fruits frais pour l'énergie quotidienne",
  "Salles de réunion disponibles sans réservation",
  "Cuisine 100 % équipée (four, frigo, machine à eau gazeuse...)",
  "Réunions dev chaque mardi matin (optionnelles) : un moment pour partager ses trouvailles tech",
];

const photos = [
  { src: coworkOpenSpace, alt: "Open space lumineux du cowork de Qraft" },
  { src: coworkMeeting, alt: "Salle de réunion du cowork" },
  { src: coworkMeeting2, alt: "Seconde salle de réunion" },
  { src: coworkCallbox, alt: "Callbox pour passer ses appels au calme" },
  { src: coworkKitchen, alt: "Cuisine équipée du cowork" },
  { src: coworkLunch, alt: "Espace repas pour le déjeuner" },
  { src: coworkBalcon, alt: "Balcon du cowork de Qraft" },
];

const locationPoints = [
  `${COWORK_ADDRESS.street}, ${COWORK_ADDRESS.postalCode} ${COWORK_ADDRESS.city}`,
  "Métro Vieux-Port à 2 min à pied",
  "Restaurants & cafés à proximité",
  "Bonus cardio : 4ème étage sans ascenseur !",
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
      <CheckCircleIcon className={`mt-1 h-6 w-6 flex-none ${ACCENT_PURPLE}`} />
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
          address: {
            "@type": "PostalAddress",
            streetAddress: COWORK_ADDRESS.street,
            postalCode: COWORK_ADDRESS.postalCode,
            addressLocality: COWORK_ADDRESS.city,
            addressCountry: "FR",
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
        <div className="grid grid-cols-2 gap-8 py-16 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p
                className={`bg-gradient-to-r ${GRADIENT_BLUE} bg-clip-text font-serif text-4xl font-bold text-transparent lg:text-5xl`}
              >
                {stat.value}
              </p>
              <p className="pt-2 text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </FluidContainer>

      <Section gradient={GRADIENT_PURPLE} title="Tout pour bien bosser">
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <CheckItem key={feature}>{feature}</CheckItem>
          ))}
        </ul>
      </Section>

      <Section gradient={GRADIENT_BLUE} title="Bienvenue chez nous">
        <CoworkGallery photos={photos} />
      </Section>

      <Section gradient={GRADIENT_PURPLE} title="On est où ?">
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-[4_4_0%] flex-col justify-center gap-6">
            <ul className="flex flex-col gap-3">
              {locationPoints.map((point) => (
                <CheckItem key={point}>{point}</CheckItem>
              ))}
            </ul>
            <a href={MAPS_LINK_URL} target="_blank" rel="noreferrer">
              <button
                type="button"
                className="rounded-2xl bg-gradient-to-r from-[#2B0AB1] to-[#4AA7B8] px-8 py-3 font-medium text-white hover:opacity-90"
              >
                Nous situer sur la carte
              </button>
            </a>
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

      <FluidContainer className="bg-gradient-to-r from-[#2B0AB1] via-[#324DB1] to-[#4AA7B8]">
        <CallToAction
          title="Tu trouveras ta place parmi nous"
          subtitle="Viens visiter le cowork de Qraft."
        />
      </FluidContainer>
    </main>
  );
}
