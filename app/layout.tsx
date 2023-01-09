import { Montserrat, Sora } from "@next/font/google";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
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
        className={`${montserrat.variable} ${sora.variable} font-sans font-medium`}
      >
        {children}
      </body>
    </html>
  );
}
