import type { RichText } from "@/lib/i18n/types";

export const nav = {
  brandLabel: "Qraft",
  railLabel: "Navigation principale",
  links: [
    { label: "Offres", href: "/#offres" },
    { label: "Réalisations", href: "/#proof" },
    { label: "Blog", href: "/blog" },
    { label: "Cowork", href: "/cowork" },
  ],
} as const;

export const footer = {
  tagline: [
    { text: "Q", accent: true },
    {
      text: "rafting agentic software. La qualité, augmentée par l’IA.",
    },
  ] as RichText,
  colophon:
    "Composé en Sora, Inter et Space Mono. Construit avec Next.js. Écrivez-nous :",
  copyright: "© Qraft 2026",
} as const;
