import Image from "next/image";

import shiningStar from "../public/images/shining-star.svg";
import Disclosure from "../components/Disclosure.client";

export default function Services() {
  return (
    <>
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
        Qraft oeuvre principalement dans le développement de votre application à
        partir de zéro, et possède une expertise en langages bas niveau (C),
        compilateurs, DevOps, ainsi que les langages Web les plus courants.
      </p>
      <div className="w-full py-2">
        <Disclosure
          title="Développement web"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque amet, massa auctor arcu, risus, libero tincidunt id. Diam in fermentum tincidunt elementum sed enim tortor, senectus. Turpis senectus consectetur vitae risus molestie pellentesque ultrices auctor."
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
    </>
  );
}
