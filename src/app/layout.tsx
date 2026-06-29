import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/data/config";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: `${siteConfig.nome} — ${siteConfig.tagline} em ${siteConfig.cidade}`,
  description: `${siteConfig.nome} oferece tratamentos faciais, corporais e de beleza em ${siteConfig.cidade}. Agende seu horário online.`,
  openGraph: {
    title: `${siteConfig.nome} — ${siteConfig.tagline}`,
    description: `Agende seu horário online na ${siteConfig.nome}.`,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jost.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
