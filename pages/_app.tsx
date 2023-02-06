import type { AppProps } from "next/app";
import { Montserrat, Sora } from "@next/font/google";
import localFont from "@next/font/local";

import Head from "../components/head";

import "../globals.css";

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

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <html lang="fr" className="scroll-smooth">
      <Head />
      <body
        className={`${montserrat.variable} ${sora.variable} ${scribbleNote.variable} font-sans text-base font-medium`}
      >
        <Component {...pageProps} />
      </body>
    </html>
  );
}
