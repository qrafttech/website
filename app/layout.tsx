import { Montserrat } from "@next/font/google";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className={`${montserrat.variable} font-sans font-medium`}>
        {children}
      </body>
    </html>
  );
}
