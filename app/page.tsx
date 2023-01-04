import Image from "next/image";

import Cover from "./Cover";
import CoverBackground from "./CoverBackground";
import Services from "./Services";
import sticker from "../public/images/sticker.svg";
import Values from "./Values";

export default function Home() {
  return (
    <main>
      <div className="relative">
        <CoverBackground>
          <div className="max-w-screen-2xl px-4 pt-6 lg:px-24 xl:px-32">
            <Cover />
          </div>
        </CoverBackground>
        <Image
          src={sticker}
          alt="Made with trust, build to last sticker"
          width={120}
          height={120}
          className="absolute -bottom-6 mx-auto max-md:left-0 max-md:right-0 md:right-20"
        />
      </div>
      <div className="flex justify-center">
        <div className="max-w-screen-2xl px-4 pt-20 lg:px-24 xl:px-32">
          <Services />
        </div>
      </div>
      <div className="flex justify-center bg-[url(/images/values-background-mobile.svg)] bg-center bg-repeat-x pb-60 md:bg-[url(/images/values-background-desktop.svg)]">
        <div className="max-w-screen-2xl px-4 pt-20 lg:px-24 xl:px-32">
          <Values />
        </div>
      </div>
    </main>
  );
}
