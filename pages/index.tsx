import Image from "next/image";

import Cover from "../components/Cover";
import CoverBackground from "../components/CoverBackground";
import Services from "../components/Services";
import sticker from "../public/images/sticker.svg";
import Values from "../components/Values";
import Stack from "../components/Stack";
import FluidContainer from "../components/FluidContainer";
import Team from "../components/Team";
import Menu from "../components/Menu.client";
import Portfolio from "../components/Portfolio";

export default function Home() {
  return (
    <main>
      <div className="relative">
        <Menu />
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
      <FluidContainer id="services">
        <div className="pt-20">
          <Services />
        </div>
      </FluidContainer>
      <FluidContainer
        id="values"
        className="bg-[url(/images/values-background-mobile.svg)] bg-center bg-repeat-x md:bg-[url(/images/values-background-desktop.svg)]"
      >
        <div className="pt-20 xl:pb-40">
          <Values />
        </div>
      </FluidContainer>
      <FluidContainer id="stack">
        <Stack />
      </FluidContainer>
      <FluidContainer
        id="team"
        className="bg-[url(/images/team-background.svg)]"
      >
        <Team />
      </FluidContainer>
      <FluidContainer id="portfolio">
        <div className="pt-16">
          <Portfolio />
        </div>
      </FluidContainer>
    </main>
  );
}
