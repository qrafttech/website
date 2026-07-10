"use client";

import Image, { type StaticImageData } from "next/image";
import { m, type Variants } from "motion/react";

import Rich from "@/components/Rich";
import RiseLine from "@/components/motion/RiseLine.client";
import { getDictionary } from "@/lib/i18n";
import { EASE, VIEWPORT_ONCE } from "@/lib/motion";

import nicolasImg from "@/public/images/nicolas.jpeg";
import alexisImg from "@/public/images/alexis.jpeg";
import adrienImg from "@/public/images/adrien.jpeg";

const FACE_IMAGES: Record<string, StaticImageData> = {
  nicolas: nicolasImg,
  alexis: alexisImg,
  adrien: adrienImg,
};

const FACE_PLACEMENT: Record<string, string> = {
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
      className={`group relative z-[2] flex flex-col border border-line bg-canvas p-[clamp(20px,2vw,30px)] transition-[scale,box-shadow] duration-[350ms] ease-epure [scale:1] hover:z-[3] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:[scale:1.05] max-[900px]:min-h-0 max-[900px]:p-6 ${placement}`}
    >
      <h3 className="mt-5 text-[clamp(20px,1.9vw,27px)] font-bold leading-[1.12]">
        {title}
      </h3>
      <p className="mt-2.5 max-w-[34ch] text-[15px] text-muted">{body}</p>
    </m.div>
  );
}

interface FaceProps {
  face: {
    key: string;
    name: string;
    role: string;
    href: string;
    linkLabel: string;
  };
}

function Face({ face }: FaceProps) {
  return (
    <m.a
      variants={cellVariants}
      href={face.href}
      target="_blank"
      rel="noopener"
      aria-label={face.linkLabel}
      className={`group relative z-[1] block overflow-hidden bg-tint text-white opacity-[0.55] hover:z-[3] max-[900px]:order-10 max-[900px]:mt-3 max-[900px]:block max-[900px]:h-60 ${
        FACE_PLACEMENT[face.key]
      }`}
    >
      <Image
        src={FACE_IMAGES[face.key]}
        alt={face.name}
        fill
        sizes="(max-width: 900px) 100vw, 240px"
        className="object-cover grayscale transition-[filter,transform] duration-[350ms] ease-epure group-hover:scale-[1.06] group-hover:grayscale-0"
      />
      <span className="absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-[rgba(10,12,16,0.78)] to-transparent px-3 pb-[9px] pt-[26px] text-[11px] leading-[1.4]">
        <strong className="text-xs font-bold">{face.name} ↗</strong>
        {face.role}
      </span>
    </m.a>
  );
}

export default function Offres() {
  const t = getDictionary();
  const { title, subtitle, tiles, team } = t.offres;
  const [nicolas, alexis, adrien] = team;

  return (
    <section id="offres" className="overflow-hidden py-[150px]">
      <div className="px-[clamp(24px,3.2vw,52px)]">
        <h2 className="max-w-[16ch] text-[clamp(34px,5.4vw,72px)] font-bold leading-[1.02]">
          <RiseLine trigger="view" duration={1}>
            <Rich content={title} />
          </RiseLine>
        </h2>
        <p className="mt-5 max-w-[46ch] text-[clamp(16px,1.5vw,20px)] text-muted">
          {subtitle}
        </p>
      </div>

      <m.div
        className="relative mx-[clamp(24px,3.2vw,52px)] mt-24 grid grid-cols-6 grid-rows-[repeat(4,150px)] max-[900px]:mx-6 max-[900px]:mt-14 max-[900px]:flex max-[900px]:flex-col"
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
        <Face face={nicolas} />
        <Tile
          title={tiles[1].title}
          body={tiles[1].body}
          placement="col-start-3 col-span-2 row-start-2 row-span-2"
        />
        <Tile
          title={tiles[2].title}
          body={tiles[2].body}
          placement="col-start-5 col-span-2 row-start-3 row-span-2"
        />
        <Face face={alexis} />
        <Face face={adrien} />
      </m.div>
    </section>
  );
}
