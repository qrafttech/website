import Image from "next/image";

import dancingStar from "../../public/images/dancing-star.svg";
import embarqScreenshot from "../../public/images/embarq-screenshot.jpg";
import cevidentiaScreenshot from "../../public/images/cevidentia-screenshot.jpg";
import easiwareScreenshot from "../../public/images/easiware-screenshot.jpg";
import billiScreenshot from "../../public/images/billi-screenshot.jpg";
import brunoScreenshot from "../../public/images/bruno-screenshot.jpg";
import chloeScreenshot from "../../public/images/chloe-screenshot.jpg";

import PortfolioItem from "./PortofolioItem";
import SectionTitle from "./SectionTitle";

export default function Portfolio() {
  return (
    <>
      <div className="relative w-full text-center">
        <Image
          src={dancingStar}
          alt="Little star dancing with light rays"
          className="absolute -top-12 -left-32 animate-grow-and-shrink"
        />
        <SectionTitle className="from-[#e77c40] to-[#f8c618] p-6">
          Nos dernières victoires
        </SectionTitle>
      </div>
      <div className="grid grid-cols-1 gap-12 py-28 md:grid-cols-2">
        <PortfolioItem
          title="Chloe"
          detailsUrl="https://www.notion.so/qrafttech/Chlo-1f9218ed56d780d891b3e9332b92974a"
          image={
            <Image
              src={chloeScreenshot}
              alt="Screenshot of Chloe landing page"
              placeholder="blur"
            />
          }
          description="Creation d'une landing page evenementielle, disponible en 7 langues, pour accompagner le lancement digital d'une collection capsule resort de la Maison Chloe."
          stack="Next.js, Tailwind CSS, AWS"
        />
        <PortfolioItem
          title="Billi"
          detailsUrl="https://qrafttech.notion.site/Billi-113218ed56d780fc80b2e505d206aa5b"
          companyUrl="https://billi.so"
          image={
            <Image
              src={billiScreenshot}
              alt="Screenshot of Billi application"
              placeholder="blur"
            />
          }
          description="
          Application SaaS conçue pour simplifier la gestion des cabinets de freelances et 
          des entreprises de management intérimaire : automatisation des tâches administratives
           comme la génération de contrats, factures, notes de frais, et compte-rendu d’activités."
          stack="Rails API, Postgres, Redis, Next.js, Tailwind CSS, Scalingo, AWS"
          integrations="YouSign, Postmark"
        />
        <PortfolioItem
          title="C'Evidentia"
          detailsUrl="https://qrafttech.notion.site/C-Evidentia-113218ed56d78053a1e2f7759ed2e8f8"
          companyUrl="https://cevidentia.com"
          image={
            <Image
              src={cevidentiaScreenshot}
              alt="Screenshot of the C'Evidentia e-commerce website and application"
              placeholder="blur"
            />
          }
          description="Application d'essayage et de vente de lunettes en ligne :
          essayage virtuel, prise de mesures, paiement du reste à charge,
          gestion des stocks, signature électronique."
          stack="Rails API (REST), Postgres, Redis, Next.js, MUI, Heroku, AWS"
          integrations="Docusign, ActiveCampaign, Stripe, Postmark"
        />
        <PortfolioItem
          title="easiware"
          detailsUrl="https://qrafttech.notion.site/easiware-119218ed56d7800b8a3de88b12da2619"
          companyUrl="https://easiware.com"
          image={
            <Image
              src={easiwareScreenshot}
              alt="Screenshot of the easiware customer care solution"
              placeholder="blur"
            />
          }
          description="Outil conversationnel multicanal pour gérer le support client.
          La solution easiware permet à un client d'interagir avec ses consommateurs par
           chat, email, WhatsApp et aux conseillers clients d'organiser tout le cycle de vie d'une demande."
          stack="Node.js (REST + WebSockets), NestJS, Postgres, Redis, Next.js, MUI, Heroku, AWS"
          integrations="Auth0, Postmark"
        />
        <PortfolioItem
          title="Embarq"
          detailsUrl="https://qrafttech.notion.site/Embarq-118218ed56d780e19285de1f8de1d95f"
          companyUrl="https://embarq.fr"
          image={
            <Image
              src={embarqScreenshot}
              alt="Screenshot of the Embarq application"
              placeholder="blur"
            />
          }
          description="Application de gestion de portage salarial à destination des
        administrateurs (B2B) et des salariés portés (B2C). Edition de
        contrats, génération de factures, signature électronique,
        Compte-rendu d'activité, Notes de frais..."
          stack="Rails API, Postgres, Redis, GraphQL, Next.js, MUI, Heroku, AWS"
          integrations="Docusign, Upflow, Sendgrid"
        />
        <PortfolioItem
          title="Bruno"
          image={
            <Image
              src={brunoScreenshot}
              alt="Screenshot of the Bruno application"
              placeholder="blur"
            />
          }
          description="Micro-épargne intelligente basée sur une analyse de vos dépenses via de l'intelligence artificielle. Bruno met de côté automatiquement sur des produits d'épargne mais ne vous met jamais dans le rouge."
          stack="Rails API (REST), Postgres, Redis, Flask, NumPy, Pandas, React, React Native, Expo, Heroku, AWS"
          integrations="Budget Insight, GoCardless, Postmark"
        />
      </div>
    </>
  );
}
