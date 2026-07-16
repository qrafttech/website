import type { RichText, StreamSession } from "@/lib/i18n/types";
import { CONTACT_EMAIL } from "@/lib/site";

const streamSessions: readonly StreamSession[] = [
  {
    label: "session 11",
    rows: [
      { ix: "/ 01", text: "lecture du contexte", status: "✓" },
      { ix: "/ 02", text: "plan", status: "4 étapes" },
      { ix: "/ 03", text: "écriture · src/agent.ts", status: "✓" },
      { ix: "/ 04", text: "tests unitaires", status: "12 ✓" },
      { ix: "/ 05", text: "déploiement · production", status: "✓" },
    ],
  },
  {
    label: "session 12",
    rows: [
      {
        ix: "/ 01",
        text: "lecture du contexte",
        status: "✓",
        sub: "14 fichiers · 2 outils MCP",
      },
      {
        ix: "/ 02",
        text: "plan",
        status: "4 étapes",
        sub: "analyser → coder → tester → livrer",
      },
      {
        ix: "/ 03",
        text: "appel MCP · base clients",
        status: "✓",
        sub: "128 enregistrements",
      },
      {
        ix: "/ 04",
        text: "écriture · src/agent.ts",
        status: "✓",
        sub: "+182 −47",
      },
      { ix: "/ 05", text: "tests unitaires", status: "12 ✓" },
      {
        ix: "/ 06",
        text: "revue de code",
        status: "✓",
        sub: "2 remarques · corrigées",
      },
      {
        ix: "/ 07",
        text: "déploiement · production",
        status: "✓",
        sub: "v2.4.1 en ligne",
      },
    ],
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
  topline: {
    agent: "agent",
    path: " · qraft/website",
    live: " — live",
    cta: { label: "Discutons", href: "/#contact" },
  },
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
      role: "Développeur intermédiaire (3 ans de dev)",
      href: "https://www.linkedin.com/in/adrienlupo/",
      linkLabel: "Adrien Lupo sur LinkedIn",
    },
  ],
  stream: {
    sessions: streamSessions,
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
