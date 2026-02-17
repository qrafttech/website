import Image from "next/image";

import officeMehdiNicolas from "../../public/images/office-mehdi-nicolas.jpg";
import patioAlexisLili from "../../public/images/patio-alexis-lili.jpg";
import patioNicolas from "../../public/images/patio-nicolas.jpg";
import dinosaur from "../../public/images/dinosaur.svg";
import marseille from "../../public/images/marseille.svg";
import bubbles from "../../public/images/bubbles.svg";
import cloud from "../../public/images/cloud.svg";
import SectionTitle from "./SectionTitle";

export default function Team() {
  const email = "hello@qraft.tech";
  const subject = "Hello Qraft - J'aimerais vous rejoindre !";

  return (
    <div className="grid grid-cols-2 py-16">
      <div className="col-span-full lg:col-span-1">
        <Image
          src={dinosaur}
          alt="Illustration of a dinosaur screaming 'Whoa!'"
          className="py-2"
        />
        <SectionTitle className="from-[#048e33] to-[#04b23f] py-6">
          Les devs sur le front, comme sur le back&nbsp;!
        </SectionTitle>
        <p className="pb-6">
          <strong>Alexis</strong> et <strong>Nicolas</strong> ont une dizaine
          d&#39;années d&#39;expériences dans le développement et se sont
          rencontrés au sein d&#39;une startup fintech incubée par Facebook.
          Après avoir travaillé ensemble sur plusieurs projets, ils décident de
          s&#39;associer autour de valeurs communes en 2020&nbsp;:{" "}
          <strong>Qraft</strong> est né.
        </p>
        <p>
          Qraft s&#39;est construit autour de l&#39;idée qu&#39;une équipe de
          développeurs.euses <strong>talentueux.ses et passionné.e.s</strong>{" "}
          doit être composée de profils variés et issus de parcours différents.{" "}
          <strong>La diversité est une force</strong>&nbsp;: nous recrutons des
          hommes et des femmes à fort potentiel, en reconversion vers le
          développement à travers des bootcamps de code reconnus comme{" "}
          <a
            className="underline"
            target="_blank"
            href="https://www.lewagon.com"
            rel="noreferrer"
          >
            Le Wagon,
          </a>{" "}
          tout comme des ingénieur.e.s issu.e.s d&#39;écoles spécialisées, comme{" "}
          <a
            className="underline"
            target="_blank"
            href="https://www.epitech.eu"
            rel="noreferrer"
          >
            Epitech
          </a>
          .
        </p>
        <a
          href={`mailto:${email}?subject=${subject}`}
          target="_blank"
          rel="noreferrer"
        >
          Rejoignez-nous&nbsp;!
        </a>
      </div>
      <div className="col-span-full flex flex-col items-center justify-end lg:col-span-1">
        <div className="relative mb-4 flex items-center justify-center max-xl:pt-8">
          <Image src={cloud} alt="Cloud to mimic a comic chat bubble" />
          <p className="absolute font-scribble text-lg uppercase text-[#059034]">
            N&#39;oublions pas les tests...
          </p>
          <Image
            src={bubbles}
            alt="Bubbles to mimic a comic chat bubble"
            className="absolute inset-x-2/3 -bottom-10 z-10"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:max-lg:gap-8 lg:gap-4 lg:px-8">
          <div className="row-span-2 flex">
            <Image
              src={patioNicolas}
              alt="Picture of Nicolas from above in a the patio with a laptop looking surprised"
              placeholder="blur"
              className="border-8 border-white object-cover drop-shadow-lg"
              width={470}
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="flex">
            <Image
              src={officeMehdiNicolas}
              alt="Picture of Mehdi and Nicolas looking at code on a laptop screen in an office"
              placeholder="blur"
              className="border-8 border-white object-cover"
              width={470}
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="flex">
            <Image
              src={patioAlexisLili}
              alt="Picture of Alexis and Lili with a laptop smiling in the patio"
              placeholder="blur"
              className="border-8 border-white object-cover"
              width={470}
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
        </div>
      </div>
      <div className="col-span-full flex justify-center pt-4 lg:col-span-1 lg:col-start-2">
        <Image
          src={marseille}
          alt="Handwriting of 'Marseille' with a location pinpoint and a curly arrow"
          className="max-w-[50%]"
        />
      </div>
    </div>
  );
}
