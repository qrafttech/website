import Image from "next/image";

import heroIllustrationMobile from "../public/images/hero-illustration-mobile.svg";
import heroIllustrationDesktop from "../public/images/hero-illustration-desktop.svg";
import sticker from "../public/images/sticker.svg";

export default function Home() {
  return (
    <main>
      <div
        className="relative py-16 md:pt-32"
        style={{
          background:
            "linear-gradient(105deg, rgba(220, 52, 235, 0.6) 0%, rgba(220, 52, 235, 0) 31%, rgba(220, 52, 235, 0) 68%, rgba(220, 52, 235, 0.5) 100%), linear-gradient(210deg, #4AA7B8 14.5%, #348CAF 30%, #324DB1 52%, #3116AC 64%, #2B0AB1 83%)",
          maskImage: "url(/images/hero-mask-desktop.svg)",
          WebkitMaskImage: "url(/images/hero-mask-desktop.svg)",
          WebkitMaskPosition: "bottom",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "cover",
        }}
      >
        <div
          className="absolute inset-y-0 right-0 -left-32 "
          style={{
            background:
              "linear-gradient(90deg, #f9fafb1a 1%, transparent 1%) 1px 0, transparent",
            backgroundSize: "200px 1px",
          }}
        />
        <div
          className="absolute right-0 bottom-0 -top-32 -left-[126px]"
          style={{
            opacity: 0.1,
            background:
              "radial-gradient(circle, transparent 2%, #1f2937 2%, #1f2937 98%, transparent 98%, transparent) 200px 200px, linear-gradient(#f9fafb 1.6px, transparent 1.6px) 0 -0.8px, linear-gradient(90deg, #f9fafb 1.6px, #1f2937 1.6px) -0.8px 0",
            backgroundSize: "200px 200px",
          }}
        />
        <div className="container pt-6 mx-auto">
          <div className="flex md:h-5/6">
            <div className="relative flex flex-col-reverse md:flex-row">
              <Image
                src={sticker}
                alt="Made with trust, build to last sticker"
                width={120}
                height={120}
                className="absolute mx-auto max-md:left-0 max-md:right-0 -bottom-20 md:right-20"
              />
              <div className="flex flex-col flex-[6_6_0%] p-4 justify-center">
                <h1 className="text-6xl font-bold text-white">
                  La seule agence web
                  <br />
                  <span className="text-transparent opacity-90 bg-clip-text bg-gradient-to-r from-[#d582fc] to-[#95b2fd]">
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
                <p className="pb-12 text-white/70">
                  Notre équipe composée d&#39;experts de plus de{" "}
                  <strong className="text-white">
                    10 années d&#39;expérience
                  </strong>{" "}
                  met l&#39;accent sur la{" "}
                  <strong className="text-white">qualité</strong> et la{" "}
                  <strong className="text-white">performance</strong> de votre
                  service,{" "}
                  <strong className="text-white">dans la durée.</strong>
                </p>
                <div className="max-md:hidden">
                  <button
                    type="button"
                    className="px-6 py-4 text-sm font-medium text-white bg-transparent border border-white rounded-2xl hover:bg-white/20 "
                  >
                    Nous contacter
                  </button>
                </div>
              </div>
              <div className="flex justify-center flex-[4_4_0%] max-md:max-h-72">
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
        </div>
      </div>
    </main>
  );
}
