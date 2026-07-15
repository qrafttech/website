import type { RichText } from "@/lib/i18n/types";
import { BOOKING_URL } from "@/lib/site";

const street = "36 rue Sainte";
const postalCode = "13001";
const city = "Marseille";
const address = `${street}, ${postalCode} ${city}`;

export const cowork = {
  eyebrow: "Cowork · Marseille",
  title: "Le cowork de Qraft",
  metaTitle: "Cowork à Marseille",
  subtitle:
    "150 m² d’espace lumineux au cœur de Marseille, à 2 min du Vieux-Port. Pour les freelances, entrepreneurs et start-ups.",
  description:
    "Le cowork de Qraft : 150 m² d’espace lumineux au cœur de Marseille, à 2 min du Vieux-Port. 22 postes, salles de réunion, callboxes, accès 24/7. 240 € H.T. / mois, sans engagement.",
  stats: [
    { value: "150 m²", label: "d’espace lumineux" },
    { value: "22", label: "postes de travail" },
    { value: "2", label: "salles de réunion" },
    { value: "3", label: "callboxes" },
  ],
  spaces: {
    eyebrow: "Visite guidée",
    title: "Nos espaces",
    tiles: [
      {
        key: "openSpace",
        title: "L’open space",
        body: "22 postes de travail baignés de lumière, en libre accès, au cœur de Marseille.",
        alt: "Open space lumineux du cowork de Qraft",
      },
      {
        key: "kitchen",
        title: "La cuisine",
        body: "100 % équipée — four, frigo, machine à eau gazeuse.",
        alt: "Cuisine équipée du cowork",
      },
      {
        key: "meeting",
        title: "Les salles de réunion",
        body: "Deux salles fermées, disponibles sans réservation, pour les ateliers, les points d’équipe ou les visios à plusieurs.",
        alt: "Salle de réunion du cowork",
      },
      {
        key: "callbox",
        title: "Les callboxes",
        body: "Trois cabines individuelles pour passer tes calls et tes visios au calme, sans déranger l’open space — et sans être dérangé.",
        alt: "Callbox individuelle pour passer ses appels au calme",
      },
    ],
  },
  amenities: {
    eyebrow: "Tout pour bien bosser",
    title: "Le confort, inclus",
    items: [
      {
        key: "access",
        label: "Accès 24/7",
        body: [
          { text: "Accès " },
          { text: "24/7", strong: true },
          { text: ", pour s’adapter au rythme de chacun." },
        ] as RichText,
      },
      {
        key: "coffee",
        label: "Café, thé & fruits frais",
        body: [
          { text: "Café, thé et fruits frais", strong: true },
          { text: " à volonté." },
        ] as RichText,
      },
      {
        key: "desks",
        label: "Postes équipés",
        body: [
          { text: "8 postes équipés d’écrans externes", strong: true },
          { text: " en libre accès : " },
          { text: "4K, QHD ou ultrawide 21:9", strong: true },
          { text: " selon les postes. Tu poses ton laptop, tu branches " },
          { text: "un seul câble USB-C", strong: true },
          { text: ", et tout suit : écran, charge, accessoires." },
        ] as RichText,
      },
      {
        key: "techMeeting",
        label: "Réunion tech du mardi",
        body: [
          { text: "Et chaque mardi matin, la " },
          { text: "réunion tech", strong: true },
          { text: " (optionnelle) : un moment pour partager ses trouvailles." },
        ] as RichText,
      },
    ],
  },
  gallery: {
    eyebrow: "La galerie",
    title: "En images",
    zoomLabel: "Agrandir",
    closeLabel: "Fermer",
    photos: [
      {
        key: "meeting2",
        alt: "Le coin salon avec canapé et fauteuils pour une pause au calme",
      },
      {
        key: "babyfoot",
        alt: "Le babyfoot pour décompresser entre deux sessions",
      },
      { key: "balcon", alt: "Le balcon avec vue sur une rue de Marseille" },
      {
        key: "openSpace2",
        alt: "L’équipe en train de travailler dans l’open space",
      },
      { key: "bureauDebout", alt: "Bureau debout en libre accès" },
      {
        key: "lunch2",
        alt: "Grande table en bois pour déjeuner ou travailler ensemble",
      },
    ],
  },
  residents: {
    title: "Ils travaillent ici",
    body: [
      { text: "À la machine à café, tu croiseras les équipes d’" },
      { text: "Embarq", href: "https://embarq.fr" },
      {
        text: ", la plateforme qui simplifie la gestion du portage salarial, de ",
      },
      { text: "Wisetax", href: "https://wisetax.fr" },
      {
        text: ", l’IA au service des professionnels du droit fiscal et social, et de ",
      },
      { text: "We Are Etendart", href: "https://www.weareetendart.org" },
      {
        text: ", le mouvement éducatif qui révèle le potentiel des jeunes à travers le sport et l’art. Tu croiseras également une poignée de freelances product & tech, avocats, etc.",
      },
    ] as RichText,
  },
  location: {
    title: "On est où ?",
    street,
    postalCode,
    city,
    points: [
      address,
      "Métro Vieux-Port à 2 min à pied",
      "Restaurants & cafés à proximité",
    ],
    mapTitle: `Carte du cowork de Qraft, ${street}, ${city}`,
  },
  pricing: {
    badge: "sans engagement",
    price: "240 €",
    period: "H.T. / mois",
    intro: "Une place dans l’open space, et tout le reste avec :",
    includes: [
      "Accès 24/7",
      "Salles de réunion",
      "Callboxes",
      "Café, thé et fruits frais",
    ],
    cta: "Réserver une visite",
    ctaHref: BOOKING_URL,
    nudge: [
      { text: "Tu hésites ? " },
      { text: "Viens tester une semaine", strong: true },
      { text: " avant de te décider." },
    ] as RichText,
  },
  final: {
    title: "Tu trouveras ta place parmi nous",
    lead: "Viens visiter le cowork de Qraft.",
    cta: {
      label: "Réserver une visite",
      href: BOOKING_URL,
    },
  },
} as const;
