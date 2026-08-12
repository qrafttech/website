import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Sora, Space_Mono } from "next/font/google";

import { SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/site";
import {
  HTML_LANG,
  LOCALES,
  OG_LOCALE,
  isLocale,
  localePath,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeAlternates } from "@/lib/i18n/metadata";
import MotionProvider from "@/components/motion/MotionProvider.client";
import Nav from "@/components/Nav.client";
import Footer from "@/components/Footer";
import "../globals.css";

/**
 * The root layout sits under `[lang]`, which is what makes `<html lang>`
 * honest: the locale is a route parameter, so it is known before the document
 * is opened. There is deliberately no `app/layout.tsx` above this one — a
 * second root would have to hardcode one language for both.
 */

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

/** Both locales, so every route under `[lang]` stays statically rendered. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const t = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: t.meta.titleTemplate },
    description: t.meta.description,
    alternates: localeAlternates(lang, "/"),
    openGraph: {
      type: "website",
      url: localePath(lang, "/"),
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      title: t.meta.title,
      description: t.meta.description,
      images: [{ url: SITE_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: [SITE_OG_IMAGE],
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        {
          url: "/favicons/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/favicons/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
      ],
      apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/favicons/site.webmanifest",
  };
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export default async function RootLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getDictionary(lang);

  return (
    <html lang={HTML_LANG[lang]} className="scroll-smooth">
      <body
        className={`${inter.variable} ${sora.variable} ${spaceMono.variable} font-sans text-base leading-normal`}
      >
        <MotionProvider>
          {/* One column at every width since N4: the navigation is a sticky
              top bar, so the shell no longer has to reserve a rail track. */}
          <div className="flex min-h-[100svh] min-w-0 flex-col">
            <Nav lang={lang} nav={t.nav} langSwitcher={t.langSwitcher} />
            <div className="flex-1">{children}</div>
            <Footer lang={lang} nav={t.nav} footer={t.footer} />
          </div>
        </MotionProvider>
        {/* Paper grain — site-wide, fixed, 0 KB JS. See `.paper-grain`
            in globals.css and scripts/gen-grain.mjs. */}
        <div className="paper-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
