import Image from "next/image";

import Cover from "./Cover";
import CoverBackground from "./CoverBackground";
import Services from "./Services";
import sticker from "../public/images/sticker.svg";
import Values from "./Values";
import Stack from "./Stack";
import FluidContainer from "./FluidContainer";

export default function Home() {
  return (
    <main>
      <div className="relative">
        <CoverBackground>
          <FluidContainer>
            <Cover />
          </FluidContainer>
        </CoverBackground>
        <Image
          src={sticker}
          alt="Made with trust, build to last sticker"
          width={120}
          className="absolute -bottom-6 mx-auto max-md:left-0 max-md:right-0 md:right-20"
        />
      </div>
      <FluidContainer>
        <div className="pt-20">
          <Services />
        </div>
      </FluidContainer>
      <FluidContainer className="bg-[url(/images/values-background-mobile.svg)] bg-center bg-repeat-x md:bg-[url(/images/values-background-desktop.svg)]">
        <div className="pt-20 xl:pb-40">
          <Values />
        </div>
      </FluidContainer>
      <FluidContainer>
        <Stack />
      </FluidContainer>
    </main>
  );
}
