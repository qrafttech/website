# Design — Qraft

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Identity (locked — "épure")

The épure identity predates this file and is preserved verbatim: tokens live in
`tailwind.config.js`, fonts in `app/layout.tsx`. This file locks the structural
layer added by the Split Studio redesign (2026-07-16).

## Genre

editorial

## Macrostructure family

- Marketing pages (`/`): **Split Studio** — alternating diptychs; text on one
  side, proof (terminal, portraits, ledger) on the other; direction flips down
  the page. Vertical hairline divider between halves on desktop. Exception
  (fold E2, 2026-07-16): the `/` hero is a full-viewport `panel` with the
  chrome-less terminal stream as background and the crew as inline proof.
- Content pages (`/blog`, `/blog/[slug]`): **Long Document** — diptych page
  head (title left / lede right), then ruled ledger lists or prose at measure.
- Case pages (`/realisations/[slug]`): locked to the client-proto layout —
  excluded from structural rotation.
- Utility pages (`/cowork`, 404): follow the content-page voice; the cowork
  photo-labels bento is a separate future project.

## Theme

Tailwind tokens (hex, locked — do not convert or retune):

- `canvas #fbfbf8` — paper
- `sand #f4f3ed` / `band #f0efe9` / `panel #f0f1f4` — secondary surfaces
- `ink #000000` / `ink2 #09090b` — text (locked identity choice)
- `muted #3f3f47` — secondary text
- `hair #e4e3de` / `line #cdccc3` / `rule #dcdee3` — hairlines
- `blue #2650e1` — the single accent, ≤ 5 % of any viewport
- `chip #f5f4ef` / `tint #eceae2` — chips and image placeholders
- `term.ok #1f8f52` / `term.del #c0304a` — status and diff accents
- `stream.txt #8f908a` / `stream.dim #b8b9b4` — hero background stream greys

## Typography

- Display: Sora (`font-display`), weight 600–700, roman only — never italic
  headers; letter-spacing −0.03em (set globally on h1–h3)
- Body: Inter (`font-sans`), weight 400
- Mono: Space Mono (`font-mono`) — labels, colophon, terminal; uppercase
  tracking 0.08em for labels
- Section display anchor: `clamp(2rem, 5vw, 4rem)`; hero anchor
  `clamp(2.125rem, 4.8vw, 4.625rem)`

## Spacing

Tailwind 4-pt utilities. Section blocks breathe at `py-24` /
`nav:py-[9.375rem]`; diptych gutters at `clamp(1.5rem, 3.2vw, 3.25rem)`.
Rhythm is deliberately uneven — the final CTA and 404 run larger.

## Motion

- Easing: `cubic-bezier(0.65, 0, 0.15, 0.99)` (`ease-epure` / `lib/motion.ts EASE`)
- One orchestrated hero entrance on mount (RiseLine + Reveal), then at most
  one reveal-once per major section. No stagger on ledger rows.
- Functional loops only: terminal, ticker marquee.
- Reduced motion: global 0.01ms clamp in `globals.css` + `useReducedMotion`
  in client components.

## Microinteractions stance

- Silent success; no celebratory toasts.
- Hover = one signal (colour shift or 1px arrow translate — never both plus
  scale). Ledger rows: title → blue + arrow translate-x is the locked pattern.
- Focus: `outline-2 outline-offset-[3px] outline-blue`, never animated.

## CTA voice

- Primary: `CtaLink` — rectangular blue fill, hover → ink. Copy is a verb
  ("Discutons", "Voir nos réalisations").
- Secondary/inline: `MonoLink` / typographic `→` link. `→` = internal,
  `↗` = external (locked semantics).

## Nav — N3 side-rail (fold E2, 2026-07-16)

Sticky full-height left rail (5.75rem, canvas bg, hairline right rule):
q_pixel glyph on top, vertical-rl mono links centered via auto margins, blue
8px square dot pinned at the bottom. Mobile: single sticky top bar (glyph
left, inline mono links right, no hamburger, no dot). Links: Offres ·
Réalisations · Blog · Cowork. The « Discutons » CTA lives in the hero
topline, not the nav.

## Footer — Ft4 dense colophon

One Space Mono colophon block (tagline · build credits · copyright) with an
inline mono link row above it. No link columns, no social icon row.

## What pages MUST share

- The wordmark (`Brand`), the blue accent and its ≤5 % discipline.
- Sora/Inter/Space Mono roles.
- CTA voice and arrow semantics.
- Hairline rule language (`hair`/`line`), no card shadows except the locked
  Offres-hover elevation.

## What pages MAY differ on

- Macrostructure within the page-type family.
- Which side of the diptych carries the proof.
- Secondary surface (`sand`/`band`/`panel`) per section — max one band change
  between adjacent sections.

## Per-page allowances

- Marketing pages MAY use the terminal, portraits, and stack icons as proof
  panels. No new enrichment tiers without amending this file.
- Content pages: typography only.
- No invented metrics, no testimonials that don't exist, no logo walls beyond
  the clients actually named in `lib/i18n/fr/clients.ts`.
