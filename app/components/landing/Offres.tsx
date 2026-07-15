"use client";

import Image, { type StaticImageData } from "next/image";
import { m, type Variants } from "motion/react";

import Rich from "@/components/Rich";
import RiseLine from "@/components/motion/RiseLine.client";
import { offres } from "@/lib/i18n/fr/landing";
import { EASE, VIEWPORT_ONCE } from "@/lib/motion";

import nicolasImg from "@/public/images/nicolas.jpeg";
import alexisImg from "@/public/images/alexis.jpeg";
import adrienImg from "@/public/images/adrien.jpeg";

type FaceKey = typeof offres.team[number]["key"];

const FACE_IMAGES: Record<FaceKey, StaticImageData> = {
  nicolas: nicolasImg,
  alexis: alexisImg,
  adrien: adrienImg,
};

const FACE_PLACEMENT: Record<FaceKey, string> = {
  nicolas: "col-start-3 row-start-1",
  alexis: "col-start-2 row-start-3",
  adrien: "col-start-4 row-start-4",
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cellVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

interface TileProps {
  title: string;
  body: string;
  placement: string;
}

function Tile({ title, body, placement }: TileProps) {
  return (
    <m.div
      variants={cellVariants}
      className={`group relative z-[2] flex flex-col border border-line bg-canvas p-[clamp(1.25rem,2vw,1.875rem)] transition-[scale,box-shadow] duration-[350ms] ease-epure [scale:1] hover:z-[3] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:[scale:1.05] max-nav:min-h-0 max-nav:p-6 ${placement}`}
    >
      <h3 className="mt-5 text-[clamp(1.25rem,1.9vw,1.6875rem)] font-bold leading-[1.12] max-nav:mt-0">
        {title}
      </h3>
      <p className="mt-2.5 max-w-[34ch] text-[0.9375rem] text-muted">{body}</p>
    </m.div>
  );
}

function Face({
  face,
  mobilePlacement = "",
}: {
  face: typeof offres.team[number];
  mobilePlacement?: string;
}) {
  return (
    <m.a
      variants={cellVariants}
      href={face.href}
      target="_blank"
      rel="noopener"
      aria-label={face.linkLabel}
      className={`group relative z-[1] block overflow-hidden bg-tint text-white hover:z-[3] max-nav:order-10 max-nav:flex max-nav:items-center max-nav:gap-5 max-nav:overflow-visible max-nav:border-b max-nav:border-line max-nav:bg-transparent max-nav:py-4 ${
        FACE_PLACEMENT[face.key]
      } ${mobilePlacement}`}
    >
      <span className="relative block max-nav:h-[4.75rem] max-nav:w-[4.75rem] max-nav:flex-none max-nav:overflow-hidden max-nav:bg-tint nav:absolute nav:inset-0">
        <Image
          src={FACE_IMAGES[face.key]}
          alt={face.name}
          fill
          sizes="(max-width: 899px) 76px, 240px"
          className="object-cover grayscale transition-[filter,transform] duration-[350ms] ease-epure group-hover:scale-[1.06] group-hover:grayscale-0"
        />
      </span>
      <span className="flex min-w-0 flex-col text-[0.8125rem] leading-[1.5] text-muted nav:absolute nav:inset-x-0 nav:bottom-0 nav:bg-gradient-to-t nav:from-[rgba(10,12,16,0.78)] nav:to-transparent nav:px-3 nav:pb-[0.5625rem] nav:pt-[1.625rem] nav:text-[0.6875rem] nav:leading-[1.4] nav:text-white">
        <strong className="text-[0.9375rem] font-bold text-ink nav:text-xs nav:text-inherit">
          {face.name} ↗
        </strong>
        {face.role}
      </span>
    </m.a>
  );
}

const teamByKey = Object.fromEntries(
  offres.team.map((face) => [face.key, face])
) as Record<FaceKey, typeof offres.team[number]>;

export default function Offres() {
  const { title, subtitle, tiles } = offres;

  return (
    <section id="offres" className="overflow-hidden py-24 nav:py-[9.375rem]">
      <div className="px-[clamp(1.5rem,3.2vw,3.25rem)]">
        <h2 className="max-w-[16ch] text-[clamp(2.125rem,5.4vw,4.5rem)] font-bold leading-[1.02]">
          <RiseLine trigger="view" duration={1}>
            <Rich content={title} />
          </RiseLine>
        </h2>
        <p className="mt-5 max-w-[46ch] text-[clamp(1rem,1.5vw,1.25rem)] text-muted">
          {subtitle}
        </p>
      </div>

      <m.div
        className="relative mx-[clamp(1.5rem,3.2vw,3.25rem)] mt-24 grid grid-cols-6 grid-rows-[repeat(4,9.375rem)] max-nav:mx-6 max-nav:mt-14 max-nav:flex max-nav:flex-col"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
      >
        <Tile
          title={tiles[0].title}
          body={tiles[0].body}
          placement="col-start-1 col-span-2 row-start-1 row-span-2"
        />
        <Face
          face={teamByKey.nicolas}
          mobilePlacement="max-nav:mt-10 max-nav:border-t"
        />
        <Tile
          title={tiles[1].title}
          body={tiles[1].body}
          placement="col-start-3 col-span-2 row-start-2 row-span-2 max-nav:-mt-px"
        />
        <Tile
          title={tiles[2].title}
          body={tiles[2].body}
          placement="col-start-5 col-span-2 row-start-3 row-span-2 max-nav:-mt-px"
        />
        <Face face={teamByKey.alexis} />
        <Face face={teamByKey.adrien} />
      </m.div>
    </section>
  );
}
