import type { Metadata } from "next";
import { Montserrat, Sora } from "next/font/google";
import localFont from "next/font/local";

import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
} from "../lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/favicons/site.webmanifest",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});
const scribbleNote = localFont({
  src: "../public/fonts/scribble-note.ttf",
  variable: "--font-scribble",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${montserrat.variable} ${sora.variable} ${scribbleNote.variable} font-sans text-base font-medium`}
      >
        {children}
      </body>
    </html>
  );
}
