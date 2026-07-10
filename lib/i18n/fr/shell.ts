import type { RichText } from "@/lib/i18n/types";

export const nav = {
  brandLabel: "Qraft",
  openMenu: "Ouvrir le menu",
  closeMenu: "Fermer le menu",
  cta: "Discutons",
  ctaHref: "/#contact",
  links: [
    { label: "Offres", href: "/#offres" },
    { label: "Agents", href: "/#agents" },
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
  columns: [
    {
      title: "Offres",
      links: [
        { label: "Apps", href: "/#offres" },
        { label: "Agents", href: "/#agents" },
        { label: "Équipes agentic", href: "/#offres" },
      ],
    },
    {
      title: "Qraft",
      links: [
        { label: "Réalisations", href: "/#proof" },
        { label: "Blog", href: "/blog" },
        { label: "Cowork", href: "/cowork" },
      ],
    },
    {
      title: "Contact",
      links: [{ label: "hello@qraft.tech", href: "mailto:hello@qraft.tech" }],
    },
  ],
  meta: [
    { text: "Q", accent: true },
    { text: "rafting agentic software" },
  ] as RichText,
  copyright: "© Qraft 2026",
} as const;
