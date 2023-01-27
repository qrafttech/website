import Image from "next/image";

import dancingStar from "../../public/images/dancing-star.svg";
import embarqScreenshot from "../../public/images/embarq-screenshot.jpg";
import cevidentiaScreenshot from "../../public/images/cevidentia-screenshot.jpg";
import easiwareScreenshot from "../../public/images/easiware-screenshot.jpg";
import brunoScreenshot from "../../public/images/bruno-screenshot.jpg";
import PortfolioItem from "./PortofolioItem";

export default function Portfolio() {
  return (
    <>
      <div className="relative w-full text-center">
        <Image
          src={dancingStar}
          alt="Little star dancing with light rays"
          className="absolute -top-12 -left-32"
        />
        <h2 className="bg-gradient-to-r from-[#e77c40] to-[#f8c618] bg-clip-text p-6 font-serif text-5xl font-bold text-transparent">
          Nos dernières victoires
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-12 py-28 md:grid-cols-2">
        <PortfolioItem
          title="Embarq"
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
          title="C'Evidentia"
          image={
            <Image
              src={cevidentiaScreenshot}
              alt="Screenshot of the C'Evidentia e-commerce website and application"
              placeholder="blur"
            />
          }
          description="Application d'essayage et de vente lunettes en ligne :
          essayage virtuel, prise de mesures, paiement du reste à charge,
          gestion des stocks, signature électronique."
          stack="Rails API (REST), Postgres, Redis, Next.js, MUI, Heroku, AWS"
          integrations="Docusign, ActiveCampaign, Stripe, Postmark"
        />
        <PortfolioItem
          title="easiware"
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
          title="Bruno"
          image={
            <Image
              src={brunoScreenshot}
              alt="Screenshot of the Bruno fintech app"
              placeholder="blur"
            />
          }
          description="Micro-épargne intelligente basée sur une analyse de vos dépenses
           via de l'intelligence artificielle. Bruno met de côté automatiquement sur 
           des produits d'épargne mais ne vous met jamais dans le rouge."
          stack="Rails API (REST), Postgres, Redis, Flask, NumPy, Pandas, React, React Native, Expo, Heroku, AWS"
          integrations="Budget Insight, GoCardless, Postmark"
        />
      </div>
    </>
  );
}
