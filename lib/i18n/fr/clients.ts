import type { RichText } from "@/lib/i18n/types";
import type { StackIconSlug } from "@/lib/stack-icons";

export interface StackItem {
  label: string;
  icon?: StackIconSlug;
}

export interface ClientPoints {
  title: string;
  items: readonly string[];
}

export interface Client {
  slug: string;
  name: string;
  sector: string;
  lede: string;
  website?: string;
  anonymous?: boolean;
  ndaMention?: string;
  project: string;
  points?: ClientPoints;
  role: RichText;
  stack?: readonly StackItem[];
  integrations?: readonly string[];
}

export const clients: readonly Client[] = [
  {
    slug: "episto",
    name: "Episto",
    sector: "Études de marché · SaaS",
    lede: "Les études quali et quanti en quelques jours au lieu de plusieurs semaines, grâce au recrutement des répondants sur les réseaux sociaux.",
    website: "episto.fr",
    project:
      "Episto est une plateforme d’études de marché fondée en 2018 : conception, programmation, lancement et analyse d’études quantitatives et qualitatives sur une seule plateforme. Les répondants sont recrutés en mode conversationnel via les réseaux sociaux (social sampling), dans plus de 100 pays, et l’analyse est augmentée par l’IA. Plus de 400 clients — retail, beauté, agro-alimentaire, banque et assurance, luxe, instituts d’études —, 2 500 études et 1,2 million de répondants.",
    role: [
      { text: "Qraft accompagne " },
      { text: "l’équipe produit et technique", strong: true },
      { text: " d’Episto." },
    ],
  },
  {
    slug: "cevidentia",
    name: "C’Evidentia",
    sector: "Optique · Plateforme web",
    lede: "L’essayage et la vente de lunettes en ligne, pour les mutuelles et les grandes entreprises.",
    website: "cevidentia.com",
    project:
      "C’Evidentia couvre tout le cycle de vente des montures, verres et produits d’optique : une application e-commerce avec essayage virtuel, signature électronique des devis, paiement du reste à charge et tests de vue dirigés en temps réel par un opticien — et un backoffice qui gère les rendez-vous, les commandes, les devis, les stocks et les expéditions.",
    points: {
      title: "Les points techniques clés",
      items: [
        "Marque blanche multi-tenant : un thème par sous-domaine, des parcours de commande spécifiques par client, une seule base de code",
        "Tests optiques en temps réel : l’opticien guide l’écran du client via WebSockets",
        "Responsive web, tablette et mobile, compatible avec l’essayage virtuel",
      ],
    },
    role: [
      { text: "Qraft développe la plateforme " },
      { text: "de bout en bout", strong: true },
      {
        text: " et la fait évoluer en production, en collaboration avec Spellbind pour la conception UX/UI.",
      },
    ],
    stack: [
      { label: "Rails API", icon: "rubyonrails" },
      { label: "Sidekiq", icon: "sidekiq" },
      { label: "PostgreSQL", icon: "postgresql" },
      { label: "Redis", icon: "redis" },
      { label: "Next.js", icon: "nextdotjs" },
      { label: "TypeScript", icon: "typescript" },
      { label: "MUI", icon: "mui" },
      { label: "Scalingo" },
      { label: "AWS S3" },
    ],
    integrations: ["Stripe", "DocuSign", "Postmark", "Cal", "Wing"],
  },
  {
    slug: "easiware",
    name: "easiware",
    sector: "Service client · Direction technique",
    lede: "La direction technique d’easiware-start, le produit de service client omnicanal (chat, email, WhatsApp) pour PME et startups.",
    website: "easiware.com",
    project:
      "easiware cherchait de l’expertise technique pour construire easiware-start, son nouveau produit de service client. L’équipe de 8 personnes était confrontée à des soucis de vélocité, de qualité et de séniorité. Qraft a pris la direction technique en tant que Lead Developer : réorganisation de l’équipe et recrutement de personnes clés, simplification de la stack — migration des micro-services vers un monolithe NestJS —, ajout de tests unitaires et d’intégration (Jest) et de CI/CD (GitHub Actions).",
    points: {
      title: "Les points techniques clés",
      items: [
        "Réorganiser structurellement une équipe existante tout en la gardant motivée et alignée",
        "Refactor et phase-out des micro-services vers un monolithe, sans arrêter de livrer des fonctionnalités",
      ],
    },
    role: [
      { text: "Après un an, Qraft a " },
      { text: "recruté son propre remplaçant", strong: true },
      {
        text: " — entretiens et tests techniques — et easiware a réinternalisé le projet.",
      },
    ],
    stack: [
      { label: "NestJS", icon: "nestjs" },
      { label: "TypeScript", icon: "typescript" },
      { label: "TypeORM", icon: "typeorm" },
      { label: "PostgreSQL", icon: "postgresql" },
      { label: "Jest", icon: "jest" },
      { label: "Next.js", icon: "nextdotjs" },
      { label: "MUI", icon: "mui" },
      { label: "Heroku" },
      { label: "AWS S3" },
    ],
    integrations: ["YouSign", "Postmark"],
  },
  {
    slug: "embarq",
    name: "Embarq",
    sector: "Portage salarial · Web & mobile",
    lede: "Toutes les applications web et mobile d’une société de portage salarial — de l’onboarding des indépendants au versement des salaires.",
    website: "embarq.fr",
    project:
      "Interface web pour les admins, business developers et account managers : onboarding des indépendants, gestion des missions et clients, contrats, facturation, versement des salaires, exports. Interface web pour les indépendants : signature des contrats, comptes rendus d’activité, notes de frais, bulletins de salaire. Et une application mobile iOS et Android qui reprend les fonctionnalités de l’interface web.",
    points: {
      title: "Les points techniques clés",
      items: [
        "Architecture du code et organisation de la base de données pour des règles métier complexes",
      ],
    },
    role: [
      { text: "Qraft a assuré la conception et le développement de " },
      { text: "toutes les applications web et mobile", strong: true },
      { text: " ; conception UX/UI par Spellbind." },
    ],
    stack: [
      { label: "Rails API", icon: "rubyonrails" },
      { label: "GraphQL", icon: "graphql" },
      { label: "Sidekiq", icon: "sidekiq" },
      { label: "PostgreSQL", icon: "postgresql" },
      { label: "Redis", icon: "redis" },
      { label: "Next.js", icon: "nextdotjs" },
      { label: "TypeScript", icon: "typescript" },
      { label: "MUI", icon: "mui" },
      { label: "React Native", icon: "react" },
      { label: "Expo", icon: "expo" },
      { label: "Apollo Client", icon: "apollographql" },
      { label: "Heroku" },
      { label: "AWS S3" },
    ],
    integrations: ["DocuSign", "Sendgrid", "Upflow"],
  },
  {
    slug: "billi",
    name: "Billi",
    sector: "SaaS · Gestion de freelances",
    lede: "La gestion des cabinets de freelances et du management intérimaire — contrats, factures, notes de frais et comptes rendus d’activité, automatisés.",
    website: "billi.so",
    project:
      "Billi automatise les tâches administratives des agences et de leurs prestataires. Interface Agence : gestion des prestataires, validation des notes de frais, édition des missions, génération des contrats, suivi des signatures. Interface Prestataire : comptes rendus d’activité, notes de frais, factures. Chaque mois, le CRA du prestataire part en signature électronique chez le client (YouSign) ; sa validation déclenche la génération d’une facture PDF envoyée par email. Les contrats et avenants sont générés automatiquement à chaque mission ou modification, selon les templates de l’agence.",
    points: {
      title: "Les points techniques clés",
      items: [
        "Génération de PDF fiable et performante à l’échelle : grover + Puppeteer dans un Chromium headless, orchestrés par des workers Sidekiq pour paralléliser des dizaines de générations",
      ],
    },
    role: [
      { text: "Qraft a conçu et développé l’application, " },
      { text: "entièrement responsive", strong: true },
      { text: " (web, tablette, mobile) ; conception UX/UI par Spellbind." },
    ],
    stack: [
      { label: "Rails API", icon: "rubyonrails" },
      { label: "Sidekiq", icon: "sidekiq" },
      { label: "PostgreSQL", icon: "postgresql" },
      { label: "Redis", icon: "redis" },
      { label: "Next.js", icon: "nextdotjs" },
      { label: "TypeScript", icon: "typescript" },
      { label: "Tailwind CSS", icon: "tailwindcss" },
      { label: "shadcn/ui", icon: "shadcnui" },
      { label: "Scalingo" },
      { label: "AWS S3" },
    ],
    integrations: ["YouSign", "Postmark"],
  },
  {
    slug: "sante",
    name: "Application mobile Santé",
    sector: "Santé · Application mobile",
    lede: "La coordination du maintien à domicile des personnes âgées — médecins, aides à domicile et familles sur la même application.",
    anonymous: true,
    ndaMention: "Projet sous NDA — client confidentiel",
    project:
      "Une plateforme qui organise le maintien à domicile des personnes âgées : planification des passages, suivi des interventions, et coordination entre les médecins, les aides à domicile professionnelles et les familles. Chacun voit ce qui le concerne, au bon moment, depuis son téléphone.",
    points: {
      title: "Ce qu’on a construit",
      items: [
        "Application mobile React Native (Expo) pour les intervenants et les familles",
        "API FastAPI sur PostgreSQL, traitements asynchrones avec Redis (RQ)",
        "Synchronisation avec Ximi, le logiciel métier de l’aide à domicile",
      ],
    },
    role: [
      {
        text: "Qraft a cadré le besoin avec les équipes métier, puis conçu et livré l’application ",
      },
      { text: "de bout en bout", strong: true },
      { text: " — du premier atelier à la publication sur les stores." },
    ],
    stack: [
      { label: "FastAPI", icon: "fastapi" },
      { label: "PostgreSQL", icon: "postgresql" },
      { label: "Redis (RQ)", icon: "redis" },
      { label: "React Native", icon: "react" },
      { label: "Expo", icon: "expo" },
      { label: "NativeWind" },
      { label: "Scalingo" },
    ],
    integrations: ["Ximi", "Brevo", "Expo EAS"],
  },
  {
    slug: "bruno",
    name: "Bruno",
    sector: "Fintech · Épargne",
    lede: "La micro-épargne intelligente : l’analyse des dépenses par IA place automatiquement ce qui peut l’être, sans découvert.",
    project:
      "Bruno analyse les dépenses de ses utilisateurs pour épargner automatiquement les montants qui peuvent l’être, sans provoquer de découvert, vers des produits d’épargne. L’agrégation bancaire alimente un moteur d’analyse des transactions ; les virements d’épargne sont déclenchés automatiquement.",
    role: [
      { text: "Qraft a développé l’application " },
      { text: "de bout en bout", strong: true },
      { text: " — API, moteur d’analyse, apps web et mobile." },
    ],
    stack: [
      { label: "Rails API", icon: "rubyonrails" },
      { label: "PostgreSQL", icon: "postgresql" },
      { label: "Redis", icon: "redis" },
      { label: "Flask", icon: "flask" },
      { label: "NumPy", icon: "numpy" },
      { label: "Pandas", icon: "pandas" },
      { label: "React", icon: "react" },
      { label: "React Native", icon: "react" },
      { label: "Expo", icon: "expo" },
      { label: "Heroku" },
      { label: "AWS" },
    ],
    integrations: ["Budget Insight", "GoCardless", "Postmark"],
  },
  {
    slug: "chloe",
    name: "Chloé",
    sector: "Luxe · Landing événementielle",
    lede: "Une landing multilingue en 7 langues pour le lancement digital d’une collection capsule resort.",
    project:
      "Pour le lancement digital d’une collection capsule resort de la maison Chloé, Qraft a livré une landing page événementielle disponible en 7 langues, pensée pour un trafic international concentré sur quelques jours.",
    role: [
      { text: "Qraft a assuré le " },
      { text: "développement et la mise en ligne", strong: true },
      { text: " de la landing." },
    ],
    stack: [
      { label: "Next.js", icon: "nextdotjs" },
      { label: "Tailwind CSS", icon: "tailwindcss" },
      { label: "AWS" },
    ],
  },
];

export function getClient(slug: string): Client | undefined {
  return clients.find((client) => client.slug === slug);
}

export const caseUi = {
  stack: "Stack",
  integrations: "Intégrations",
  backToClients: "Toutes les réalisations",
  project: "Le projet",
  role: "Le rôle de Qraft",
  ctaTitle: "Un produit à livrer ?",
  ctaLabel: "Échanger avec l’équipe",
} as const;
