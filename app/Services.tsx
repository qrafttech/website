import Image from "next/image";

import shiningStar from "../public/images/shining-star.svg";
import devicesDesktop from "../public/images/devices-desktop.svg";
import devicesMobile from "../public/images/devices-mobile.svg";
import Disclosure from "../components/Disclosure.client";

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
          <h2 className="bg-gradient-to-r from-[#8732c8] to-[#db73ff] bg-clip-text py-4 font-serif text-5xl font-bold text-transparent">
            Nos loyaux services
          </h2>
        </div>
        <p className="py-6">
          Qraft oeuvre principalement dans le développement de votre application
          à partir de zéro, mais peut aussi construire et encadrer techniquement
          votre équipe de développeur.euse.s.
        </p>
        <Disclosure
          title="Backend"
          content={
            <p>
              Nous développons des backend performants et résilients pour servir
              des APIs REST ou GraphQL. Nous nous basons sur des technologies
              robustes et éprouvées comme Rails ou Node.js pour servir parfois
              plus de 10,000&nbsp;req/s.
              <br />
              Pour des besoins spécifiques on pourra aussi vous proposer des
              micro-services ou des clusters Elasticsearch, mais comptez sur
              nous pour toujours choisir la solution la plus simple et
              efficace&nbsp;!
              <br />
              <br />
              Nos backends contiennent toute la logique métier de nos
              applications et sont systématiquement couverts par des tests
              unitaires et end-to-end et monitorés (erreurs et performances).
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
              intègrent un design system comme celui Material UI ou Tailwind CSS
              pour garantir une interface consistante et agréable.
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
          Nous savons recruter et encadrer votre future équipe de développeurs."
        />
        <Disclosure
          title="Design UX/UI (externe)"
          content="Qraft est composé uniquement de développeur.euse.s, mais un produit performant n&#39;est rien
           sans une bonne interface. Nous travaillons avec des designers créatifs et pragmatiques&nbsp; 
           ils connaissent les contraintes du développement et imaginent des interfaces utilisables et rapides à implémenter."
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
