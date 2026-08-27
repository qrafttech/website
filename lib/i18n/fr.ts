import type { Client, Dictionary, RichText } from "@/lib/i18n/types";
import { ARSENAL_ITEMS } from "@/lib/i18n/arsenal-items";
import { BOOKING_URL, CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/* --- Document metadata ---------------------------------------------------- */

const meta = {
  title: "Qraft · Nous construisons des applications qui durent dans le temps",
  titleTemplate: `%s | ${SITE_NAME}`,
  description:
    "Une équipe de développeur.euse.s à Marseille. Nous écrivons nous-mêmes le code que nous vendons : des applications et des agents IA qui durent dans le temps.",
} as const;

/* --- La barre de navigation et le pied de page ---------------------------- */

const nav = {
  brandLabel: "Qraft",
  label: "Navigation principale",
  links: [
    { key: "offres", label: "Offres", href: "/#offres" },
    { key: "equipe", label: "Équipe", href: "/#origine" },
    { key: "realisations", label: "Réalisations", href: "/#proof" },
    { key: "blog", label: "Blog", href: "/blog" },
    { key: "cowork", label: "Cowork", href: "/cowork" },
  ],
  cta: { label: "Discutons", href: "/#contact" },
  menuOpen: "Ouvrir le menu",
  menuClose: "Fermer le menu",
} as const;

const COLOPHON =
  "Conçu, écrit et codé au 36 rue Sainte, Marseille — par Nicolas, Alexis et Adrien.";

const footer = {
  tagline: [
    { text: "Q", accent: true },
    { text: `rafting agentic software depuis 2020. ${COLOPHON}` },
  ] as RichText,
  contact: "Écrivez-nous :",
  copyright: "© Qraft 2026",
} as const;

/* --- Le sélecteur de langue ----------------------------------------------- */

const langSwitcher = {
  label: "Langue du site",
  toLocale: {
    fr: "Voir ce site en français",
    en: "View this site in English",
  },
} as const;

/* --- Le hero --------------------------------------------------------------- */

const hero = {
  titleLine1: "Construisons ensemble",
  titleLine2: [
    { text: "des applications qui " },
    { text: "durent", accent: true },
    { text: " dans le temps." },
  ] as RichText,
  lead: "Nous sommes une équipe de développeur.euse.s à Marseille. Applications web et mobile, API, agents IA : depuis 2020, nous livrons du code robuste, stable, pensé pour durer.",
  cta: { label: "Voir nos réalisations", href: "#proof" },
  team: [
    {
      key: "nicolas",
      name: "Nicolas Rouanne",
      role: "Co-fondateur · ex-CTO ou VP (Nomad Education, Boaterfly, Bruno)",
      href: "https://www.linkedin.com/in/nicolasrouanne/",
      linkLabel: "Nicolas Rouanne sur LinkedIn",
    },
    {
      key: "alexis",
      name: "Alexis Nugon",
      role: "Co-fondateur · Epitech, 10+ ans de dev",
      href: "https://www.linkedin.com/in/alexis-nugon/",
      linkLabel: "Alexis Nugon sur LinkedIn",
    },
    {
      key: "adrien",
      name: "Adrien Lupo",
      role: "Développeur · 4 ans de dev",
      href: "https://www.linkedin.com/in/adrienlupo/",
      linkLabel: "Adrien Lupo sur LinkedIn",
    },
  ],
} as const;

/* --- Le blog --------------------------------------------------------------- */

const ticker = {
  label: "Notre blog",
  bylinePrefix: "par ",
  metaSeparator: " · ",
  more: { label: "Voir plus →", href: "/blog" },
} as const;

/* --- L’offre --------------------------------------------------------------- */

const offre = {
  id: "offres",
  title: [
    { text: "Des applications, des " },
    { text: "agents IA", accent: true },
    { text: ", une direction technique." },
  ] as RichText,
  lead: [
    "L’IA a changé la donne, et ce n’est que le début : prototyper est devenu quasi gratuit, et écrire beaucoup de code ne coûte presque plus rien.",
    "Notre valeur, c’est notre expertise en développement, avec l’IA comme levier. Écrire du code devient accessible à tous ; en faire un produit scalable et qui dure, c’est un métier.",
  ],
  blocks: [
    {
      key: "apps",
      title: "Applications web, mobile, API",
      body: "Nous écrivons des API en Rails, NestJS ou FastAPI, des interfaces en Next.js et des applications React Native publiées sur les deux stores. Nous choisissons la solution la plus adaptée au besoin et à votre équipe : des choix simples et efficaces, inspirés du Boring Engineering de Doctolib. Pas de micro-services quand un monolithe bien structuré suffit.",
    },
    {
      key: "agents",
      title: "Agents IA",
      body: [
        {
          text: "Un agent LangGraph tourne chez Smartbox, et nous en construisons d’autres chez C’Evidentia et Episto. D’un référentiel de connaissances en Markdown, comme le décrit ",
        },
        {
          text: "Karpathy",
          href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f",
        },
        {
          text: ", à un RAG ou un agent LangGraph : nous partons de vos connaissances propriétaires et choisissons l’architecture la plus simple qui fait le travail.",
        },
      ] as RichText,
    },
    {
      key: "direction",
      title: "Direction technique",
      body: "Quand l’équipe existe déjà mais que la vélocité s’effondre, nous prenons la direction technique le temps qu’il faut. Nous arbitrons l’architecture, tenons les revues et disons non aux chantiers qui n’aboutiront pas. Nous continuons à écrire du code pendant ce temps-là, sinon nous ne saurions plus de quoi nous parlons.",
    },
    {
      key: "mentorat",
      title: "Mentorat et revue de code",
      body: "Vos développeur.euse.s nous font relire leur code, nous montons avec eux un workflow IA qui tient debout et nous restons joignables pour les décisions difficiles. Le rythme se décide avec vous, et il change souvent en cours de route.",
    },
  ],
} as const;

/* --- Les valeurs ----------------------------------------------------------- */

const valeurs = {
  title: [
    { text: "Nos " },
    { text: "valeurs", accent: true },
    { text: "." },
  ] as RichText,
  lead: "Une mission dure en général un an ou plus, et le code vous appartient à 100 %, du premier commit au dernier.",
  values: [
    {
      key: "transparence",
      title: "Transparence",
      body: "Vous n’êtes pas un simple client : nous nous intégrons à votre équipe, et vous faites partie de la nôtre. On écrit, on travaille en asynchrone, et tout est partagé — le code, les revues, l’architecture, la documentation. Les victoires comme les petits soucis.",
    },
    {
      key: "curiosite",
      title: "Curiosité",
      body: "On explore, on teste, on apprend — toujours. Le breakfast tech du mardi matin — un talk de 30 minutes, plus de 100 au compteur —, mais aussi le blog, nos explorations, le code qu’on ouvre.",
    },
    {
      key: "robustesse",
      title: "Robustesse",
      body: "Nous construisons le système pour qu’il tombe le moins possible, et surtout nous nous préparons à ce qu’il tombe : monitoring, alerting, backups. CI et automatisation partout, pour limiter l’erreur humaine.",
    },
    {
      key: "souverainete",
      title: "Souveraineté",
      body: "Vos données sont hébergées chez vous, ou en France, en Europe. Nous faisons particulièrement attention à l’IA, en auto-hébergeant des modèles open-weight quand c’est pertinent.",
    },
  ],
} as const;

/* --- Les technologies ------------------------------------------------------ */

const arsenal = {
  title: [
    { text: "Nos " },
    { text: "technologies de prédilection", accent: true },
  ] as RichText,
  subtitle: "De Rails à l’IA, on maîtrise la stack qu’il vous faut.",
  note: "Vous avez déjà une stack ? Nous nous y adaptons. Sinon, voici les technologies que nous préférons et recommandons — à chaque problème, l’outil le plus adapté. Une application à maintenir avec une petite équipe : Rails. Une API et un agent IA : Python. Une app moderne pour une scaleup : NestJS, qui marche très bien avec les agents.",
  groups: [
    { key: "backend", title: "Backend", items: ARSENAL_ITEMS.backend },
    { key: "data", title: "Base de données", items: ARSENAL_ITEMS.data },
    { key: "frontend", title: "Frontend", items: ARSENAL_ITEMS.frontend },
    { key: "mobile", title: "Apps mobile", items: ARSENAL_ITEMS.mobile },
    { key: "infra", title: "Hosting & infra", items: ARSENAL_ITEMS.infra },
    { key: "llms", title: "LLMs", items: ARSENAL_ITEMS.llms },
    {
      key: "orchestration",
      title: "Orchestration & RAG",
      items: ARSENAL_ITEMS.orchestration,
    },
    { key: "devtools", title: "Dev tools", items: ARSENAL_ITEMS.devtools },
  ],
} as const;

/* --- L’origine ------------------------------------------------------------- */

const origine = {
  dateline: [
    { text: "Tout a commencé à " },
    { text: "Marseille", accent: true },
    { text: ", en 2020." },
  ] as RichText,
  paragraphs: [
    [
      {
        text: "Alexis et Nicolas ont une dizaine d’années de développement derrière eux quand ils se rencontrent dans une startup fintech incubée par Meta. Après plusieurs projets ensemble, ils décident de s’associer autour de valeurs communes en 2020 : Qraft est né.",
      },
    ] as RichText,
    [
      {
        text: "Ils voulaient leur propre atelier : choisir les projets, choisir la façon de les construire et choisir les gens qui les écrivent. Six ans et des dizaines de développeur.euse.s mentoré.e.s plus tard, nous n’avons pas changé d’avis.",
      },
    ] as RichText,
    [
      {
        text: "Ils aiment les choses bien faites, la structure : il y a de la beauté dans le code et l’ingénierie. C’est de là que vient le nom — Qraft, pour quality crafting. Nous construisons des produits robustes, beaux et performants, parce que cette qualité a de la valeur, et nous l’amenons à nos clients et à leurs équipes, avec la vélocité qui va avec. L’IA n’y change rien : elle nous permet juste d’aller plus vite et plus loin — elle accélère ce qui nous différencie.",
      },
    ] as RichText,
    [
      {
        text: "Nous recrutons des ingénieur.e.s issu.e.s d’écoles comme ",
      },
      { text: "Epitech", href: "https://www.epitech.eu/" },
      {
        text: ", et des personnes en reconversion passées par des bootcamps comme ",
      },
      { text: "Le Wagon", href: "https://www.lewagon.com/fr" },
      {
        text: " — Adrien y est arrivé après une école de commerce et quelques années en marketing. Des parcours divers, qui amènent de la richesse : seuls comptent le potentiel, la curiosité et la rigueur.",
      },
    ] as RichText,
  ],
  join: "Rejoignez-nous !",
  photos: [
    {
      key: "openSpace",
      alt: "Trois personnes travaillent à leurs bureaux dans un open space aux murs de brique blanche",
      caption: "36 rue Sainte, Marseille · l’open space.",
    },
    {
      key: "revueDeCode",
      alt: "Deux développeurs penchés sur un écran de code, à une table de l’ancien bureau",
      caption: "Nicolas et Mehdi, revue de code, dans l’ancien bureau.",
    },
    {
      key: "balcon",
      alt: "Vue plongeante sur une rue marseillaise depuis un balcon, en plein soleil",
      caption: "Depuis le balcon du 36 rue Sainte, Marseille.",
    },
  ],
} as const;

/* --- Les réalisations (landing) -------------------------------------------- */

const victoires = {
  id: "proof",
  title: [
    { text: "Nos dernières " },
    { text: "victoires", accent: true },
  ] as RichText,
  lead: "Nous avons livré des applications dans l’optique, la santé, la fintech et le luxe, avec à chaque fois la même exigence : que ça tienne une fois que nous sommes partis.",
  stackLabel: "Stack :",
  integrationsLabel: "Intégrations :",
  cases: [
    {
      slug: "easiware",
      what: "easiware-start, leur nouveau produit de service client, cherchait une direction technique.",
      note: "L’équipe de huit personnes avait un problème de vélocité, de qualité et de séniorité. Nicolas et Alexis ont pris la direction technique et migré les micro-services vers un monolithe NestJS sans jamais arrêter de livrer, parce qu’à huit, un monolithe bien structuré suffisait. Après un an, Qraft a recruté son propre remplaçant, et easiware a réinternalisé le projet.",
    },
    {
      slug: "cevidentia",
      what: "Nous avons construit une plateforme d’essayage et de vente de lunettes en ligne, avec le backoffice qui va avec.",
      note: "L’opticien guide l’écran du client via WebSockets pendant le test de vue, les devis se signent électroniquement et chaque enseigne a son thème sur son sous-domaine. Le tout tient sur une seule base de code, parce qu’une base par enseigne aurait voulu dire corriger chaque bug autant de fois qu’il y a d’enseignes. Nous la faisons évoluer en production.",
    },
    {
      slug: "billi",
      what: "Billi automatise l’administratif des agences qui gèrent des freelances.",
      note: "Chaque mois, le compte rendu d’activité part en signature chez le client, et sa validation déclenche la facture. Derrière, grover et Puppeteer tournent dans un Chromium headless, orchestrés par des workers Sidekiq, parce que tout le monde facture le même jour et que des dizaines de PDF partent d’un coup.",
    },
    {
      slug: "sante",
      what: "Une application mobile organise le maintien à domicile des personnes âgées, et le projet est sous NDA.",
      note: "Médecins, aides à domicile et familles voient chacun ce qui les concerne, au bon moment, depuis leur téléphone. Nous avons cadré le besoin avec les équipes métier avant d’écrire une ligne, parce qu’une tournée d’aide à domicile ne s’invente pas depuis un bureau. L’application tourne sur les deux stores.",
    },
    {
      slug: "embarq",
      what: "Embarq fait du portage salarial : onboarding des indépendants, missions, facturation et salaires passent par ses applications web et mobile.",
      note: "Les admins pilotent les missions, la facturation et le versement des salaires ; les indépendants signent leurs contrats et remplissent leurs comptes rendus d’activité. Une seule API Rails, exposée en GraphQL, sert le web et l’application mobile, parce que des règles métier de cette densité ne doivent être écrites qu’une fois. L’app iOS et Android reprend tout le périmètre du web.",
    },
    {
      slug: "bruno",
      what: "Bruno épargne automatiquement pour ses utilisateurs : un moteur analyse les dépenses et met de côté ce qui peut l’être.",
      note: "L’agrégation bancaire alimente le moteur d’analyse — Flask, NumPy, Pandas, à côté de l’API Rails — qui décide de chaque virement d’épargne, parce que mettre de côté ne doit jamais provoquer de découvert. Nous avons construit l’ensemble de bout en bout : l’API, le moteur, les apps web et mobile, un chatbot Facebook.",
    },
    {
      slug: "chloe",
      what: "Pour la maison Chloé, nous avons livré la landing événementielle d’un lancement de collection capsule, en sept langues.",
      note: "Un lancement digital concentre un trafic international sur quelques jours, et la date ne se reporte pas. Une page Next.js et Tailwind CSS servie depuis AWS, sept langues, dimensionnée pour le pic plutôt que pour la moyenne — livrée pour le jour J.",
    },
    {
      slug: "hellio",
      what: "Hellio orchestre le financement de la rénovation énergétique, et nous renforçons son équipe de développement.",
      note: "Derrière chaque prime CEE, tout un écosystème : les obligés qui financent, les artisans qui réalisent les travaux, les apporteurs d’affaires, et un pôle national qui contrôle la véracité des opérations. Nous travaillons en sprints avec l’équipe fullstack — NestJS, TypeScript, Docker — sur un système d’information intégré à Salesforce et HubSpot, et l’organisation évolue vers des squads avec notre arrivée.",
    },
  ],
  others:
    "Chez Episto, nous travaillons aujourd’hui avec l’équipe produit et technique d’une plateforme d’études qui recrute ses répondants sur les réseaux sociaux.",
} as const;

/* --- L’invitation ----------------------------------------------------------- */

const invitation = {
  id: "contact",
  titleLine1: "Notre porte est ouverte,",
  titleLine2: "au 36 rue Sainte.",
  subtitle: [
    { text: "Passez nous voir au " },
    { text: "cowork", href: "/cowork" },
    { text: "." },
  ] as RichText,
  lead: "Racontez-nous ce que vous voulez construire, ou ce qui s’est cassé. Trente minutes suffisent pour savoir si nous sommes les bonnes personnes, et nous vous le dirons même quand la réponse est non.",
  cta: { label: "Discutons de votre projet", href: `mailto:${CONTACT_EMAIL}` },
  secondaryNote: "Le cowork est à deux minutes du Vieux-Port. Le café est bon.",
} as const;

/* --- Le blog et la page 404 ---------------------------------------------- */

const blog = {
  title: "Nos articles",
  subtitle:
    "Retours d’expérience, guides techniques et bonnes pratiques de notre équipe.",
  metaDescription:
    "Retours d’expérience, guides techniques et bonnes pratiques de l’équipe Qraft.",
  backToArticles: "Retour aux articles",
  empty: "Aucun article pour le moment. Revenez bientôt.",
  pagination: {
    label: "Pagination",
    previous: "Précédent",
    next: "Suivant",
  },
  notFound: {
    title: "Article introuvable",
    body: "Cet article n’existe pas ou a été supprimé.",
    cta: "Retour aux articles",
  },
} as const;

const notFound = {
  eyebrow: "Erreur 404",
  title: "Page introuvable.",
  body: "La page que vous cherchez n’existe pas ou a été déplacée.",
  cta: "Retour à l’accueil",
} as const;

/* --- Les réalisations ----------------------------------------------------- */

const clients: readonly Client[] = [
  {
    slug: "episto",
    name: "Episto",
    sector: "Études de marché · SaaS",
    lede: "Les études quali et quanti en quelques jours au lieu de plusieurs semaines, grâce au recrutement des répondants sur les réseaux sociaux.",
    website: "episto.fr",
    project:
      "Episto est une plateforme d’études de marché fondée en 2018 : conception, programmation, lancement et analyse d’études quantitatives et qualitatives sur une seule plateforme. Les répondants sont recrutés en mode conversationnel via les réseaux sociaux (social sampling), dans plus de 100 pays, et l’analyse est augmentée par l’IA. Plus de 400 clients — retail, beauté, agro-alimentaire, banque et assurance, luxe, instituts d’études —, 2 500 études et 1,2 million de répondants.",
    role: [
      { text: "Qraft travaille avec " },
      { text: "l’équipe produit et technique", strong: true },
      { text: " d’Episto." },
    ],
  },
  {
    slug: "hellio",
    name: "Hellio",
    sector: "Transition énergétique · Renfort d’équipe",
    lede: "Le financement des travaux d’économies d’énergie — primes CEE, obligés, artisans — et l’équipe de développement fullstack que nous renforçons.",
    website: "hellio.com",
    project:
      "Hellio est un acteur de référence de la transition énergétique en France, délégataire CEE : l’État impose aux distributeurs d’énergie de financer des économies d’énergie — isolation, chauffage, rénovation —, et Hellio orchestre tout l’écosystème. Les obligés qui financent les primes, les artisans qui réalisent les travaux, les apporteurs d’affaires, et un pôle national qui contrôle la véracité des opérations. L’activité historique du logement s’est élargie au solaire et à l’énergie.",
    role: [
      { text: "Qraft renforce " },
      { text: "l’équipe de développement fullstack", strong: true },
      { text: " d’Hellio — en sprints, aux côtés des équipes Salesforce." },
    ],
    stack: [
      { label: "NestJS", icon: "nestjs" },
      { label: "TypeScript", icon: "typescript" },
      { label: "Docker", icon: "docker" },
    ],
    integrations: ["Salesforce", "HubSpot"],
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
      { label: "Scalingo", icon: "scalingo" },
      { label: "AWS S3", icon: "amazonwebservices" },
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
      { label: "Heroku", icon: "heroku" },
      { label: "AWS S3", icon: "amazonwebservices" },
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
      { label: "Heroku", icon: "heroku" },
      { label: "AWS S3", icon: "amazonwebservices" },
    ],
    integrations: ["DocuSign", "Sendgrid", "Upflow", "HubSpot"],
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
      { label: "Scalingo", icon: "scalingo" },
      { label: "AWS S3", icon: "amazonwebservices" },
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
      { label: "Scalingo", icon: "scalingo" },
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
      {
        text: " — API, moteur d’analyse, apps web et mobile, chatbot Facebook.",
      },
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
      { label: "Heroku", icon: "heroku" },
      { label: "AWS", icon: "amazonwebservices" },
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
      { label: "AWS", icon: "amazonwebservices" },
      { label: "Cloudflare R2", icon: "cloudflare" },
    ],
  },
];

const caseUi = {
  stack: "Stack",
  integrations: "Intégrations",
  backToClients: "Toutes les réalisations",
  project: "Le projet",
  role: "Le rôle de Qraft",
  ctaTitle: "Un produit à livrer ?",
  ctaLabel: "Échanger avec l’équipe",
  screenshotAlt: "Capture d’écran du projet %s",
} as const;

/* --- Le cowork ------------------------------------------------------------ */

const street = "36 rue Sainte";
const postalCode = "13001";
const city = "Marseille";
const address = `${street}, ${postalCode} ${city}`;

const cowork = {
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
    priceAmount: "240",
    period: "H.T. / mois",
    offerName: "Poste en open space",
    offerDescription:
      "Poste de travail en open space, tout inclus, sans engagement. 240 € H.T. par mois.",
    intro: "Une place dans l’open space, et tout le reste avec :",
    includes: [
      "Accès 24/7",
      "Salles de réunion",
      "Callboxes",
      "Café, thé et fruits frais",
    ],
    cta: { label: "Réserver une visite", href: BOOKING_URL },
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

/* --- The assembled dictionary --------------------------------------------- */

export const fr: Dictionary = {
  meta,
  nav,
  langSwitcher,
  footer,
  hero,
  ticker,
  offre,
  valeurs,
  arsenal,
  origine,
  victoires,
  invitation,
  blog,
  notFound,
  caseUi,
  clients,
  cowork,
};
