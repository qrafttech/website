import Image from "next/image";

import Cover from "./Cover";
import CoverBackground from "./CoverBackground";
import Services from "./Services";
import sticker from "../public/images/sticker.svg";

export default function Home() {
  return (
    <main>
      <div className="relative">
        <CoverBackground>
          <div className="px-4 pt-6 max-w-screen-2xl md:px-20 lg:px-24 xl:px-32">
            <Cover />
          </div>
        </CoverBackground>
        <Image
          src={sticker}
          alt="Made with trust, build to last sticker"
          width={120}
          height={120}
          className="absolute mx-auto -bottom-6 max-md:left-0 max-md:right-0 md:right-20"
        />
      </div>
      <div className="flex justify-center">
        <div className="px-4 pt-20  max-w-screen-2xl md:px-20 lg:px-24 xl:px-32">
          <Services />
        </div>
      </div>
    </main>
  );
}
