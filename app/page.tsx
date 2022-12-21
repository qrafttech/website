import Image from "next/image";

import heroIllustrationMobile from "../public/images/hero-illustration-mobile.svg";
import heroIllustrationDesktop from "../public/images/hero-illustration-desktop.svg";
import heroBackground from "../public/images/hero-background.png";
import sticker from "../public/images/sticker.svg";

export default function Home() {
  return (
    <main>
      <div className="container h-screen pt-6 mx-auto">
        <div className="flex h-full md:h-5/6">
          <div className="absolute inset-x-0 top-0 h-full md:h-5/6 -z-10">
            <Image
              src={heroBackground}
              alt="Blue and pink linear gradient Hero background"
              placeholder="blur"
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <div className="relative flex flex-col-reverse md:flex-row">
            <div className="absolute -bottom-10 right-20">
              <Image
                src={sticker}
                alt="Made with trust, build to last sticker"
              />
            </div>
            <div className="flex flex-col flex-[6_6_0%] p-4 justify-center">
              <h1 className="text-6xl font-bold text-white">
                La seule agence web
                <br />
                <span className="text-transparent opacity-90 bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-500">
                  dont vous avez besoin
                </span>
              </h1>
              <p className="py-6 text-white/70">
                Qraft est une{" "}
                <strong className="text-white">
                  agence de développement web
                </strong>{" "}
                qui vous accompagne dans la construction de votre application,
                API ou infrastructure technique.
              </p>
              <p className="pb-6 text-white/70">
                Notre équipe composée d&#39;experts de plus de{" "}
                <strong className="text-white">
                  10 années d&#39;expérience
                </strong>{" "}
                met l&#39;accent sur la{" "}
                <strong className="text-white">qualité</strong> et la{" "}
                <strong className="text-white">performance</strong> de votre
                service, <strong className="text-white">dans la durée.</strong>
              </p>
              <div>
                <button
                  type="button"
                  className="px-6 py-4 text-sm font-medium text-white bg-transparent border border-white rounded-2xl hover:bg-white/20 "
                >
                  Nous contacter
                </button>
              </div>
            </div>
            <div className="flex justify-center flex-[4_4_0%]">
              <Image
                src={heroIllustrationMobile}
                alt="Smiling doodle face and lightbulb"
                className="w-5/6 heigth-auto md:hidden"
              />
              <Image
                src={heroIllustrationDesktop}
                alt="Smiling doodle face and lightbulb"
                className="max-md:hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
