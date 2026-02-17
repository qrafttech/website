import Image from "next/image";

import shiningStar from "../../public/images/shining-star.svg";
import devicesDesktop from "../../public/images/devices-desktop.svg";
import devicesMobile from "../../public/images/devices-mobile.svg";
import Disclosure from "../../components/Disclosure.client";
import SectionTitle from "./SectionTitle";

export default function Services() {
  return (
    <div className="flex items-center max-lg:flex-col-reverse">
      <div className="flex-[6_6_0%] py-2">
        <div className="relative">
          <Image
            src={shiningStar}
            alt="Shining star for decoration"
            className="absolute -top-8 -left-16 max-lg:hidden"
          />
          <SectionTitle className="from-[#8732c8] to-[#db73ff] py-4">
            Nos loyaux services
          </SectionTitle>
        </div>
        <p className="py-6">
          Qraft oeuvre principalement dans le développement de votre application
          à partir de zéro - du backend à l&#39;IA - mais peut aussi construire
          et encadrer techniquement votre équipe de développeur.euse.s.
        </p>
        <Disclosure
          title="Backend"
          content={
            <p>
              Nous concevons des backends robustes avec Rails et Node.js :
              APIs REST ou GraphQL, jobs asynchrones, intégrations tierces et
              pipelines IA.
              <br />
              <br />
              Notre philosophie : la solution la plus simple qui tient en
              production. Pas de micro-services quand un monolithe bien
              structuré suffit, pas d&#39;infrastructure sur-dimensionnée quand
              une architecture classique fait le travail.
              <br />
              <br />
              Tout ce qu&#39;on livre est testé, monitoré et pensé pour évoluer
              avec votre produit.
            </p>
          }
          defaultOpen
        />
        <Disclosure
          title="Frontend (Web / Apps Mobile)"
          content={
            <p>
              Chez Qraft on est fans de <strong>React</strong>. React permet de
              construire des applications web complexes et interactives et de
              vraies applications mobiles <strong>iOS</strong> et{" "}
              <strong>Android</strong> (avec <strong>React Native</strong>) en
              s&#39;appuyant sur un énorme écosystème de librairies et
              composants.
              <br />
              Toutes nos applications sont responsives, mobile-first et
              intègrent un design system comme celui de Material UI ou Tailwind
              CSS pour garantir une interface cohérente et agréable.
            </p>
          }
        />
        <Disclosure
          title="Intelligence Artificielle"
          content={
            <p>
              Côté IA : nous intégrons des LLMs (GPT, Claude, modèles
              open-source) dans vos applications, construisons des systèmes de
              RAG (Retrieval-Augmented Generation) pour exploiter vos données
              métier, et développons des agents IA qui automatisent vos
              processus répétitifs.
              <br />
              <br />
              Notre approche : la même rigueur que pour le reste. Pas de démo
              magique qui ne tient pas en production, mais des intégrations
              testées, monitorées et pensées pour durer. On avance vite sur le
              sujet - et on vous embarque avec nous.
            </p>
          }
        />
        <Disclosure
          title="Mentorat"
          content="Nous sommes passionnés par notre métier qui nécessite une veille assidue pour rester compétitif.
          Nous nous formons en continu pour délivrer notre apprentissage à vos équipes
          et leur donner les clés des bonnes pratiques du secteur."
        />
        <Disclosure
          title="Direction technique"
          content="Les expert.e.s de Qraft ont été CTO ou VP Engineering dans plusieurs startups.
          Nous savons recruter et encadrer votre future équipe de développeur.euse.s."
        />
        <Disclosure
          title="Design UX/UI (externe)"
          content="Qraft est composé uniquement de développeur.euse.s, mais un produit performant n&#39;est rien
           sans une bonne interface. Nous travaillons avec des designers créatifs et pragmatiques&nbsp;.
           Ils connaissent les contraintes du développement et imaginent des interfaces utilisables et rapides à implémenter."
        />
      </div>
      <Image
        src={devicesDesktop}
        alt="Illustration with a mobile phone, OMG chat bubble and a todo list"
        className="max-h-[420px] flex-[4_4_0%] pl-16 max-lg:hidden"
      />
      <Image
        src={devicesMobile}
        alt="Illustration with a mobile phone, OMG chat bubble and a todo list"
        className="py-8 lg:hidden"
      />
    </div>
  );
}
