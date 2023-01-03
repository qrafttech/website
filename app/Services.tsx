import Image from "next/image";

import shiningStar from "../public/images/shining-star.svg";

export default function Services() {
  return (
    <div className="container mx-auto pt-16">
      <div className="relative">
        <Image
          src={shiningStar}
          alt="Shining star for decoration"
          className="absolute -top-8 -left-16 max-md:hidden"
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
    </div>
  );
}
