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
          title="Développement"
          content="Nous construisons votre produit en vous proposant les technologies les plus adaptées à votre besoin. Nous avons nos préférences, alliant vélocité et robustesse, mais nous nous adaptons à vos contraintes."
          defaultOpen
        />
        <Disclosure
          title="Direction technique"
          content="Les expert.e.s de Qraft ont été CTO ou VP Engineering dans plusieurs startups. Nous savons recruter et encadrer votre future équipe de développeurs."
        />
        <Disclosure
          title="Design UX/UI (externe)"
          content="Qraft est composé uniquement de développeur.euse.s, mais un produit performant n&#39;est rien sans une bonne interface. Nous travaillons avec des designers créatifs et pragmatiques ; ils connaissent les contraintes du développement et imaginent des interfaces utilisables et rapides à implémenter."
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
