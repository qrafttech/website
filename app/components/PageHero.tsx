import type { ReactNode } from "react";
import clsx from "clsx";

import { SITE_CONTAINER } from "../../lib/site";

import Menu from "./Menu.client";
import CoverBackground from "./CoverBackground";

interface PageHeroProps {
  title: string;
  subtitle: ReactNode;
  menuVariant?: "dark" | "light";
}

export default function PageHero({
  title,
  subtitle,
  menuVariant,
}: PageHeroProps) {
  return (
    <div className="relative">
      <Menu variant={menuVariant} />
      <CoverBackground>
        <div
          className={clsx(
            "w-full pt-28 pb-16 md:pt-32 md:pb-20",
            SITE_CONTAINER
          )}
        >
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">
            {title}
          </h1>
          <p className="max-w-xl pt-3 text-white/60">{subtitle}</p>
        </div>
      </CoverBackground>
    </div>
  );
}
