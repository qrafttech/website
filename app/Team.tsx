import Image from "next/image";

import officeMehdiNicolas from "../public/images/office-mehdi-nicolas.jpg";
import patioAlexisLili from "../public/images/patio-alexis-lili.jpg";
import patioNicolas from "../public/images/patio-nicolas.jpg";
import dinosaur from "../public/images/dinosaur.svg";
import marseille from "../public/images/marseille.svg";

export default function Team() {
  return (
    <div className="grid grid-cols-2">
      <div className="col-span-2 lg:col-span-1">
        <Image
          src={dinosaur}
          alt="Illustration of a dinosaur screaming 'Whoa!'"
          className="py-2"
        />
        <h2 className="bg-gradient-to-r from-[#048e33] to-[#04b23f] bg-clip-text py-6 font-serif text-5xl font-bold text-transparent">
          Les devs sur le front, comme sur le back&nbsp;!
        </h2>
        <p className="pb-6">
          <strong>Alexis</strong> et <strong>Nicolas</strong> ont une dizaine
          d&#39;années d&#39;expériences dans le développement et se sont
          rencontrés au sein d&#39;une startup fintech incubée par Facebook.
          Après avoir travaillés ensemble sur plusieurs projets, ils décident de
          s&#39;associer autour de valeurs communes en 2020&nbsp;:{" "}
          <strong>Qraft</strong> est né.
        </p>
        <p>
          Tous deux croient fortement aux profils atypiques, tant qu&#39;ils
          sont motivés et font preuves de résilience. C&#39;est dans cette
          optique <strong>organique</strong> et <strong>pédagogue</strong> que
          Qraft compte aujourd&#39;hui 4 développeurs et s&#39;agrandit toujours
          plus, dans la <strong>bonne humeur</strong>&nbsp;!
        </p>
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-8 p-8 lg:col-span-1">
        <div className="col-span-full row-span-2 flex sm:col-span-1">
          <Image
            src={patioNicolas}
            alt="Picture of Nicolas from above in a the patio with a laptop looking surprised"
            placeholder="blur"
            className="border-8 border-white object-cover drop-shadow-lg"
            width={640}
          />
        </div>
        <div className="col-span-full flex sm:col-span-1">
          <Image
            src={officeMehdiNicolas}
            alt="Picture of Mehdi and Nicolas looking at code on a laptop screen in an office"
            placeholder="blur"
            className="border-8 border-white object-cover"
            width={640}
          />
        </div>
        <div className="col-span-full flex sm:col-span-1">
          <Image
            src={patioAlexisLili}
            alt="Picture of Alexis and Lili with a laptop smiling in the patio"
            placeholder="blur"
            className="border-8 border-white object-cover"
            width={640}
          />
        </div>
        <div className="col-span-full flex flex-1">
          <Image
            src={marseille}
            alt="Handwriting of 'Marseille' with a location pinpoint and a curly arrow"
          />
        </div>
      </div>
    </div>
  );
}
