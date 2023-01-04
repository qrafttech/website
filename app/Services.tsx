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
          à partir de zéro, et possède une expertise en langages bas niveau (C),
          compilateurs, DevOps, ainsi que les langages Web les plus courants.
        </p>
        <Disclosure
          title="Développement web"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque amet, massa auctor arcu, risus, libero tincidunt id. Diam in fermentum tincidunt elementum sed enim tortor, senectus. Turpis senectus consectetur vitae risus molestie pellentesque ultrices auctor."
          defaultOpen
        />
        <Disclosure
          title="Développement mobile"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque amet, massa auctor arcu, risus, libero tincidunt id. Diam in fermentum tincidunt elementum sed enim tortor, senectus. Turpis senectus consectetur vitae risus molestie pellentesque ultrices auctor."
        />
        <Disclosure
          title="Design UX/UI (externe)"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque amet, massa auctor arcu, risus, libero tincidunt id. Diam in fermentum tincidunt elementum sed enim tortor, senectus. Turpis senectus consectetur vitae risus molestie pellentesque ultrices auctor."
        />
        <Disclosure
          title="Conseil & Mentorat"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque amet, massa auctor arcu, risus, libero tincidunt id. Diam in fermentum tincidunt elementum sed enim tortor, senectus. Turpis senectus consectetur vitae risus molestie pellentesque ultrices auctor."
        />
        <Disclosure
          title="Recrutement"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque amet, massa auctor arcu, risus, libero tincidunt id. Diam in fermentum tincidunt elementum sed enim tortor, senectus. Turpis senectus consectetur vitae risus molestie pellentesque ultrices auctor."
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
