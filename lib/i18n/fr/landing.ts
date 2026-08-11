import type { RichText } from "@/lib/i18n/types";
import { CONTACT_EMAIL } from "@/lib/site";

/* ---------------------------------------------------------------------------
 * Landing copy — FR.
 *
 * Eight sections, in page order:
 *   hero → ticker → offre → valeurs → origine → arsenal → victoires
 *   → invitation
 *
 * `constat` — the numbered manifesto « Nos partis pris » — is deleted by client
 * instruction. What was load-bearing inside it was relocated rather than lost:
 *   · thesis 01 (« L’IA a rendu le prototype gratuit ») → `offre.lead`
 *   · thesis 03 (the agent stopped, Nicolas deployed) → `offre.blocks.agents`
 *   · thesis 04's duration, ruling F8 → `valeurs.lead` (never `victoires.lead`,
 *     where it generalised across eight clients and sat beside Chloé's
 *     few-day landing)
 *   · thesis 06's three exclusions, ruling F3 → `origine`'s third paragraph,
 *     kept as one sentence. They passed through `valeurs.honnetete` and turned
 *     it into a six-claim bucket; they belong where the founding choice
 *     « choisir les gens qui les écrivent » has just been made.
 *
 * Anchors kept from the previous file so `lib/i18n/fr/shell.ts` keeps working:
 *   #offres (offre) · #proof (victoires) · #contact (invitation)
 * ------------------------------------------------------------------------ */

/* --- S1 · PROMESSE ------------------------------------------------------- */

export const hero = {
  titleLine1: "Construisons ensemble",
  /* Accent span: « durent » only. The H1 is `max-w-[16ch]` at
     `clamp(2.25rem, min(4.4vw, 7.6svh), 4.5rem)`, so line 2 wraps to three
     lines and « durent dans le temps » would straddle a break and risk
     stranding « le temps. » on a line of its own. One unsplittable word, on
     the verb the client's instruction is actually about. */
  titleLine2: [
    { text: "des applications qui " },
    { text: "durent", accent: true },
    { text: " dans le temps." },
  ] as RichText,
  /* Masculine plural here, and only here-type cases: the three people this
     sentence names are all men, so the midpoint form would describe a team
     that does not exist. The inclusive forms are kept where the referent is
     genuinely mixed — the client's own developers, and who Qraft recruits. */
  lead: "Nous sommes trois développeurs à Marseille, et le code que nous vous vendons, c’est nous qui l’écrivons. Applications web et mobile, API, agents en production : depuis 2020, nous livrons des logiciels qui doivent encore tourner dans trois ans.",
  cta: { label: "Voir nos réalisations", href: "#proof" },
  /* The terminal is deleted and took its topline with it, but `design.md:90-91`
     puts « Discutons » in the hero rather than the nav, so it stays — it is the
     only contact CTA above the fold. */
  contactCta: { label: "Discutons", href: "/#contact" },
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
      role: "Développeur intermédiaire · 3+ ans de dev",
      href: "https://www.linkedin.com/in/adrienlupo/",
      linkLabel: "Adrien Lupo sur LinkedIn",
    },
  ],
} as const;

/* --- Blog ---------------------------------------------------------------- */

export const ticker = {
  label: "Notre blog",
  lead: "On écrit ce qu’on apprend, et on le signe.",
  bylinePrefix: "par ",
  metaSeparator: " · ",
  more: { label: "Voir plus →", href: "/blog" },
} as const;

/* --- S2 · L’OFFRE -------------------------------------------------------- */

export const offre = {
  id: "offres",
  /* The house's own pun, recovered from qraft.tech: it puns on the stack and
     on being on the front line at once, and tells a reader in four words that
     these are people worth sitting next to. It sits here, over the section
     describing what they actually build, because « Marseille, 2020. » now owns
     the heading slot it used to occupy. */
  title: [
    { text: "Les devs sur le " },
    { text: "front", accent: true },
    { text: ", comme sur le " },
    { text: "back", accent: true },
    { text: " !" },
  ] as RichText,
  /* Ruling D3 opens the section rather than sitting in a manifesto: the claim
     is what justifies the price of everything listed below it, so it belongs
     over the offer and nowhere else. Written as a conviction, with no client
     attached (ruling F1), and never in the register of « avec l'IA, coder n'a
     plus de valeur » — the first clause admits the tool and claims it.
     The 47-word second sentence is broken: the semicolon pivot and the
     « parce que » tail on a closing cadence were the most written-to-be-
     admired thing on the page, and they sat third from the top. « Dix ans de
     métier ne servent qu'à ça. » says the same in eight words a person would
     actually say out loud. The argument is untouched.
     « Ce qui coûte encore, ce sont… » was the last standalone two-beat: it
     answered « gratuit » with its lexical opposite, in the first two sentences
     a reader meets after the hero, which is where a tic costs most. « Le
     travail commence après » extends the first sentence instead of mirroring
     it — the prototype is step zero, and the project starts on the far side of
     it. Ruling D3 is intact and no longer needs the word « coûte » to land. */
  lead: "L’IA a rendu le prototype gratuit, et nous nous en servons tous les jours. Le travail commence après : les cas limites, les migrations de données, les montées de charge et la personne qui rouvrira le projet dans deux ans. Dix ans de métier ne servent qu’à ça. Nous construisons votre application à partir de zéro, et nous reprenons volontiers celle qui a déjà pris l’eau.",
  blocks: [
    {
      /* « Notre philosophie tient en une ligne : » is gone. A developer says
         the maxim; only a model announces that it is about to deliver one.
         « la solution la plus simple » is also declared once now, in
         `valeurs.sobriete`, where simplicity is the subject rather than an
         aside. The UX/UI refusal moved down here from the lead: this is the
         block where a reader wonders who designs the thing, and it extends the
         run of negations the old-site sentence already opened. */
      key: "apps",
      title: "Applications web et mobile",
      body: "Nous écrivons des API en Rails, NestJS ou FastAPI, des interfaces en Next.js et des applications React Native publiées sur les deux stores. Pas de micro-services quand un monolithe bien structuré suffit, pas d’infrastructure sur-dimensionnée quand une architecture classique fait le travail. Nous ne faisons pas d’UX/UI non plus, et nous vous le disons avant le devis.",
    },
    {
      /* Still the longest block, because it carries the only sentence in which
         a named person is the subject of a verb — rescued out of the hero
         terminal at the client's prompting, and now the last copy of that
         moment anywhere on the site. Those two sentences are untouched.
         Everything around them lost weight: it read as an essay paragraph in
         seven moves. Cut — « Brancher le modèle est la partie facile ; » (a
         two-beat), « parce qu'un agent qui peut tout faire finit par tout
         casser » (the « qui … finit par … » frame, which `origine` uses
         better), « dans le produit de nos clients comme pour leurs équipes »
         (another two-beat), and the sector list, which `victoires.lead`
         already names. « Sans ça, il invente. » is four words and does the
         work the deleted thesis title used to do. */
      key: "agents",
      title: "Agents et IA en production",
      body: "Un agent LangGraph tourne chez Smartbox, et nous en construisons d’autres chez nos clients. Nous passons l’essentiel du projet à lui donner de quoi travailler, c’est-à-dire tout ce que votre équipe sait sans l’avoir jamais écrit. Sans ça, il invente. Nous verrouillons aussi ce qu’il a le droit de toucher : sur ce site, l’agent a écrit le code et ouvert la revue, puis il s’est arrêté là. Nicolas a fait la mise en ligne lui-même, parce qu’aucun agent n’a d’accès en écriture sur notre production. Quand vos données ne peuvent pas sortir de chez vous, nous passons sur des modèles ouverts auto-hébergés, avec un RAG privé.",
    },
    {
      /* The easiware anecdote is gone from here. It was told twice, two
         screens apart, in twelve identical words (« migrer les micro-services
         vers un monolithe NestJS sans jamais arrêter de livrer »), with « une
         équipe de huit personnes » and the replacement hire repeated around
         it. Nobody tells their own best story twice. It belongs in
         `victoires.cases.easiware`, where the stack and the ending are, and it
         stays there alone. This block now describes the service. */
      key: "direction",
      title: "Direction technique",
      body: "Quand l’équipe existe déjà mais que la vélocité s’effondre, nous prenons la direction technique le temps qu’il faut. Nous arbitrons l’architecture, nous tenons les revues et nous disons non aux chantiers qui n’aboutiront pas. Nous continuons à écrire du code pendant ce temps-là, sinon nous ne saurions plus de quoi nous parlons.",
    },
    {
      key: "mentorat",
      title: "Mentorat et revue de code",
      body: "Vos développeur.euse.s nous font relire leur code, nous montons avec eux un workflow IA qui tient debout et nous restons joignables pour les décisions difficiles, à un rythme qui se décide avec vous et qui change souvent en cours de route.",
    },
  ],
} as const;

/* --- S4 · NOS PLUS-VALUES ------------------------------------------------ *
 * S3 (« conviction ») no longer exists as a section. The beat numbering below
 * still maps to `.claude/work/arc.md`, so the gap is kept rather than closed.
 * ------------------------------------------------------------------------ */

export const valeurs = {
  title: [
    { text: "Traversons ensemble " },
    { text: "l’épreuve du temps", accent: true },
    { text: "." },
  ] as RichText,
  /* Ruling F8's duration lands here, under the heading that is already about
     lasting, and NOT back in `victoires.lead`: there it generalised across
     eight clients and sat inches from Chloé, an event landing built for a few
     days. Here it is the warrant for « aujourd'hui comme dans trois ans » —
     they stay long enough to live with their own architecture. No month count,
     no percentage: the underlying fact is qualitative. */
  lead: "Nous sommes fiers du code que nous livrons, aujourd’hui comme dans trois ans. Une mission dure en général un an ou plus. C’est assez pour vivre avec l’architecture que nous avons choisie et pour la corriger quand elle nous donne tort.",
  /* The old site set « Nos plus-values » over these four, and the slot has been
     empty since the rebuild. It is one of the two double meanings this house
     coined for itself, so it comes back rather than being paraphrased. */
  valuesLabel: "Nos plus-values",
  values: [
    {
      /* Back to three sentences on one subject. The F3 exclusions were parked
         here and turned the block into six unrelated claims — writing,
         estimates, no-subcontracting, who-sells-codes, capacity, address — the
         one place a reader lost the thread. The exclusions stay a single hard
         statement, but as `origine`'s third paragraph, where « choisir les gens
         qui les écrivent » has just been said. « entre Qrafters comme avec
         vous » went with the trim: it was a two-beat, and `origine` introduces
         and explains the word by itself. */
      key: "honnetete",
      title: "Honnêteté",
      body: "Zéro bullshit. Tout passe par l’écrit. Quand une estimation dérape, vous l’apprenez de nous, le jour même.",
    },
    {
      /* The page's one line of unguarded affect, and the only descendant of the
         old site's « c'est ce qui nous fait vibrer ». It is placed last in the
         block because everything it needs is already said: the optional Tuesday
         meeting, the signed blog, the guides, the opened code. It names what is
         liked — a stranger using the thing — instead of naming an emotion, so
         « passionné.e.s » never has to be written. One sentence, one section:
         the rest of the page keeps its temperature. */
      key: "curiosite",
      title: "Curiosité",
      body: "Chaque mardi matin, on se retrouve autour d’une réunion tech, et personne n’est obligé de venir. Celui qui a déniché quelque chose dans la semaine le montre aux autres. Le reste de la semaine, ce qu’on apprend, on l’écrit : le blog, les guides, le code qu’on ouvre. Quand un inconnu s’en sert, ça nous fait notre journée.",
    },
    {
      key: "robustesse",
      title: "Robustesse",
      body: "Les pépins tombent toujours un vendredi soir. Ils doivent se réparer en dix minutes, sans attendre la réunion du lundi, et tout le reste en découle : revues de code, déploiement continu, migrations réversibles, monitoring…",
    },
    {
      /* The one fragment of thesis 04 worth keeping beyond its duration: it is
         the reason simplicity is a value and not a taste, so it opens the block
         it justifies. Phrased « passe l'essentiel de sa vie à être lu » rather
         than « se lit plus souvent qu'il ne s'écrit » to spend one fewer
         two-beat. This block is now the only place « la solution la plus
         simple » is declared. */
      key: "sobriete",
      title: "Sobriété",
      body: "Un code passe l’essentiel de sa vie à être lu. Nous apportons donc la solution la plus simple à un problème donné, avec des technologies dont nous connaissons déjà les défauts, et sur l’IA nous prenons le modèle le moins cher qui fait le travail, quitte à basculer en auto-hébergé quand le volume le justifie.",
    },
  ],
} as const;

/* --- S5 · L’ARSENAL ------------------------------------------------------ */

export const arsenal = {
  title: [
    { text: "Nos " },
    { text: "armes de prédilection", accent: true },
  ] as RichText,
  subtitle: "De Rails à l’IA, on maîtrise la stack qu’il vous faut.",
  /* « que nous savons réparer, pas seulement installer » is gone — a standalone
     two-beat, and the page was carrying eleven. « Sinon » replaces the second
     « Quand… », so the two branches stop mirroring each other. */
  note: "Quand vous avez déjà une stack, nous nous y adaptons. Sinon, nous sortons celles-ci du placard. Ce sont celles que nous avons déjà vues casser.",
  groups: [
    {
      key: "backend",
      title: "Backend",
      items: [
        "Rails",
        "NestJS",
        "FastAPI",
        "Node.js",
        "Sidekiq",
        "GraphQL",
        "RSpec",
        "Rubocop",
      ],
    },
    {
      key: "data",
      title: "Base de données",
      items: ["PostgreSQL", "Redis", "pgvector"],
    },
    {
      key: "frontend",
      title: "Frontend",
      items: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "MUI",
        "shadcn/ui",
      ],
    },
    {
      key: "mobile",
      title: "Apps mobile",
      items: ["React Native", "Expo"],
    },
    {
      key: "infra",
      title: "Hosting & infra",
      items: [
        "Scalingo",
        "Heroku",
        "Vercel",
        "AWS",
        "Docker",
        "GitHub Actions",
      ],
    },
    {
      key: "llms",
      title: "LLMs",
      items: ["OpenAI", "Anthropic", "Mistral", "Llama"],
    },
    {
      key: "orchestration",
      title: "Orchestration & RAG",
      items: ["LangChain", "LangGraph", "pgvector"],
    },
    {
      key: "devtools",
      title: "Dev tools",
      items: ["Claude Code", "Cursor", "MCP"],
    },
  ],
} as const;

/* --- S6 · QUI NOUS SOMMES — le pivot ------------------------------------- */

export const origine = {
  /** Same words, now segmented so the place carries the accent every other
   *  section heading carries. Set at the section display anchor (M4). */
  dateline: [
    { text: "Marseille", accent: true },
    { text: ", 2020." },
  ] as RichText,
  paragraphs: [
    [
      {
        text: "Alexis et Nicolas ont une dizaine d’années de développement derrière eux quand ils se rencontrent dans une startup fintech incubée par Meta. Après plusieurs projets ensemble, ils décident de s’associer autour de valeurs communes en 2020 : Qraft est né.",
      },
    ] as RichText,
    [
      {
        text: "Ils voulaient leur propre atelier : choisir les projets, choisir la façon de les construire et choisir les gens qui les écrivent. Six ans plus tard, nous sommes trois, et nous n’avons pas changé d’avis.",
      },
    ] as RichText,
    /* Ruling F3's three exclusions — « pas d'offshore » was never confirmed and
       is not gestured at. One sentence, so they cannot be read as three
       separate asides, and placed here rather than in `valeurs.honnetete`
       because the sentence directly above has just said « choisir les gens qui
       les écrivent » and this is what that choice costs. « toujours à
       Marseille » left the paragraph above so the place is claimed once.
       The address moved to the invitation heading, where there is a door. */
    [
      {
        text: "Pas de sous-traitance, pas de junior seul sur un projet, tout le monde à Marseille : la personne qui vous explique l’architecture au premier rendez-vous est celle qui écrira le premier commit, et ça limite ce que nous pouvons prendre à la fois.",
      },
    ] as RichText,
    [
      {
        text: "Entre nous, on dit « les Qrafters », un mot de maison qui ne veut rien dire ailleurs et auquel on tient précisément pour ça.",
      },
    ] as RichText,
    [
      {
        text: "Nous recrutons aussi bien des femmes et des hommes en reconversion, formé.e.s dans des bootcamps comme ",
      },
      { text: "Le Wagon", href: "https://www.lewagon.com/fr" },
      { text: ", que des ingénieur.e.s issu.e.s d’écoles spécialisées comme " },
      { text: "Epitech", href: "https://www.epitech.eu/" },
      {
        text: ". Une équipe qui se ressemble trop finit par se tromper ensemble.",
      },
    ] as RichText,
  ],
  join: "Rejoignez-nous !",
  /* No pull-quote. The device is deleted, not replaced: a quotation that needs
     its article to land is exactly what a pull-quote cannot afford, and the
     client declined the alternatives. `Origine.tsx` renders paragraphs 0-1 and
     2-3 either side of where it sat; they were already continuous, so nothing
     was written to patch the seam. */
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
      key: "patio",
      alt: "Un développeur assis dehors, au soleil, devant un mur de verdure",
      caption: "Alexis, sur le patio de l’ancien bureau.",
    },
    {
      key: "balcon",
      alt: "Vue plongeante sur une rue marseillaise depuis un balcon, en plein soleil",
      caption: "Depuis le balcon du 36 rue Sainte, Marseille.",
    },
  ],
} as const;

/* --- S7 · PREUVE --------------------------------------------------------- */

export const victoires = {
  id: "proof",
  title: [
    { text: "Nos dernières " },
    { text: "victoires", accent: true },
  ] as RichText,
  /* « Voici quatre chantiers, avec ce qu'il y a dessous. » is cut — the last
     instance of the « Voici N, avec Z » mould, and the four names render
     immediately below it anyway. */
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
      note: "Chaque mois, le compte rendu d’activité part en signature chez le client, et sa validation déclenche la facture. Derrière, grover et Puppeteer tournent dans un Chromium headless, orchestrés par des workers Sidekiq. Tout le monde facture le même jour, et des dizaines de PDF partent d’un coup.",
    },
    {
      slug: "sante",
      what: "Une application mobile organise le maintien à domicile des personnes âgées, et le projet est sous NDA.",
      note: "Médecins, aides à domicile et familles voient chacun ce qui les concerne, au bon moment, depuis leur téléphone. Nous avons cadré le besoin avec les équipes métier avant d’écrire une ligne, parce qu’une tournée d’aide à domicile ne s’invente pas depuis un bureau. L’application tourne sur les deux stores.",
    },
  ],
  others:
    "Nous avons aussi construit les applications web et mobile d’Embarq, le moteur d’épargne de Bruno et la landing en sept langues d’une collection capsule Chloé, qui devait tenir un trafic international concentré sur quelques jours. Chez Episto, nous travaillons avec l’équipe produit et technique d’une plateforme d’études qui recrute ses répondants sur les réseaux sociaux.",
} as const;

/* --- S8 · INVITATION ----------------------------------------------------- */

export const invitation = {
  id: "contact",
  /* « Il y a une porte, et elle est ouverte. » was the page's one reach for a
     literary image, and it sat six words from « Le café est bon. », which works
     precisely because it does not reach. The door is real, so the heading now
     states it instead of alluding to it: the accent lands on the address, which
     is the checkable half, and the line takes a possessive subject like the
     other headings. The address left `secondaryNote` with the move — it was
     about to be said twice in the same section. */
  titleLine1: "Notre porte est ouverte,",
  titleLine2: "au 36 rue Sainte.",
  /* « si nous sommes les bonnes personnes, et si nous ne le sommes pas » was a
     mirrored two-beat. « même quand la réponse est non » concedes in one
     direction instead, which is what the sentence actually means. */
  lead: "Racontez-nous ce que vous voulez construire, ou ce qui s’est cassé. Trente minutes suffisent pour savoir si nous sommes les bonnes personnes, et nous vous le dirons même quand la réponse est non.",
  cta: { label: "Discutons de votre projet", href: `mailto:${CONTACT_EMAIL}` },
  secondary: { label: "Passez nous voir →", href: "/cowork" },
  secondaryNote: "Le cowork est à deux minutes du Vieux-Port. Le café est bon.",
} as const;
