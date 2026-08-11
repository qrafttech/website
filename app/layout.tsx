import type { Metadata } from "next";
import { Inter, Sora, Space_Mono } from "next/font/google";

import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
} from "@/lib/site";
import MotionProvider from "@/components/motion/MotionProvider.client";
import Rail from "@/components/Rail";
import Footer from "@/components/Footer";
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

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${sora.variable} ${spaceMono.variable} font-sans text-base leading-normal`}
      >
        <MotionProvider>
          <div className="grid min-h-[100svh] grid-cols-1 nav:grid-cols-[5.75rem_minmax(0,1fr)]">
            <Rail />
            <div className="flex min-w-0 flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </div>
        </MotionProvider>
        {/* Paper grain — site-wide, fixed, 0 KB JS. See `.paper-grain`
            in globals.css and scripts/gen-grain.mjs. */}
        <div className="paper-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
