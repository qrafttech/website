import Image from "next/image";

import heroIllustrationMobile from "../public/images/hero-illustration-mobile.svg";
import heroIllustrationDesktop from "../public/images/hero-illustration-desktop.svg";

export default function Cover() {
  return (
    <div className="flex md:h-5/6">
      <div className="flex flex-col-reverse md:flex-row">
        <div className="flex flex-[6_6_0%] flex-col justify-center p-4 font-serif">
          <h1 className="text-4xl font-bold text-white md:text-6xl">
            La seule agence web
            <br />
            <span className="bg-gradient-to-r from-[#d582fc] to-[#95b2fd] bg-clip-text text-transparent opacity-90">
              dont vous avez besoin
            </span>
          </h1>
          <div className="md:text-lg">
            <p className="py-6 text-white/70">
              Qraft est une{" "}
              <strong className="text-white">
                agence de développement web
              </strong>{" "}
              qui vous accompagne dans la construction de votre application, API
              ou infrastructure technique.
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
            <button
              type="button"
              className="px-6 py-4 text-sm font-medium text-white bg-transparent border border-white rounded-2xl hover:bg-white/20 "
            >
              Nous contacter
            </button>
          </div>
        </div>
        <div className="flex flex-[4_4_0%] justify-center max-md:max-h-72">
          <Image
            src={heroIllustrationMobile}
            alt="Smiling doodle face and lightbulb"
            className="w-5/6 heigth-auto md:hidden"
          />
          <Image
            src={heroIllustrationDesktop}
            alt="Smiling doodle face and lightbulb"
            className="pb-32 max-md:hidden"
          />
        </div>
      </div>
    </div>
  );
}
