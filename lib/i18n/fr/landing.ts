import type { RichText, TermStep } from "@/lib/i18n/types";
import { CONTACT_EMAIL } from "@/lib/site";

const terminalSteps: readonly TermStep[] = [
  {
    label: "lecture du contexte",
    status: "✓",
    detail: "14 fichiers · 2 outils MCP",
  },
  {
    label: "plan",
    status: "4 étapes",
    detail: "analyser → coder → tester → livrer",
  },
  {
    label: "appel MCP · base clients",
    status: "✓",
    detail: "128 enregistrements",
  },
  { label: "écriture · src/agent.ts", status: "✓", detail: "+182 −47" },
  { label: "tests unitaires", status: "12 ✓", progress: true },
  {
    label: "revue de code",
    status: "✓",
    detail: "2 remarques · corrigées",
  },
  {
    label: "déploiement · production",
    status: "✓",
    detail: "v2.4.1 en ligne",
  },
];

export const hero = {
  titleLine1: "La qualité,",
  titleLine2: [
    { text: "augmentée " },
    { text: "par l’IA.", accent: true },
  ] as RichText,
  lead: "On construit vos apps, vos agents, vos équipes.",
  cta: { label: "Voir nos réalisations", href: "#proof" },
  scrollCue: "Défiler vers le bas",
  terminal: {
    title: "agent · qraft/website — ⌘",
    live: "live",
    branch: "⎇ main",
    idle: "idle",
    starting: "démarrage",
    sessionPrefix: "session",
    tokenSuffix: "tok",
    doneLabel: "session complète",
    doneTokens: "3 480",
    doneClock: "00:12",
    steps: terminalSteps,
  },
} as const;

export const ticker = {
  label: "Notre blog",
} as const;

export const offres = {
  title: [
    { text: "Notre ADN reste le " },
    { text: "code de qualité", accent: true },
    { text: "." },
  ] as RichText,
  subtitle:
    "Des développeurs seniors, ex-CTO/VP, 10+ ans d’expérience — qui cadrent le bon problème, pensent l’architecture, et livrent de la conception à la prod.",
  tiles: [
    {
      title: "Vos apps",
      body: "On cadre le bon problème d’abord, puis on le construit — bout en bout, du proto à la production. Des apps qui marchent, qui scalent, qui restent simples.",
    },
    {
      title: "Vos agents",
      body: "Des agents IA en production, pas en démo. Dans votre produit (B2C) ou pour vos équipes (B2B) — testés et monitorés comme le reste.",
    },
    {
      title: "Vos équipes",
      body: "En tant que part time CTO, on élève le niveau de vos équipes : workflow IA efficace, code reviews exigeantes, mentoring — ou on vous aide à recruter.",
    },
  ],
  team: [
    {
      key: "nicolas",
      name: "Nicolas Rouanne",
      role: "Co-fondateur & CEO — ex-CTO ou VP (Nomad Education, Boaterfly, Bruno)",
      href: "https://www.linkedin.com/in/nicolasrouanne/",
      linkLabel: "Nicolas Rouanne sur LinkedIn",
    },
    {
      key: "alexis",
      name: "Alexis Nugon",
      role: "Co-fondateur — Epitech, 10+ ans de dev",
      href: "https://www.linkedin.com/in/alexis-nugon/",
      linkLabel: "Alexis Nugon sur LinkedIn",
    },
    {
      key: "adrien",
      name: "Adrien Lupo",
      role: "Développeur senior",
      href: "https://www.linkedin.com/in/adrienlupo/",
      linkLabel: "Adrien Lupo sur LinkedIn",
    },
  ],
} as const;

export const rotor = {
  ariaLabel: "Nos trois offres",
  roleDescription: "carrousel",
  prev: "Volet précédent",
  next: "Volet suivant",
  slides: [
    {
      key: "apps",
      tab: "Apps",
      title: [
        { text: "D’abord le " },
        { text: "produit", underline: true },
        { text: ", ensuite le code." },
      ] as RichText,
      desc: "Un atelier produit pour cadrer le besoin. Un prototype pour valider les hypothèses avant d’écrire une ligne. Puis du code — sous œil senior, sur une stack qui tient : Rails, Next.js, Postgres, Docker.",
      stackLabel: "Notre arsenal préféré",
      stack: [
        "rails",
        "nextjs",
        "nestjs",
        "postgres",
        "docker",
        "typescript",
      ] as const,
    },
    {
      key: "agentic",
      tab: "Agentic engineering",
      title: [
        { text: "L’agent exécute. La décision reste " },
        { text: "humaine", underline: true },
        { text: "." },
      ] as RichText,
      stackRow: ["langchain", "claude-code"] as const,
      convictions: [
        {
          key: "Permissions",
          value:
            "Un agent qui peut tout faire finit par tout casser. On verrouille ce qu’il touche — code review, déploiement, données clients — avant de lui donner les clés.",
        },
        {
          key: "Contexte",
          value:
            "Un agent sans contexte invente. On lui donne un vrai framework IA — doc, historique, contraintes métier réelles.",
        },
        {
          key: "Automation",
          value:
            "On automatise l’exécution, la décision reste humaine sur ce qui compte.",
        },
      ],
    },
    {
      key: "equipes",
      tab: "Équipes",
      title: [
        { text: "Votre CTO. À " },
        { text: "temps partagé", underline: true },
        { text: "." },
      ] as RichText,
      desc: "Un CTO senior dans votre équipe, à temps partagé — pour cadrer les décisions techniques, élever le niveau de vos devs sur un vrai workflow IA, ou recruter la bonne personne.",
    },
  ],
} as const;

export const proof = {
  title: [
    { text: "On " },
    { text: "accélère", accent: true },
    { text: " ceux qui livrent." },
  ] as RichText,
} as const;

export const ways = {
  columns: [
    {
      title: "À livre ouvert",
      body: "Zéro bullshit, politique de l’écrit. On partage nos retours : blog technique, guides, open source.",
    },
    {
      title: "Souverain quand vos données l’exigent",
      body: "Santé, juridique, finance : on garde votre IA dans vos murs. LLMs open-weight (Mistral, Llama) en self-hosted, RGPD, RAG privé.",
    },
    {
      title: "Maîtrise des coûts",
      body: "On choisit le modèle le moins cher qui fait le job, et on bascule en self-hosted quand le volume le justifie.",
    },
  ],
} as const;

export const final = {
  titleLine1: "Construisons",
  titleLine2: "ensemble.",
  lead: "Vos apps, vos agents, vos équipes. Parlons-en.",
  cta: { label: "Discutons de votre projet", href: `mailto:${CONTACT_EMAIL}` },
} as const;
