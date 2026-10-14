import type { StackIconSlug } from "@/lib/stack-icons";

/* ---------------------------------------------------------------------------
 * The copy contract.
 *
 * `Dictionary` is the shape every locale must fill. It is hand-written rather
 * than derived from `typeof fr` on purpose: a derived type would either freeze
 * the French *strings* into the contract (so no English value could satisfy
 * it) or, once widened, flatten the key unions below into `string` — and those
 * unions are load-bearing. `hero.team[].key`, `origine.photos[].key` and the
 * three cowork key unions are how the copy is joined to the images in
 * `public/images/`, so a locale that renamed one would silently render a hole.
 *
 * Consequences, which are the point:
 *   · a key present in FR and missing in EN is a compile error;
 *   · an extra key in EN is a compile error;
 *   · a locale that drops a team member, a photo or a cowork tile is a
 *     compile error, because the asset maps are keyed off these unions.
 *
 * `lib/i18n/fr.ts` and `lib/i18n/en.ts` each export one object of this type.
 * ------------------------------------------------------------------------ */

/* --- Rich text ----------------------------------------------------------- */

interface RichSegment {
  text: string;
  strong?: boolean;
  accent?: boolean;
  href?: string;
}

export type RichText = readonly RichSegment[];

/* --- Small shared shapes -------------------------------------------------- */

interface CtaCopy {
  label: string;
  href: string;
}

/** A titled block in a two-column ledger. `key` is a React key only.
 *  `body` accepts `RichText` for the blocks that carry an inline link. */
export interface LedgerBlock {
  key: string;
  title: string;
  body: string | RichText;
}

/* --- Shell ---------------------------------------------------------------- */

/** Nav entries are addressed by key so a locale-dependent one — the French-only
 *  blog — can be filtered without matching on `href` or on a label. */
type NavKey = "offres" | "equipe" | "realisations" | "blog" | "cowork";

export interface NavLink {
  key: NavKey;
  label: string;
  /** Locale-relative. `localeHref()` prefixes it at render time. */
  href: string;
}

/* --- Landing: hero -------------------------------------------------------- */

/** Keyed to `public/images/{nicolas,alexis,adrien}.jpeg`. */
export type TeamKey = "nicolas" | "alexis" | "adrien";

export interface TeamMember {
  key: TeamKey;
  name: string;
  role: string;
  href: string;
  linkLabel: string;
}

/* --- Landing: origine ----------------------------------------------------- */

/** Keyed to `public/images/scene-*.jpg`. */
export type OriginePhotoKey = "openSpace" | "revueDeCode" | "balcon";

interface OriginePhoto {
  key: OriginePhotoKey;
  alt: string;
  /** Mandatory. An uncaptioned photograph is decor; a captioned one is a
   *  document. `components/Figure.tsx` has no escape hatch. */
  caption: string;
}

/* --- Realisations --------------------------------------------------------- */

export interface StackItem {
  label: string;
  icon?: StackIconSlug;
}

interface ClientPoints {
  title: string;
  items: readonly string[];
}

export interface Client {
  /** Part of the URL (`/realisations/<slug>`) and the join key for
   *  `lib/client-logos.ts`, `lib/client-screenshots.ts` and
   *  `victoires.cases[].slug`. **Identical across locales.** */
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

/* --- Cowork --------------------------------------------------------------- */

export type CoworkTileKey = "openSpace" | "kitchen" | "meeting" | "callbox";

export type CoworkAmenityKey = "access" | "coffee" | "desks" | "techMeeting";

export type CoworkGalleryKey =
  | "meeting2"
  | "babyfoot"
  | "balcon"
  | "openSpace2"
  | "bureauDebout"
  | "lunch2";

/* --- The dictionary ------------------------------------------------------- */

export interface Dictionary {
  /** Per-locale document metadata for the root layout. */
  meta: {
    title: string;
    /** `%s | Qraft` — the template applied to every child page's title. */
    titleTemplate: string;
    description: string;
  };

  nav: {
    brandLabel: string;
    /** `aria-label` on the bar's link list, and on the mobile panel's. */
    label: string;
    links: readonly NavLink[];
    /** The one CTA in the bar. Persistent, which is why it left the hero. */
    cta: CtaCopy;
    /** `aria-label` on the mobile toggle, per state. */
    menuOpen: string;
    menuClose: string;
  };

  langSwitcher: {
    /** `aria-label` on the switcher group. */
    label: string;
    /** `aria-label` per destination, keyed by the locale it leads to. */
    toLocale: Record<"fr" | "en", string>;
  };

  footer: {
    tagline: RichText;
    contact: string;
    copyright: string;
  };

  hero: {
    titleLine1: string;
    titleLine2: RichText;
    lead: string;
    cta: CtaCopy;
    team: readonly TeamMember[];
  };

  ticker: {
    label: string;
    bylinePrefix: string;
    metaSeparator: string;
    more: CtaCopy;
  };

  offre: {
    /** Anchor id. Shared across locales — the nav hrefs point at it. */
    id: string;
    title: RichText;
    /** Two beats: the argument, then what we sell. Rendered as one `<p>` each. */
    lead: readonly string[];
    blocks: readonly LedgerBlock[];
  };

  valeurs: {
    title: RichText;
    lead: string;
    values: readonly LedgerBlock[];
  };

  arsenal: {
    title: RichText;
    subtitle: string;
    note: string;
    /** `items` reuses `StackItem`, so the arsenal and the case-study stacks
     *  draw their marks from one icon set. `icon` is optional on purpose: a
     *  brand with no usable official SVG (OpenAI, pgvector, RSpec, Llama)
     *  renders as a label-only chip rather than being dropped from the list
     *  or given an invented mark. */
    groups: readonly {
      key: string;
      title: string;
      items: readonly StackItem[];
    }[];
  };

  origine: {
    dateline: RichText;
    paragraphs: readonly RichText[];
    join: string;
    photos: readonly OriginePhoto[];
  };

  victoires: {
    id: string;
    title: RichText;
    lead: string;
    stackLabel: string;
    integrationsLabel: string;
    cases: readonly {
      /** Must match a `clients[].slug`, or the case is dropped. */
      slug: string;
      what: string;
      note: string;
    }[];
    others: string;
  };

  invitation: {
    id: string;
    titleLine1: string;
    titleLine2: string;
    /** The line under the heading, carrying the section's only inline link —
     *  the word « cowork » itself points at `/cowork`. It replaced a separate
     *  secondary CTA that said « Passez nous voir » one line below a heading
     *  already inviting the reader in. */
    subtitle: RichText;
    lead: string;
    cta: CtaCopy;
    secondaryNote: string;
  };

  blog: {
    title: string;
    subtitle: string;
    metaDescription: string;
    backToArticles: string;
    /** Link to the article's twin in the other locale, in THAT language. */
    translation: string;
    empty: string;
    /** Shown before the date of an unpublished article, outside production. */
    status: { scheduled: string; draft: string };
    pagination: {
      label: string;
      previous: string;
      next: string;
    };
    notFound: {
      title: string;
      body: string;
      cta: string;
    };
  };

  notFound: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };

  caseUi: {
    stack: string;
    integrations: string;
    backToClients: string;
    project: string;
    role: string;
    ctaTitle: string;
    ctaLabel: string;
    /** `alt` for a project screenshot; `%s` is replaced by the client name. */
    screenshotAlt: string;
  };

  clients: readonly Client[];

  cowork: {
    title: string;
    metaTitle: string;
    subtitle: string;
    description: string;
    stats: readonly { value: string; label: string }[];
    spaces: {
      title: string;
      tiles: readonly {
        key: CoworkTileKey;
        title: string;
        body: string;
        alt: string;
      }[];
    };
    amenities: {
      title: string;
      items: readonly {
        key: CoworkAmenityKey;
        label: string;
        body: RichText;
      }[];
    };
    gallery: {
      title: string;
      zoomLabel: string;
      closeLabel: string;
      photos: readonly { key: CoworkGalleryKey; alt: string }[];
    };
    residents: {
      title: string;
      body: RichText;
    };
    location: {
      title: string;
      street: string;
      postalCode: string;
      city: string;
      points: readonly string[];
      mapTitle: string;
    };
    pricing: {
      badge: string;
      price: string;
      priceAmount: string;
      period: string;
      offerName: string;
      offerDescription: string;
      intro: string;
      includes: readonly string[];
      cta: CtaCopy;
      nudge: RichText;
    };
    final: {
      title: string;
      lead: string;
      cta: CtaCopy;
    };
  };
}
