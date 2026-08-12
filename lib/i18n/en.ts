import type { Client, Dictionary, RichText } from "@/lib/i18n/types";
import { ARSENAL_ITEMS } from "@/lib/i18n/arsenal-items";
import { BOOKING_URL, CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/* ===========================================================================
 * ENGLISH COPY — the whole site, one file.
 *
 * TRANSCREATION, not translation. Written against `.claude/research-storytelling.md`
 * PARTIE 8 (13 agencies audited for their English versions, seven
 * transcreation rules) and judged by the five gates in `.claude/deliverable.md`,
 * applied in English.
 *
 * CLIENT RULING, and it governs everything below: « keep it more low key in
 * english, don't try to pun, more sober ». The French keeps its wordplay
 * (« Les devs sur le front, comme sur le back ! », « Nos armes de
 * prédilection », « Nos dernières victoires »); the English does not chase it,
 * and does not substitute jokes of its own. The two versions are deliberately
 * different in register. Do not harmonise them.
 *
 * The trap this creates is that sober is not the same as generic, and the
 * fastest way to sound low-key is to reach for the exact vocabulary five rounds
 * of review have banned — "we support you", "trusted partner", "bespoke",
 * "end-to-end", "passionate about quality". Every one of those is sober and
 * dead. **Plainness here comes from concreteness, never from abstraction**, so
 * the register floor is carried by facts instead of jokes: a prototype "already
 * taking on water", things breaking "on a Friday night", an agent that "makes
 * things up", the stacks "we have watched break", "The coffee is good."
 * The model sentence for the whole file is `offre.blocks.agents`: "Nicolas
 * pushed the release live himself, because no agent has write access to our
 * production." Nothing in it is funny and it is completely alive.
 *
 * The seven rules, and where they bite here:
 *   1. Never translate a section heading — rewrite it. Every heading below is a
 *      new English line, not a calque. (Failure case: Akaru, « Nos prix » →
 *      "Our Prizes".) Under the sober ruling they are rewritten *downward*: the
 *      French heading's argument survives, its figure does not.
 *   2. Rewrite the SENTENCE, not the words. Two short French sentences stay two
 *      short English sentences. (Failure case: Akaru, 2 sentences → one 30-word
 *      period with a fronted subordinate. The voice dies at the level of syntax
 *      before it dies at the level of vocabulary.)
 *   3. Treat the English buyer as a DIFFERENT buyer. « Direction technique » →
 *      "Technical leadership", « Nos réalisations » → "Work", « Sobriété » →
 *      "Restraint" (never "Sobriety", which in English is about drink).
 *   4. Let the versions diverge in content where English needs it. The blog is
 *      French-only, and `ticker.lead` says so rather than pretending.
 *   5. Have a native speaker read the finished page. NOT DONE — flagged.
 *   6. Never serve French under an `/en` URL. `hasBlog()` in
 *      `lib/i18n/config.ts` enforces it; this file never promises English prose
 *      it cannot deliver.
 *   7. Translate the story and the proof unchanged, and keep the bilingual
 *      pivots: "No bullshit", "Qrafters", "Qrafting agentic software", and the
 *      subordinated convictions ("No microservices when a well-structured
 *      monolith will do"). Facts travel; puns don't.
 *
 * Structure mirrors `lib/i18n/fr.ts` exactly — same section exports, same
 * order, same keys — and both assemble into a `Dictionary`, so a key present in
 * one locale and missing in the other is a compile error.
 *
 * Every ruling in `.claude/work/rulings.md` carries over unchanged: no named
 * client for the AI argument (F1), Smartbox nameable (F2), exactly three
 * exclusions and never "no offshore" (F3), the team is three (F5), Adrien stays
 * honestly labelled (F6), no dates on the archival captions (F7), engagement
 * length as a plain statement (F8), no invented metric (F9).
 *
 * Section order:
 *   meta · nav · langSwitcher · footer          — the shell
 *   hero · ticker · offre · valeurs · arsenal   — the landing, in page order
 *   origine · victoires · invitation
 *   blog · notFound                             — the blog and the 404
 *   clients · caseUi                            — /realisations/[slug]
 *   cowork                                      — /cowork
 * ========================================================================= */

/* --- Document metadata ---------------------------------------------------- */

/* NOT `SITE_TITLE` / `SITE_DESCRIPTION` from `lib/site.ts`: those are French,
   and serving them under `/en` is PARTIE 8's rule 6 breach (Eleven Labs, OCTO).
   `SITE_NAME` is a proper noun and is shared. */
export const meta = {
  title: "Qraft · Software you’ll still be running in three years",
  titleTemplate: `%s | ${SITE_NAME}`,
  description:
    "Three developers in Marseille. We write the code we sell you ourselves: web and mobile apps, APIs and AI agents built to still be running in three years.",
} as const;

/* --- The rail and the footer ---------------------------------------------- */

export const nav = {
  brandLabel: "Qraft",
  railLabel: "Main navigation",
  /* The blog entry is carried, not deleted: `hasBlog()` drops it on `/en` at
     render time, and keeping the key here means the two dictionaries stay the
     same shape. Hrefs are locale-relative and identical to the French ones —
     `localeHref()` prefixes them, so `/cowork` becomes `/en/cowork`. Never
     hard-code `/en` in this file. */
  links: [
    { key: "offres", label: "What we do", href: "/#offres" },
    { key: "equipe", label: "Team", href: "/#origine" },
    { key: "realisations", label: "Work", href: "/#proof" },
    { key: "blog", label: "Blog", href: "/blog" },
    { key: "cowork", label: "Cowork", href: "/cowork" },
  ],
} as const;

/**
 * Ft4's colophon line. The French puts an em-dash before the names; English
 * takes a comma, because the page's em-dash budget is three and the French page
 * spends zero. Losing one connector is cheaper than starting the habit.
 */
export const COLOPHON =
  "Designed, written and coded at 36 rue Sainte, Marseille, by Nicolas, Alexis and Adrien.";

export const footer = {
  /* "Qrafting agentic software" was already an English pun sitting in the
     French file. It is the one line on the site that needed no work at all. */
  tagline: [
    { text: "Q", accent: true },
    { text: `rafting agentic software since 2020. ${COLOPHON}` },
  ] as RichText,
  contact: "Write to us:",
  copyright: "© Qraft 2026",
} as const;

/* --- The language switcher ------------------------------------------------ */

/* Each label is written in the language it leads to, which is the convention
   every bilingual site in the corpus follows. Identical to the French. */
export const langSwitcher = {
  label: "Site language",
  toLocale: {
    fr: "Voir ce site en français",
    en: "View this site in English",
  },
} as const;

/* ---------------------------------------------------------------------------
 * Landing copy — EN.
 *
 * Eight sections, in page order:
 *   hero → ticker → offre → valeurs → arsenal → origine → victoires
 *   → invitation
 * ------------------------------------------------------------------------ */

/* --- S1 · THE PROMISE ----------------------------------------------------- */

export const hero = {
  /* FR: « Construisons ensemble / des applications qui durent dans le temps. »
     The hortative survives as "Let's" — PARTIE 8 lists it as one of the few
     French devices that crosses cleanly. What does not survive is « durent dans
     le temps », which in English is either a dead idiom ("stand the test of
     time") or a dead adjective ("long-lasting"). Replaced with what a developer
     actually says about old software: you are still running it. The accent
     lands on the verb phrase, as the French accent lands on « durent ». */
  titleLine1: "Let’s build software",
  titleLine2: [
    { text: "you’ll " },
    { text: "still be running", accent: true },
    { text: " in three years." },
  ] as RichText,
  /* Inclusive midpoint forms (`développeur.euse.s`) are a French orthographic
     device with no English equivalent, and inventing one would read worse than
     losing it. Two consequences, both handled deliberately:
     · the French uses masculine plural in this lead precisely because the three
       people it names are all men; English has no such marking, so nothing is
       claimed here either way, and the page still names all three;
     · the recruiting stance, which the French carries typographically, has to
       be carried by a SENTENCE in English. It is, in `origine`'s fifth
       paragraph: women and men, the two named routes in, and the reason. */
  /* Mirrors the French cut: the « code we sell you is code we write ourselves »
     clause is gone, and so is the horizon. « Built to last » is the plain
     English of « pensé pour durer » and lands on the same verb the headline
     accents; « has to survive us » was the old, more literary version of the
     same claim and would now be the only reach in a paragraph of three facts. */
  lead: "We’re three developers in Marseille. Web and mobile apps, APIs, AI agents in production: since 2020 we have been shipping code that is robust, stable and built to last.",
  cta: { label: "See what we’ve built", href: "#proof" },
  contactCta: { label: "Let’s talk", href: "/#contact" },
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
      /* Ruling F6's "mid-level developer" is dropped with the French « développeur
         intermédiaire »: the line now names the route in rather than the rung,
         which is what `origine` goes on to explain. "Career changer" is the
         neutral English for « reconversion » — "retrained" implies a scheme,
         "self-taught" would be false. */
      key: "adrien",
      name: "Adrien Lupo",
      role: "Developer · career changer, 4 years writing code",
      href: "https://www.linkedin.com/in/adrienlupo/",
      linkLabel: "Adrien Lupo on LinkedIn",
    },
  ],
} as const;

/* --- Blog ----------------------------------------------------------------- */

/* The articles are French-only, so `hasBlog()` hides this ticker on `/en`. The
   keys exist so both dictionaries have one shape, and the copy is written so
   that if it ever IS rendered it discloses the language rather than promising
   English and serving French — PARTIE 8's rule 6, broken by Eleven Labs and
   OCTO, and the one failure the research calls worse than having no English
   version at all. */
export const ticker = {
  label: "Our blog",
  lead: "We write up what we learn, we sign our names to it, and the articles are in French.",
  bylinePrefix: "by ",
  metaSeparator: " · ",
  more: { label: "Read more →", href: "/blog" },
} as const;

/* --- S2 · WHAT WE BUILD --------------------------------------------------- */

export const offre = {
  id: "offres",
  /* CLIENT RULING: English does not pun. « Les devs sur le front, comme sur le
     back ! » therefore has no English descendant at all — not the calque PARTIE
     8 offers ("Devs on the front line — and on the back end"), and not a
     replacement joke either. The French keeps its wordplay; the English is
     deliberately a different register, and that divergence is the decision.
     What survives is the pun's PAYLOAD, said plainly. The section's four blocks
     all argue the same thing — the prototype is not the project — so the
     heading states it and stops. It does not repeat the hero's "we write the
     code ourselves", it names this section's own claim, and it stays specific:
     no competitor who has not made the AI argument could put this line on their
     page. Sober is not generic; plainness comes from concreteness. */
  title: [
    { text: "We build the part that comes " },
    { text: "after the prototype", accent: true },
    { text: "." },
  ] as RichText,
  /* Ruling D3, inverted away from Yield Studio: the first clause concedes the
     tool and claims it, so the argument never saws off the product being sold.
     Written as a conviction, with no client attached (ruling F1). */
  lead: "AI has changed the game: prototypes and MVPs are close to free now, and the amount of code in the world is going up. The work starts after that: the edge cases, the data migrations, the traffic spikes and whoever reopens the project in two years. That is what ten years in the job is for. We will build your application from nothing, and we will gladly take over one that is already taking on water.",
  blocks: [
    {
      key: "apps",
      title: "Web and mobile apps",
      /* The bilingual pivot, kept in both languages per rule 7: the "when"
         clause is what makes it an argument instead of a slogan. Kept once —
         the "no oversized infrastructure" half went with the French trim. */
      body: "We write APIs in Rails, NestJS or FastAPI, plus interfaces in Next.js and mobile apps in React Native that ship to both stores. No microservices when a well-structured monolith will do. We don’t do UX or UI, and you’ll hear that from us before you see a quote.",
    },
    {
      /* Cut to match the French: the permissions passage and the self-hosting
         sentence are gone, the latter to `valeurs.sovereignty`, which now makes
         that claim once. « Sans ça, il invente » stays "the agent makes things
         up", which is what an English-speaking developer says where a vendor
         would say "hallucinates". */
      key: "agents",
      title: "Agents and AI in production",
      body: "A LangGraph agent runs at Smartbox, and we are building others inside our clients’ products. Most of the project goes into giving that agent something to work with, which means everything your team knows and has never written down. Without it, the agent makes things up.",
    },
    {
      /* « Direction technique » → "Technical leadership". Deliberately not
         "fractional CTO", the English-market term: the brief already threw out
         « Votre CTO. À temps partagé. » as form without content, and importing
         the same cliché with an English accent would be the same mistake. */
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

/* --- S4 · WHAT YOU ARE ACTUALLY PAYING FOR -------------------------------- */

export const valeurs = {
  /* FR: « Traversons ensemble l'épreuve du temps. » PARTIE 8 prescribes "Let's
     build something that stands the test of time" — correct English, and a
     phrase worn thin enough to belong on the banned list rather than in a
     heading. The hortative is kept; the idiom is swapped for the concrete thing
     that actually happened at easiware, where the client took the project back
     in house and the code stayed. Code that outlives the contract is
     falsifiable, which is what « l'épreuve du temps » was reaching for. */
  title: [
    { text: "Let’s write code that " },
    { text: "outlives the contract", accent: true },
    { text: "." },
  ] as RichText,
  /* Ruling F8's duration, as a plain statement of what is typical. No month
     count, no percentage — the underlying fact is qualitative (F9). The opening
     is now the preference rather than the pride, matching the French. */
  lead: "We would rather take on work that lasts. An engagement usually runs a year or more, which is long enough to live with the architecture we chose — and long enough to fix it on the day it proves us wrong.",
  /* « Nos plus-values » is a house double meaning: added value, and the plural
     of a value. Under the sober ruling the English does not chase it — an
     earlier draft used "Our better qualities", which is a joke about having
     worse ones. The plain version makes the four falsifiable instead of
     decorative, which is the only defence against "values" as a section label:
     honesty, robustness and restraint are all things a client can actually hold
     them to, and the four blocks below say how. */
  valuesLabel: "What you can hold us to",
  values: [
    {
      key: "honnetete",
      title: "Honesty",
      /* Rule 7's first bilingual pivot: « Zéro bullshit » is already English,
         and it anchors both versions to each other. */
      body: "No bullshit. Everything goes in writing. When an estimate slips, you hear it from us, the same day.",
    },
    {
      key: "curiosite",
      title: "Curiosity",
      /* The page's one line of unguarded affect, and it had to be invented
         rather than translated: « ça nous fait notre journée » calques to "it
         makes our day", which in English is a greeting card. What transfers is
         the mechanism — name the thing that is enjoyed, never name the emotion
         — so the word "passionate" never has to be written, and the claim stays
         checkable by anyone who has met these three.
         Under the sober ruling the last sentence loses its punchline and keeps
         its content. Understatement does the work the joke was doing: "the part
         we like best" is a flat report of a preference, which is exactly what
         « Le café est bon » is in French. */
      body: "Every Tuesday morning we sit down for a tech meeting, and nobody has to come. Whoever dug up something good that week shows it to the others. The rest of the week, what we learn we write down: the blog, the guides, the code we open up. Every so often someone we have never met uses one of them, and that is the part we like best.",
    },
    {
      /* « les pépins » is untranslatable at register — "hiccups" is twee,
         "issues" is a helpdesk. So the register is bought with specificity
         instead of slang: a Friday night is a fact everyone in the trade
         recognises. */
      key: "robustesse",
      title: "Robustness",
      body: "Things break on a Friday night, which is when nobody is around to fix them. They have to be fixable in ten minutes, without waiting for Monday’s meeting. Everything else follows from that: code reviews, continuous deployment, reversible migrations, monitoring…",
    },
    {
      /* Replaces « Restraint » / « Sobriété » at the client's instruction, in
         its slot rather than beside it — five values would break the 2×2 grid.
         The cost clause is deliberately gone in both languages: sovereignty is
         a reason to self-host, and pricing it invites the reader to hear the
         principle as a saving.
         "Sovereignty" is the term of art in European procurement and is used
         straight; the French PaaS is named because for a non-French reader
         « Scalingo » alone carries none of the argument. */
      key: "souverainete",
      title: "Sovereignty",
      body: "Your data stays in France. We host on Scalingo, a French PaaS, and when your data cannot leave your building at all, we move to open-weight models you host yourselves, with a private RAG.",
    },
  ],
} as const;

/* --- S5 · THE ARSENAL ----------------------------------------------------- */

export const arsenal = {
  /* « Nos armes de prédilection » → NOT "Our weapons of choice", the brief's
     original worked example. It is the battle metaphor the sober ruling rules
     out, and PARTIE 8 already flagged it as banal in English on its own. The
     plain title claims less and is more falsifiable: these are the stacks they
     know, and the note underneath says how they know them. */
  title: [{ text: "The stacks " }, { text: "we know", accent: true }],
  subtitle: "From Rails to LLMs, we know the stack your project needs.",
  note: "If you already have a stack, we work in it. Otherwise these are the ones we pull off the shelf. They are the ones we have watched break.",
  /* Titles here, items in `arsenal-items.ts` — the group names translate, the
     product names do not. */
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

/* --- S6 · WHO WE ARE — the pivot ------------------------------------------ */

export const origine = {
  /** No longer a dateline, in either language: it now opens the story rather
   *  than captioning it. Rendered one step down from the section display anchor
   *  — see the note in `Origine.tsx`. */
  dateline: [
    { text: "It all started in " },
    { text: "Marseille", accent: true },
    { text: ", in 2020." },
  ] as RichText,
  paragraphs: [
    [
      {
        /* « Qraft est né » is the short presentative the research says only
           works because a long sentence precedes it. English does have "Qraft
           was born", but it arrives varnished; "That is how Qraft started"
           keeps the shortness and loses the varnish. */
        text: "Alexis and Nicolas each had about ten years of development behind them when they met at a fintech startup incubated by Meta. After several projects together, they decided in 2020 to go into business around the values they shared. That is how Qraft started.",
      },
    ] as RichText,
    [
      {
        text: "They wanted a workshop of their own: to pick the projects, to pick how those projects get built and to pick the people who write them. Six years on, there are three of us, and we have not changed our minds.",
      },
    ] as RichText,
    /* Two paragraphs deleted at the client's instruction, mirroring the French:
       ruling F3's exclusions, and the « Qrafters » gentilé PARTIE 8 rated as
       reading better in English than in French. Both are gone in both
       languages — an English page carrying a paragraph the French one dropped
       would be a second, unreviewed site.

       This is also where the inclusive-writing position lands in English. The
       French carries it typographically (`formé.e.s`, `ingénieur.e.s`); English
       has no such device, so the stance is stated in words instead — women and
       men, the two named routes in, and the reason it matters.

       Adrien arrives as an aside inside that sentence rather than in a
       paragraph of his own: he is the proof of the first named route, and one
       associate of three should not get a biography the other two are not
       given. « École de commerce » → "business school", which is what the
       institution is called in English; « reconversion » is already carried by
       "came to code from another career" in the opening clause. */
    [
      {
        text: "We hire women and men who came to code from another career, trained at bootcamps like ",
      },
      { text: "Le Wagon", href: "https://www.lewagon.com/" },
      {
        text: " — Adrien came through it after business school and a few years in marketing — alongside engineers out of specialised schools like ",
      },
      { text: "Epitech", href: "https://www.epitech.eu/" },
      {
        text: ". A team that looks too much alike ends up being wrong together.",
      },
    ] as RichText,
  ],
  /* « Rejoignez-nous ! » → not "Join us!", which in English is a mailing-list
     button. "Come work with us" keeps both the exclamation and the invitation. */
  join: "Come work with us!",
  photos: [
    {
      key: "openSpace",
      alt: "Three people working at their desks in an open space with whitewashed brick walls",
      caption: "36 rue Sainte, Marseille · the open space.",
    },
    /* Ruling F7: no dates on the archival captions. The client has none, and a
       year was invented once already. « dans l'ancien bureau » → "in the old
       office", which does the honesty work the date was meant to do. */
    {
      key: "revueDeCode",
      alt: "Two developers leaning over a screen full of code, at a table in the old office",
      caption: "Nicolas and Mehdi, code review, in the old office.",
    },
    {
      key: "patio",
      alt: "A developer sitting outside in the sun in front of a wall of greenery",
      caption: "Alexis, on the patio of the old office.",
    },
    {
      key: "balcon",
      alt: "Looking down onto a Marseille street from a balcony in full sun",
      caption: "From the balcony at 36 rue Sainte, Marseille.",
    },
  ],
} as const;

/* --- S7 · PROOF ----------------------------------------------------------- */

export const victoires = {
  id: "proof",
  /* « Nos dernières victoires ». PARTIE 8: "our latest victories" is pompous in
     English, and « victoires » is a French section convention that is not an
     English one — the same trap as « Ils nous font confiance » → "They trust
     us". An earlier draft used "Recent wins"; under the sober ruling even that
     is a register the English does not want, so the heading says the flat
     thing, which is also what the nav calls it. */
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
  ],
  others:
    "We also built Embarq’s web and mobile applications and the savings engine behind Bruno. For a Chloé capsule collection we shipped a landing page in seven languages that had to hold international traffic packed into a few days. At Episto we work with the product and engineering team of a research platform that recruits its respondents on social media.",
} as const;

/* --- S8 · INVITATION ------------------------------------------------------ */

export const invitation = {
  id: "contact",
  titleLine1: "Our door is open,",
  titleLine2: "at 36 rue Sainte.",
  /* The invitation moves into the heading and « cowork » is the link, replacing
     the "Come and see us →" secondary CTA one line below that said the same
     thing twice. "Come and see us at the cowork" keeps the old CTA's wording,
     which was already the warmest line in the section. */
  titleLine3: [
    { text: "Come and see us at the " },
    { text: "cowork", href: "/cowork" },
    { text: "." },
  ] as RichText,
  /* BearStudio's lesson applied: « Expliquez-nous votre problème » is neither
     "Explain us your problem" (the francophone error) nor "Explain your problem
     to us" (the literal one) but "Tell us about…". Same move here — the English
     opens on the imperative and then gets out of the way. */
  lead: "Tell us what you want to build, or what just broke. Thirty minutes is usually enough to know whether we are the right people for it. We will say so even when the answer is no.",
  cta: {
    label: "Let’s talk about your project",
    href: `mailto:${CONTACT_EMAIL}`,
  },
  /* The register floor, and the warmest CTA in the researched corpus. It stays
     because there is a real door and real coffee behind it. */
  secondaryNote:
    "The cowork is two minutes from the Vieux-Port. The coffee is good.",
} as const;

/* --- The blog and the 404 -------------------------------------------------- */

/* `/en/blog` 404s by design (`hasTranslation()`), so this copy is the contract
   being satisfied rather than a page being served. It is written honestly
   anyway, in case the ruling ever changes. */
export const blog = {
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

export const notFound = {
  eyebrow: "Error 404",
  title: "Page not found.",
  body: "The page you are looking for does not exist, or it has moved.",
  cta: "Back to the home page",
} as const;

/* ===========================================================================
 * CLIENT CASES
 *
 * Slugs, websites, stack labels, integration names and icon slugs are proper
 * nouns and identical across locales — PARTIE 8's rule 7, and also the join key
 * for `lib/client-logos.ts` and `lib/client-screenshots.ts`. Only the prose is
 * transcreated. `points.items` are engineering notes rather than marketing
 * copy, so they are translated close.
 * ========================================================================= */

export const clients: readonly Client[] = [
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
      /* « Les points techniques clés » → not "The key technical points", which
         is the register of a tender document. These are the parts that were
         hard, and saying so is what keeps the case pages in the same voice as
         the home page rather than a flatter one. */
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
      { label: "Scalingo" },
      { label: "AWS S3" },
    ],
    integrations: ["Stripe", "DocuSign", "Postmark", "Cal", "Wing"],
  },
  {
    slug: "easiware",
    name: "easiware",
    sector: "Customer service · Technical leadership",
    lede: "Running the engineering on easiware-start, the omnichannel customer service product (chat, email, WhatsApp) for SMEs and startups.",
    website: "easiware.com",
    /* The named-person rule reaches the case pages too. The French names
       Nicolas and Alexis on the landing (`victoires.cases.easiware`) but keeps
       « Qraft » here; English puts them back, because this is a 400-word page
       about a rescue and nobody rescues anything in the third person. Same
       fact, one degree more specific. */
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
      { label: "Heroku" },
      { label: "AWS S3" },
    ],
    integrations: ["YouSign", "Postmark"],
  },
  {
    slug: "embarq",
    name: "Embarq",
    /* « Portage salarial » has no English equivalent term. "Umbrella
       employment" is the closest recognised one in the UK market, and it is
       what an English-speaking buyer would search for. */
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
      { label: "Heroku" },
      { label: "AWS S3" },
    ],
    integrations: ["DocuSign", "Sendgrid", "Upflow"],
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
      { label: "Scalingo" },
      { label: "AWS S3" },
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
      { label: "Scalingo" },
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
      { text: ": the API, the analysis engine, the web and mobile apps." },
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
      { label: "AWS" },
    ],
  },
];

export const caseUi = {
  stack: "Stack",
  integrations: "Integrations",
  backToClients: "All our work",
  project: "The project",
  role: "What Qraft did",
  ctaTitle: "Got a product to ship?",
  ctaLabel: "Talk to the team",
  screenshotAlt: "Screenshot of the %s project",
} as const;

/* ===========================================================================
 * COWORK
 *
 * REGISTER DECISION — the one the brief asked to be explained.
 *
 * The French page is tutoiement throughout (« Tu hésites ? », « Tu poses ton
 * laptop », « Tu trouveras ta place parmi nous »). It is the warmest writing on
 * the French site, and English has no equivalent: the T/V distinction went out
 * of the language in the seventeenth century, and every lexical substitute
 * — slang, "mate", "folks", exclamation marks — reads as a brand performing
 * informality rather than a person speaking.
 *
 * So the intimacy is rebuilt grammatically instead of lexically, with three
 * choices held consistently across the page:
 *   · the IMPERATIVE, the only English mood that presumes the right to address
 *     someone directly — "Drop your laptop", "Come and try a week", "Book a
 *     visit";
 *   · CONTRACTIONS throughout, which is where written English keeps the line
 *     between speech and correspondence;
 *   · PHRASAL VERBS and plain domestic nouns — "run into", "kitted out", "first
 *     come first served", "on the doorstep" — in place of the Latinate register
 *     English business copy defaults to.
 *
 * Sentences here are shorter than the French ones, per PARTIE 8's finding that
 * English carries this register at 10–20 % fewer words (Marmelab: « Nous sommes
 * une petite équipe et ici, chacun compte vraiment » → "We're small, so everyone
 * is important").
 * ========================================================================= */

const street = "36 rue Sainte";
const postalCode = "13001";
const city = "Marseille";
const address = `${street}, ${postalCode} ${city}`;

export const cowork = {
  eyebrow: "Cowork · Marseille",
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
    eyebrow: "The tour",
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
    eyebrow: "Everything you need to work",
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
    eyebrow: "The gallery",
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
    /* « Ils travaillent ici » is the same French section convention as « Ils
       nous font confiance », which PARTIE 8 records being calqued to "They
       trust us" on two separate sites. The English form of this title is a
       relative clause, not a pronoun. */
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
    /* « On est où ? » is spoken French. "Where to find us" would be a brochure;
       "So where is it?" is somebody answering the question you just asked. */
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
    cta: "Book a visit",
    ctaHref: BOOKING_URL,
    /* « Tu hésites ? Viens tester une semaine avant de te décider. » — the
       research calls this line already excellent. The imperative carries in
       English exactly what the tutoiement carried in French. */
    nudge: [
      { text: "Not sure? " },
      { text: "Come and try a week", strong: true },
      { text: " before you decide." },
    ] as RichText,
  },
  final: {
    /* « Tu trouveras ta place parmi nous » → not "You will find your place among
       us", which in English is a cult recruitment line. An earlier draft used
       the idiom "a desk with your name on it"; the sober ruling takes the
       literal version, which says the same thing and performs nothing. */
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
