import type { StaticImageData } from "next/image";

import billi1 from "@/public/images/billi1.png";
import billi2 from "@/public/images/billi2.png";
import cevidentia1 from "@/public/images/cevidentia1.webp";
import cevidentia2 from "@/public/images/cevidentia2.webp";
import cevidentia3 from "@/public/images/cevidentia3.webp";
import easiwareScreenshot from "@/public/images/easiware-screenshot.jpg";
import embarqScreenshot from "@/public/images/embarq-screenshot.jpg";
import brunoScreenshot from "@/public/images/bruno-screenshot.jpg";
import chloeScreenshot from "@/public/images/chloe-screenshot.jpg";
import santeScreenshot from "@/public/images/sante-screenshot.jpg";

export const clientScreenshots: Record<string, readonly StaticImageData[]> = {
  billi: [billi1, billi2],
  cevidentia: [cevidentia1, cevidentia2, cevidentia3],
  easiware: [easiwareScreenshot],
  embarq: [embarqScreenshot],
  bruno: [brunoScreenshot],
  chloe: [chloeScreenshot],
  sante: [santeScreenshot],
};
