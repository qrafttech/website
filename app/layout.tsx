import { Montserrat, Sora } from "@next/font/google";
import localFont from "@next/font/local";

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
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head />
      <body
        className={`${montserrat.variable} ${sora.variable} ${scribbleNote.variable} font-sans font-medium`}
      >
        {children}
      </body>
    </html>
  );
}
