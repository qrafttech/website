import type { RichText } from "@/lib/i18n/types";

export const nav = {
  brandLabel: "Qraft",
  railLabel: "Navigation principale",
  links: [
    { label: "Offres", href: "/#offres" },
    // The door to the people. Without it nothing in the nav points at the
    // humans, and the origin section has no signpost.
    { label: "Équipe", href: "/#origine" },
    { label: "Réalisations", href: "/#proof" },
    { label: "Blog", href: "/blog" },
    { label: "Cowork", href: "/cowork" },
  ],
} as const;

/**
 * The build credit — Ft4's colophon line (`design.md:94-96`: one Space Mono
 * block, tagline · build credits · copyright). Single source of truth: the
 * footer owns it, and `landing.ts` re-exports it only until the duplicate
 * render at the bottom of `Invitation.tsx` is removed.
 */
export const COLOPHON =
  "Conçu, écrit et codé au 36 rue Sainte, Marseille — par Nicolas, Alexis et Adrien.";

export const footer = {
  tagline: [
    { text: "Q", accent: true },
    { text: `rafting agentic software depuis 2020. ${COLOPHON}` },
  ] as RichText,
  contact: "Écrivez-nous :",
  copyright: "© Qraft 2026",
} as const;
