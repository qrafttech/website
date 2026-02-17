import type { Metadata } from "next";
import { Montserrat, Sora } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

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
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qraft - Construisons ensemble des applications de qualit\u00e9",
  description:
    "Qraft est une \u00e9quipe d'expert.e.s techniques qui vous accompagnent dans la construction de votre application web, mobile, API ou infrastructure.",
  openGraph: {
    type: "website",
    url: "https://qraft.tech",
    title: "Qraft - Construisons ensemble des applications de qualit\u00e9",
    description:
      "Qraft est une \u00e9quipe d'expert.e.s techniques qui vous accompagnent dans la construction de votre application web, mobile, API ou infrastructure.",
    images: ["/favicons/thumbnail.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qraft - Construisons ensemble des applications de qualit\u00e9",
    description:
      "Qraft est une \u00e9quipe d'expert.e.s techniques qui vous accompagnent dans la construction de votre application web, mobile, API ou infrastructure.",
    images: ["/favicons/thumbnail.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/site.webmanifest",
};

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
