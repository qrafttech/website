import Image from "next/image";

import heroIllustrationMobile from "../public/images/hero-illustration-mobile.svg";
import heroIllustrationDesktop from "../public/images/hero-illustration-desktop.svg";
import Menu from "./Menu";
import ContactUs from "./ContactUs";

export default function Cover() {
  return (
    <div className="space-between flex flex-col md:h-5/6">
      <Menu />
      <div className="flex flex-col-reverse pt-8 md:flex-row md:pt-24">
        <div className="flex flex-[6_6_0%] flex-col justify-center">
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            La seule agence web{" "}
            <span className="bg-gradient-to-r from-[#d582fc] to-[#95b2fd] bg-clip-text text-transparent opacity-90">
              dont vous avez besoin
            </span>
          </h1>
          <div className="lg:text-lg">
            <p className="py-6 text-white/70">
              Qraft est une{" "}
              <strong className="text-white">agence de développement</strong>{" "}
              qui vous accompagne dans la construction de votre application web,
              mobile, API ou infrastructure technique.
            </p>
            <p className="pb-12 text-white/70">
              Notre équipe composée d&#39;experts de plus de{" "}
              <strong className="text-white">10 années d&#39;expérience</strong>{" "}
              met l&#39;accent sur la{" "}
              <strong className="text-white">qualité</strong> et la{" "}
              <strong className="text-white">performance</strong> de votre
              service, <strong className="text-white">dans la durée.</strong>
            </p>
          </div>
          <div className="max-md:hidden">
            <ContactUs className="px-6 py-4 text-lg" />
          </div>
        </div>
        <div className="flex flex-[4_4_0%] justify-center max-md:max-h-72">
          <Image
            src={heroIllustrationMobile}
            alt="Smiling doodle face and lightbulb"
            className="heigth-auto w-5/6 md:hidden"
            priority
          />
          <Image
            src={heroIllustrationDesktop}
            alt="Smiling doodle face and lightbulb"
            className="pb-32 max-md:hidden"
            priority
          />
        </div>
      </div>
    </div>
  );
}
