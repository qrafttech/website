import type { Client, Dictionary, RichText } from "@/lib/i18n/types";
import { ARSENAL_ITEMS } from "@/lib/i18n/arsenal-items";
import { BOOKING_URL, CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/* --- Document metadata ---------------------------------------------------- */

const meta = {
  title: "Qraft · Software you’ll still be running in three years",
  titleTemplate: `%s | ${SITE_NAME}`,
  description:
    "A team of developers in Marseille. We write the code we sell you ourselves: web and mobile apps, APIs and AI agents built to still be running in three years.",
} as const;

/* --- The nav bar and the footer ------------------------------------------- */

const nav = {
  brandLabel: "Qraft",
  label: "Main navigation",
  links: [
    { key: "offres", label: "What we do", href: "/#offres" },
    { key: "equipe", label: "Team", href: "/#origine" },
    { key: "realisations", label: "Work", href: "/#proof" },
    { key: "blog", label: "Blog", href: "/blog" },
    { key: "cowork", label: "Cowork", href: "/cowork" },
  ],
  cta: { label: "Let’s talk", href: "/#contact" },
  menuOpen: "Open menu",
  menuClose: "Close menu",
} as const;

const COLOPHON =
  "Designed, written and coded at 36 rue Sainte, Marseille, by Nicolas, Alexis and Adrien.";

const footer = {
  tagline: [
    { text: "Q", accent: true },
    { text: `rafting agentic software since 2020. ${COLOPHON}` },
  ] as RichText,
  contact: "Write to us:",
  copyright: "© Qraft 2026",
} as const;

/* --- The language switcher ------------------------------------------------ */

const langSwitcher = {
  label: "Site language",
  toLocale: {
    fr: "Voir ce site en français",
    en: "View this site in English",
  },
} as const;

/* --- The hero -------------------------------------------------------------- */

const hero = {
  titleLine1: "Let’s build software",
  titleLine2: [
    { text: "you’ll " },
    { text: "still be running", accent: true },
    { text: " in three years." },
  ] as RichText,
  lead: "We’re a team of developers in Marseille. Web and mobile apps, APIs, AI agents: since 2020 we have been shipping code that is robust, stable and built to last.",
  cta: { label: "See what we’ve built", href: "#proof" },
  team: [
    {
      key: "nicolas",
      name: "Nicolas Rouanne",
      role: "Co-founder · ex-CTO or VP (Nomad Education, Boaterfly, Bruno)",
      href: "https://www.linkedin.com/in/nicolasrouanne/",
      linkLabel: "Nicolas Rouanne on LinkedIn",
    },
    {
      key: "alexis",
      name: "Alexis Nugon",
      role: "Co-founder · Epitech, 10+ years writing code",
      href: "https://www.linkedin.com/in/alexis-nugon/",
      linkLabel: "Alexis Nugon on LinkedIn",
    },
    {
      key: "adrien",
      name: "Adrien Lupo",
      role: "Developer · 4 years writing code",
      href: "https://www.linkedin.com/in/adrienlupo/",
      linkLabel: "Adrien Lupo on LinkedIn",
    },
  ],
} as const;

/* --- The blog -------------------------------------------------------------- */

const ticker = {
  label: "Our blog",
  bylinePrefix: "by ",
  metaSeparator: " · ",
  more: { label: "Read more →", href: "/blog" },
} as const;

/* --- What we do ------------------------------------------------------------ */

const offre = {
  id: "offres",
  title: [
    { text: "Applications, " },
    { text: "AI agents", accent: true },
    { text: ", technical leadership." },
  ] as RichText,
  lead: [
    "AI has changed the game, and this is only the beginning: prototyping is close to free now, and writing a lot of code costs almost nothing.",
    "What we sell is engineering expertise, with AI as leverage. Anyone can write code now; turning it into a product that is scalable and still standing in five years is another job entirely.",
  ],
  blocks: [
    {
      key: "apps",
      title: "Web apps, mobile, APIs",
      body: "We write APIs in Rails, NestJS or FastAPI, plus interfaces in Next.js and mobile apps in React Native that ship to both stores. We pick the solution that fits the need and your team: simple, effective choices, in the spirit of Doctolib’s Boring Engineering. No microservices when a well-structured monolith will do.",
    },
    {
      key: "agents",
      title: "AI agents",
      body: [
        {
          text: "A LangGraph agent runs at Smartbox, and we are building others at C’Evidentia and Episto. From a Markdown knowledge base, the way ",
        },
        {
          text: "Karpathy",
          href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f",
        },
        {
          text: " describes it, to a RAG or a LangGraph agent: we start from your proprietary knowledge and pick the simplest architecture that does the job.",
        },
      ] as RichText,
    },
    {
      key: "direction",
      title: "Technical leadership",
      body: "When the team already exists but velocity has collapsed, we take over technical leadership for as long as it takes. We arbitrate the architecture, run the reviews and say no to the projects that will not land. We keep writing code while we do it, otherwise we would stop knowing what we are talking about.",
    },
    {
      key: "mentorat",
      title: "Mentoring and code review",
      body: "Your developers send us their code to read, we build them an AI workflow that holds up under real work, and we stay reachable for the hard calls. You set the rhythm with us, and it usually changes halfway through.",
    },
  ],
} as const;

/* --- Our values ------------------------------------------------------------ */

const valeurs = {
  title: [
    { text: "Our " },
    { text: "values", accent: true },
    { text: "." },
  ] as RichText,
  lead: "An engagement usually runs a year or more, and the code is yours outright, from the first commit to the last.",
  values: [
    {
      key: "transparence",
      title: "Transparency",
      body: "You are not just a client: we join your team, and you are part of ours. We write things down, we work async, and everything is shared — the code, the reviews, the architecture, the documentation. The wins, and the little problems too.",
    },
    {
      key: "curiosite",
      title: "Curiosity",
      body: "We explore, we test, we learn — always. The Tuesday-morning tech breakfast — a 30-minute talk, more than 100 and counting — plus the blog, our experiments, the code we open up.",
    },
    {
      key: "robustesse",
      title: "Robustness",
      body: "We build the system to go down as little as possible, and above all we prepare for the day it does: monitoring, alerting, backups. CI and automation everywhere, to limit human error.",
    },
    {
      key: "souverainete",
      title: "Sovereignty",
      body: "Your data is hosted on your premises, or in France, in Europe. We pay particular attention to AI, self-hosting open-weight models when it makes sense.",
    },
  ],
} as const;

/* --- The stacks ------------------------------------------------------------ */

const arsenal = {
  title: [{ text: "The stacks " }, { text: "we know", accent: true }],
  subtitle: "From Rails to LLMs, we know the stack your project needs.",
  note: "Already have a stack? We work in it. Otherwise these are the technologies we prefer and recommend — for every problem, the tool that fits it best. An app a small team has to maintain: Rails. An API plus an AI agent: Python. A modern app for a scale-up: NestJS, which works very well with agents.",
  groups: [
    { key: "backend", title: "Backend", items: ARSENAL_ITEMS.backend },
    { key: "data", title: "Databases", items: ARSENAL_ITEMS.data },
    { key: "frontend", title: "Frontend", items: ARSENAL_ITEMS.frontend },
    { key: "mobile", title: "Mobile apps", items: ARSENAL_ITEMS.mobile },
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

/* --- Who we are ------------------------------------------------------------ */

const origine = {
  dateline: [
    { text: "It all started in " },
    { text: "Marseille", accent: true },
    { text: ", in 2020." },
  ] as RichText,
  paragraphs: [
    [
      {
        text: "Alexis and Nicolas each had about ten years of development behind them when they met at a fintech startup incubated by Meta. After several projects together, they decided in 2020 to go into business around the values they shared. That is how Qraft started.",
      },
    ] as RichText,
    [
      {
        text: "They wanted a workshop of their own: to pick the projects, to pick how those projects get built and to pick the people who write them. Six years and dozens of mentored developers later, we have not changed our minds.",
      },
    ] as RichText,
    [
      {
        text: "They like things well made, and they like structure: there is beauty in code and in engineering. That is where the name comes from — Qraft, for quality crafting. We build products that are robust, beautiful and fast, because that quality has value, and we bring it to our clients and their teams, with the velocity that comes with it. AI changes none of this: it just lets us go faster and further — it accelerates what sets us apart.",
      },
    ] as RichText,
    [
      {
        text: "We hire engineers out of schools like ",
      },
      { text: "Epitech", href: "https://www.epitech.eu/" },
      {
        text: ", and people who came to code from another career through bootcamps like ",
      },
      { text: "Le Wagon", href: "https://www.lewagon.com/" },
      {
        text: " — Adrien came through it after business school and a few years in marketing. Different routes in, and the range they bring: all we ask for is potential, curiosity and rigour.",
      },
    ] as RichText,
  ],
  join: "Come work with us!",
  photos: [
    {
      key: "openSpace",
      alt: "Three people working at their desks in an open space with whitewashed brick walls",
      caption: "36 rue Sainte, Marseille · the open space.",
    },
    {
      key: "revueDeCode",
      alt: "Two developers leaning over a screen full of code, at a table in the old office",
      caption: "Nicolas and Mehdi, code review, in the old office.",
    },
    {
      key: "balcon",
      alt: "Looking down onto a Marseille street from a balcony in full sun",
      caption: "From the balcony at 36 rue Sainte, Marseille.",
    },
  ],
} as const;

/* --- Proof ----------------------------------------------------------------- */

const victoires = {
  id: "proof",
  title: [{ text: "Our recent " }, { text: "work", accent: true }],
  lead: "We have shipped applications in optics, healthcare, fintech and luxury retail, and each time the bar was the same: it has to hold once we are gone.",
  stackLabel: "Stack:",
  integrationsLabel: "Integrations:",
  cases: [
    {
      slug: "easiware",
      what: "easiware-start, their new customer service product, needed someone to run the engineering.",
      note: "The team of eight had a problem with velocity, quality and seniority. Nicolas and Alexis took over technical leadership and migrated the microservices to a NestJS monolith without ever stopping delivery, because at eight people a well-structured monolith was enough. After a year, Qraft recruited its own replacement and easiware brought the project back in house.",
    },
    {
      slug: "cevidentia",
      what: "We built a platform for trying on and buying glasses online, with the back office that goes with it.",
      note: "The optician drives the customer’s screen over WebSockets during the eye test, quotes are signed electronically and each retail brand gets its own theme on its own subdomain. It all sits on a single codebase, because one codebase per brand would have meant fixing every bug as many times as there are brands. We are still shipping changes to it in production.",
    },
    {
      slug: "billi",
      what: "Billi automates the paperwork for agencies that manage freelancers.",
      note: "Every month the contractor’s timesheet goes out to the client for signature, and approving it fires off the invoice. Behind that, grover and Puppeteer run in a headless Chromium orchestrated by Sidekiq workers, because everyone invoices on the same day and dozens of PDFs go out at once.",
    },
    {
      slug: "sante",
      what: "A mobile app coordinates home care for elderly people, and the project is under NDA.",
      note: "Doctors, home carers and families each see what concerns them, at the right moment, from their phone. We framed the need with the operational teams before writing a line, because you do not invent a home-care round from behind a desk. The app runs on both stores.",
    },
    {
      slug: "embarq",
      what: "Embarq is an umbrella employment company: freelancer onboarding, assignments, invoicing and salaries all run through its web and mobile applications.",
      note: "Admins drive the assignments, the invoicing and the salary payments; freelancers sign their contracts and file their timesheets. A single Rails API, exposed over GraphQL, serves the web and the mobile app, because business rules this dense should only be written once. The iOS and Android app covers the full scope of the web.",
    },
    {
      slug: "bruno",
      what: "Bruno saves automatically for its users: an engine reads the spending and puts aside whatever can go.",
      note: "Bank aggregation feeds the analysis engine — Flask, NumPy, Pandas, alongside the Rails API — and the engine decides every savings transfer, because putting money aside must never push the account into overdraft. We built the whole thing end to end: the API, the engine, the web and mobile apps, a Facebook chatbot.",
    },
    {
      slug: "chloe",
      what: "For the house of Chloé, we shipped the event landing page for a capsule collection launch, in seven languages.",
      note: "A digital launch packs international traffic into a few days, and the date does not move. A Next.js and Tailwind CSS page served from AWS, in seven languages, sized for the peak rather than the average — delivered for launch day.",
    },
  ],
  others:
    "At Episto, we now work with the product and engineering team of a research platform that recruits its respondents on social media.",
} as const;

/* --- The invitation --------------------------------------------------------- */

const invitation = {
  id: "contact",
  titleLine1: "Our door is open,",
  titleLine2: "at 36 rue Sainte.",
  subtitle: [
    { text: "Come and see us at the " },
    { text: "cowork", href: "/cowork" },
    { text: "." },
  ] as RichText,
  lead: "Tell us what you want to build, or what just broke. Thirty minutes is usually enough to know whether we are the right people for it. We will say so even when the answer is no.",
  cta: {
    label: "Let’s talk about your project",
    href: `mailto:${CONTACT_EMAIL}`,
  },
  secondaryNote:
    "The cowork is two minutes from the Vieux-Port. The coffee is good.",
} as const;

/* --- The blog and the 404 -------------------------------------------------- */

const blog = {
  title: "Our articles",
  subtitle:
    "Field notes, technical guides and working habits from our team. The articles are written in French.",
  metaDescription:
    "Field notes, technical guides and working habits from the Qraft team, written in French.",
  backToArticles: "Back to the articles",
  empty: "Nothing here yet. Come back soon.",
  pagination: {
    label: "Pagination",
    previous: "Previous",
    next: "Next",
  },
  notFound: {
    title: "Article not found",
    body: "This article does not exist, or it has been deleted.",
    cta: "Back to the articles",
  },
} as const;

const notFound = {
  eyebrow: "Error 404",
  title: "Page not found.",
  body: "The page you are looking for does not exist, or it has moved.",
  cta: "Back to the home page",
} as const;

/* --- The client cases ------------------------------------------------------ */

const clients: readonly Client[] = [
  {
    slug: "episto",
    name: "Episto",
    sector: "Market research · SaaS",
    lede: "Qualitative and quantitative studies in days instead of weeks, because the respondents are recruited on social media.",
    website: "episto.fr",
    project:
      "Episto is a market research platform founded in 2018: designing, programming, launching and analysing quantitative and qualitative studies on a single platform. Respondents are recruited conversationally through social media (social sampling) across more than 100 countries, and AI does the first pass on the analysis. More than 400 clients across retail, beauty, food and drink, banking, insurance, luxury and the research institutes themselves. 2,500 studies and 1.2 million respondents.",
    role: [
      { text: "Qraft works with " },
      { text: "Episto’s product and engineering team", strong: true },
      { text: "." },
    ],
  },
  {
    slug: "cevidentia",
    name: "C’Evidentia",
    sector: "Optics · Web platform",
    lede: "Trying on and buying glasses online, for health insurers and large employers.",
    website: "cevidentia.com",
    project:
      "C’Evidentia covers the whole sales cycle for frames, lenses and optical products: an e-commerce application with virtual try-on, electronic signature on quotes, payment of whatever the insurer does not cover, plus eye tests an optician drives in real time. There is also a back office for the appointments, the orders, the quotes, the stock and the shipping.",
    points: {
      title: "The hard parts",
      items: [
        "White-label multi-tenant: one theme per subdomain, order flows specific to each brand, a single codebase",
        "Real-time eye tests: the optician drives the customer’s screen over WebSockets",
        "Responsive on web, tablet and mobile, with virtual try-on supported throughout",
      ],
    },
    role: [
      { text: "Qraft builds the platform " },
      { text: "end to end", strong: true },
      {
        text: " and keeps it moving in production, working with Spellbind on the UX and UI design.",
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
    sector: "Customer service · Technical leadership",
    lede: "Running the engineering on easiware-start, the omnichannel customer service product (chat, email, WhatsApp) for SMEs and startups.",
    website: "easiware.com",
    project:
      "easiware needed technical expertise to build easiware-start, its new customer service product. The team of 8 was struggling with velocity, quality and seniority, so Nicolas and Alexis took the engineering lead: reorganising the team, hiring the people it was missing, simplifying the stack by migrating the microservices to a NestJS monolith, then adding unit and integration tests (Jest) and CI/CD (GitHub Actions).",
    points: {
      title: "The hard parts",
      items: [
        "Restructuring an existing team while keeping it motivated and aligned",
        "Refactoring and phasing out the microservices into a monolith, without ever stopping feature delivery",
      ],
    },
    role: [
      { text: "After a year, Qraft " },
      { text: "hired its own replacement", strong: true },
      {
        text: ", interviews and technical tests included, and easiware brought the project back in house.",
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
    sector: "Umbrella employment · Web & mobile",
    lede: "Every web and mobile application for an umbrella employment company, from onboarding the freelancers to paying their salaries.",
    website: "embarq.fr",
    project:
      "The web interface for admins, business developers and account managers covers onboarding freelancers, managing assignments and clients, contracts, invoicing, salary payments and exports. The freelancers get their own: signing contracts, timesheets, expense claims, payslips. And an iOS and Android app has the same features as the web interface.",
    points: {
      title: "The hard parts",
      items: [
        "Code architecture and database design for complex business rules",
      ],
    },
    role: [
      { text: "Qraft designed and built " },
      { text: "every web and mobile application", strong: true },
      { text: "; UX and UI design by Spellbind." },
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
    sector: "SaaS · Freelance management",
    lede: "Running freelance practices and interim management: contracts, invoices, expense claims and timesheets, automated.",
    website: "billi.so",
    project:
      "Billi automates the paperwork that agencies and their contractors would otherwise do by hand. The agency side manages contractors, approves expense claims, edits assignments, generates contracts and tracks signatures. The contractor side is timesheets, expense claims and invoices. Every month the contractor’s timesheet goes out to the client for electronic signature (YouSign), and approving it generates a PDF invoice that is sent by email. Contracts and amendments are generated automatically at every assignment or change, from the agency’s own templates.",
    points: {
      title: "The hard parts",
      items: [
        "Reliable, fast PDF generation at scale: grover and Puppeteer in a headless Chromium, orchestrated by Sidekiq workers so that dozens of documents generate in parallel",
      ],
    },
    role: [
      { text: "Qraft designed and built the application, " },
      { text: "fully responsive", strong: true },
      { text: " on web, tablet and mobile; UX and UI design by Spellbind." },
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
    name: "Healthcare mobile app",
    sector: "Healthcare · Mobile app",
    lede: "Coordinating home care for elderly people: doctors, home carers and families on the same app.",
    anonymous: true,
    ndaMention: "Project under NDA · confidential client",
    project:
      "A platform that organises home care for elderly people: scheduling visits, tracking interventions and coordinating between doctors, professional home carers and families. Each of them sees what concerns them, at the right moment, from their phone.",
    points: {
      title: "What we built",
      items: [
        "React Native (Expo) mobile app for the carers and the families",
        "FastAPI API on PostgreSQL, asynchronous processing with Redis (RQ)",
        "Synchronisation with Ximi, the home-care sector’s own software",
      ],
    },
    role: [
      {
        text: "Qraft framed the need with the operational teams, then designed and delivered the application ",
      },
      { text: "end to end", strong: true },
      { text: ", from the first workshop to publication on the stores." },
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
    sector: "Fintech · Savings",
    lede: "Smart micro-saving: an AI reads the spending and moves what can safely be moved, without ever putting the account into overdraft.",
    project:
      "Bruno reads its users’ spending and puts into savings whatever can go without pushing the account into overdraft. Bank aggregation feeds a transaction analysis engine, and the transfers then fire on their own.",
    role: [
      { text: "Qraft built the application " },
      { text: "end to end", strong: true },
      {
        text: ": the API, the analysis engine, the web and mobile apps, a Facebook chatbot.",
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
    sector: "Luxury · Event landing page",
    lede: "A landing page in seven languages for the digital launch of a resort capsule collection.",
    project:
      "For the digital launch of a resort capsule collection by the house of Chloé, Qraft delivered an event landing page available in seven languages, built for international traffic packed into a few days.",
    role: [
      { text: "Qraft handled the " },
      { text: "development and the launch", strong: true },
      { text: " of the landing page." },
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
  integrations: "Integrations",
  backToClients: "All our work",
  project: "The project",
  role: "What Qraft did",
  ctaTitle: "Got a product to ship?",
  ctaLabel: "Talk to the team",
  screenshotAlt: "Screenshot of the %s project",
} as const;

/* --- The cowork ------------------------------------------------------------ */

const street = "36 rue Sainte";
const postalCode = "13001";
const city = "Marseille";
const address = `${street}, ${postalCode} ${city}`;

const cowork = {
  title: "The Qraft cowork",
  metaTitle: "Coworking in Marseille",
  subtitle:
    "150 m² of daylight in the middle of Marseille, two minutes from the Vieux-Port. For freelancers, founders and small teams.",
  description:
    "The Qraft cowork: 150 m² of daylight in the middle of Marseille, two minutes from the Vieux-Port. 22 desks, meeting rooms, call boxes, 24/7 access. €240 excl. VAT a month, no commitment.",
  stats: [
    { value: "150 m²", label: "of daylight" },
    { value: "22", label: "desks" },
    { value: "2", label: "meeting rooms" },
    { value: "3", label: "call boxes" },
  ],
  spaces: {
    title: "Our rooms",
    tiles: [
      {
        key: "openSpace",
        title: "The open space",
        body: "22 desks in full daylight, first come first served, in the middle of Marseille.",
        alt: "The bright open space of the Qraft cowork",
      },
      {
        key: "kitchen",
        title: "The kitchen",
        body: "Fully kitted out: oven, fridge, sparkling water tap.",
        alt: "The fully equipped kitchen of the cowork",
      },
      {
        key: "meeting",
        title: "The meeting rooms",
        body: "Two closed rooms you can walk into without booking, for workshops, team catch-ups or calls with several of you.",
        alt: "A meeting room in the cowork",
      },
      {
        key: "callbox",
        title: "The call boxes",
        body: "Three single booths, so you can take your calls without disturbing the open space, and without being disturbed.",
        alt: "A single call box for taking calls in peace",
      },
    ],
  },
  amenities: {
    title: "Comfort, included",
    items: [
      {
        key: "access",
        label: "24/7 access",
        body: [
          { text: "24/7 access", strong: true },
          { text: ", so you can work to your own hours." },
        ] as RichText,
      },
      {
        key: "coffee",
        label: "Coffee, tea & fresh fruit",
        body: [
          { text: "Coffee, tea and fresh fruit", strong: true },
          { text: ", as much as you want." },
        ] as RichText,
      },
      {
        key: "desks",
        label: "Equipped desks",
        body: [
          { text: "8 desks with external monitors", strong: true },
          { text: " you can just sit down at: " },
          { text: "4K, QHD or 21:9 ultrawide", strong: true },
          { text: " depending on the desk. Drop your laptop, plug in " },
          { text: "one USB-C cable", strong: true },
          { text: ", and everything follows: screen, charge, accessories." },
        ] as RichText,
      },
      {
        key: "techMeeting",
        label: "Tuesday tech meeting",
        body: [
          { text: "And every Tuesday morning, the " },
          { text: "tech meeting", strong: true },
          {
            text: " (optional): a moment to show the others what you dug up.",
          },
        ] as RichText,
      },
    ],
  },
  gallery: {
    title: "In pictures",
    zoomLabel: "Enlarge",
    closeLabel: "Close",
    photos: [
      {
        key: "meeting2",
        alt: "The sofa corner with armchairs, for a quiet break",
      },
      {
        key: "babyfoot",
        alt: "The table football, for winding down between two sessions",
      },
      { key: "balcon", alt: "The balcony looking onto a Marseille street" },
      {
        key: "openSpace2",
        alt: "People at work in the open space",
      },
      { key: "bureauDebout", alt: "A standing desk, free to use" },
      {
        key: "lunch2",
        alt: "A big wooden table for eating or working together",
      },
    ],
  },
  residents: {
    title: "Who works here",
    body: [
      { text: "At the coffee machine you’ll run into the teams from " },
      { text: "Embarq", href: "https://embarq.fr" },
      {
        text: ", the platform that simplifies umbrella employment, ",
      },
      { text: "Wisetax", href: "https://wisetax.fr" },
      { text: ", AI for tax and employment law professionals, and " },
      { text: "We Are Etendart", href: "https://www.weareetendart.org" },
      {
        text: ", the education movement that brings out young people’s potential through sport and art. You’ll also find a handful of product and tech freelancers, a few lawyers and a few others.",
      },
    ] as RichText,
  },
  location: {
    title: "So where is it?",
    street,
    postalCode,
    city,
    points: [
      address,
      "Vieux-Port metro, two minutes on foot",
      "Restaurants and cafés on the doorstep",
    ],
    mapTitle: `Map of the Qraft cowork, ${street}, ${city}`,
  },
  pricing: {
    badge: "no commitment",
    price: "€240",
    priceAmount: "240",
    period: "excl. VAT / month",
    offerName: "A desk in the open space",
    offerDescription:
      "A desk in the open space, everything included, no commitment. €240 excl. VAT per month.",
    intro: "One desk in the open space, and all of this with it:",
    includes: [
      "24/7 access",
      "Meeting rooms",
      "Call boxes",
      "Coffee, tea and fresh fruit",
    ],
    cta: { label: "Book a visit", href: BOOKING_URL },
    nudge: [
      { text: "Not sure? " },
      { text: "Come and try a week", strong: true },
      { text: " before you decide." },
    ] as RichText,
  },
  final: {
    title: "There is a desk here for you",
    lead: "Come and see the Qraft cowork.",
    cta: {
      label: "Book a visit",
      href: BOOKING_URL,
    },
  },
} as const;

/* --- The assembled dictionary --------------------------------------------- */

export const en: Dictionary = {
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
