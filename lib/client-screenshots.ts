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

/**
 * The image of a case study's link preview: a card with the Qraft lockup,
 * the client's logo and its screenshot, made by `yarn gen:client-cards`.
 */
export const clientSocialImages: Record<string, string> = {
  billi: "/images/social/billi.jpg",
  cevidentia: "/images/social/cevidentia.jpg",
  easiware: "/images/social/easiware.jpg",
  embarq: "/images/social/embarq.jpg",
  bruno: "/images/social/bruno.jpg",
  chloe: "/images/social/chloe.jpg",
  sante: "/images/social/sante.jpg",
  episto: "/images/social/episto.jpg",
  hellio: "/images/social/hellio.jpg",
};
