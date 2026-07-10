# Épure redesign — implementation spec

Basis: `docs/design/alts/alt-b-epure.html` (chosen direction "B · Épure").
Status: plan agreed 2026-07-10 — implementation not started.

## Scope

- **Landing `/`**: rebuilt 1:1 from the proto (hero quadrants + terminal, Offres
  grid with team faces, blog ticker, rotor Apps/Agentic/Équipes, Proof, Ways,
  Final CTA, footer).
- **Blog index, blog post, cowork, 404**: keep their current layout structure,
  reskinned with the épure system (tokens, fonts, new header/footer, restyled
  cards and typography).
- **Out of scope**: the cowork "photo-labels" bento redesign (separate later
  project); a `/realisations` page with the full case-study list (noted
  follow-up).

## Design system

- **Tokens in `tailwind.config.js`** (orange/gold deleted):
  canvas `#fbfbf8`, ink `#000`, ink2 `#09090b`, muted `#3f3f47`,
  navy `#08143f`, hair `#e4e3de`, line `#cdccc3`, chip `#f5f4ef`,
  tint `#eceae2`, blue `#2650e1`; easing `cubic-bezier(0.65, 0, 0.15, 0.99)`.
- Complex keyframes still needed in `globals.css` (tick, tpulse, caret,
  scrolldown, qbob); entrance/reveal effects move to Motion (below); everything
  else is Tailwind utilities.
- **Fonts via `next/font/google`**: Sora → display/headings, Inter → body,
  Space Mono → mono (eyebrows, labels, terminal). Montserrat and Scribble Note
  (`public/fonts/scribble-note.ttf`, `font-scribble`) are removed.

## Shell

- **Header** (new, replaces `Menu.client.tsx` styling): Offres, Agents,
  Réalisations, Blog, Cowork + CTA « Discutons ». Anchor links resolve from
  other pages as `/#offres`, `/#agents`, `/#proof`.
- **Mobile nav**: hamburger opening an épure panel (canvas background, hairline
  dividers, Sora links, blue hover); all 5 links + CTA reachable. Reuse the
  Headless UI toggle logic from the existing menu.
- **Footer** (new shared component, per proto): Offres / Qraft / Contact
  columns + brand bottom row. Contact column = `hello@qraft.tech` only —
  no LinkedIn/GitHub links until real URLs exist. Cowork linked in footer.

## Motion libraries

Principle: don't redevelop behaviour a maintained library already provides;
hand-roll only what no library covers.

- **Motion** (`motion` ^12, `motion/react` — React 18 OK): all reveal-once and
  entrance animations (hero line rise, fades, staggered Offres tiles, Ways
  bars) via `whileInView` + `viewport={{ once: true }}` and stagger. Built-in
  `useReducedMotion` replaces the proto's `noanim` class plumbing. Import via
  `LazyMotion` + `m` to keep the bundle small.
- **Embla Carousel** (`embla-carousel-react` + `embla-carousel-autoplay` ^8):
  the rotor. Loop, prev/next, slide transitions, drag/swipe on mobile (free
  upgrade over the proto), autoplay with `stopOnMouseEnter`/`stopOnFocusIn`
  for the hover/focus pause; the 7s progress bars driven from the Autoplay
  plugin's timer. Replaces ~100 lines of bespoke rotor JS from the proto.
- **Ticker**: stays the proto's pure-CSS marquee (zero JS is the cheapest
  possible). Fallback if dynamic Notion titles make the CSS loop janky:
  `react-fast-marquee` (~2 kB).
- **Terminal**: stays a custom client component — no library covers this
  bespoke sequence; it is self-contained.
- Explicitly **not** added: GSAP, Lenis, Swiper — épure has no scroll-jack or
  smooth-scroll needs; they'd be dead weight.

## Landing sections

- **Hero**: quadrant grid per proto; terminal (q3) ported as a client component
  (typed steps, spinner footer, session loop) with the proto's static
  `prefers-reduced-motion` variant.
- **Ticker**: server component fetching the latest ~6 FR articles via
  `lib/notion.ts` `getArticles` (existing `"use cache"` + `blog-list` tag);
  items link to `/blog/[slug]`; renders nothing on empty/error.
- **Rotor**: client component on Embla (loop, autoplay, pause, swipe — see
  Motion libraries above), keeping the proto's visual language (progress-bar
  dots, prev/next arrows, slide content stagger).
- **Proof**: the proto's 3 stories — C'Evidentia, easiware, Embarq — each
  linking to its existing qrafttech.notion.site case study (`detailsUrl` from
  the old Portfolio). Santé, Chloé, Billi, Bruno are dropped from the landing.
  Proofline keeps Episto / Smartbox as plain text.
- Reveal-once and reduced-motion handling via Motion (see Motion libraries
  above) instead of the proto's IntersectionObserver + `noanim` plumbing.
  Photos/logos use `next/image`.

## i18n

- FR copy only ships, but **all UI copy is externalized** — no hardcoded
  strings in components.
- Mechanism: typed dictionaries, no library (official Next.js App Router
  pattern). `lib/i18n/fr.ts` exports one nested copy object (hero, offres,
  rotor, proof, ways, final, footer, blog, cowork…) satisfying a `Dictionary`
  type; components get their slice via `getDictionary(locale)`.
- No locale routing, no `/en` URLs, no switcher yet. EN launch later =
  write `en.ts` (type-checked complete) + add `[lang]` routing.

## SEO / metadata

- Titles, descriptions, OG copy rewritten around « La qualité, augmentée par
  l'IA » and the three offers (apps, agents, équipes).
- JSON-LD kept (Organization on landing, LocalBusiness on cowork) with
  refreshed description text. Routes unchanged.

## Cleanup

Deleted once unimported: Cover, CoverBackground, Services, Values, Value,
Stack, StackGroup, Team, Portfolio, PortofolioItem, CallToAction, BlogPreview,
Animation.client, `@rive-app/react-canvas` dep.
Kept and reskinned: BlogCard, Pagination, NotionRenderer, PageHero,
CoworkGallery.client, JsonLd, Disclosure.client, Logo, FluidContainer as
needed.

## Rollout

Fresh branch `feat/epure-redesign` off `main`, one PR, reviewable commits:

1. tokens + fonts (+ i18n dictionary scaffold)
2. Header + Footer shells across all pages
3. landing sections (proto 1:1)
4. blog / cowork / 404 reskin
5. delete old components + deps

`yarn format` and `yarn lint` before each commit; verify in browser
(landing at mobile + desktop widths, blog, cowork) before the PR.
