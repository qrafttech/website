"use client";

import { useState } from "react";
import Link from "next/link";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/20/solid";

import ContactUs from "./ContactUs";

const menuItems = [
  { id: "services", label: "Services" },
  { id: "values", label: "Valeurs" },
  { id: "stack", label: "Stack" },
  { id: "team", label: "Équipe" },
  { id: "portfolio", label: "Portfolio" },
  { id: "blog", label: "Blog", href: "/blog" },
];

interface MenuProps {
  variant?: "dark" | "light";
}

export default function Menu({ variant = "dark" }: MenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLight = variant === "light";

  return (
    <div
      className={
        mobileOpen
          ? `fixed inset-0 z-50 ${
              isLight ? "bg-white" : "bg-[#08143f]"
            } bg-opacity-95 backdrop-blur-sm backdrop-filter`
          : `${isLight ? "relative" : "absolute"} inset-x-0 z-10`
      }
      onClick={mobileOpen ? () => setMobileOpen(false) : () => {}}
    >
      <div className="max-w-screen-2xl px-4 pt-6 lg:px-24 xl:px-32">
        <div
          className={`flex flex-col ${isLight ? "text-black" : "text-white"}`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl font-extrabold">
              Qraft
            </Link>
            <div className="flex items-center space-x-4 md:space-x-10">
              {menuItems.map(({ id, label, href }) => (
                <a key={id} href={href ?? `/#${id}`} className="max-md:hidden">
                  {label}
                </a>
              ))}
              <ContactUs
                variant={variant}
                className="px-3 py-2 text-sm max-md:rounded-xl md:px-4 md:py-3 md:text-base"
              />
              {mobileOpen ? (
                <XMarkIcon width={24} />
              ) : (
                <Bars3Icon
                  width={24}
                  className="md:hidden"
                  onClick={() => setMobileOpen(true)}
                />
              )}
            </div>
          </div>
          {mobileOpen && (
            <div className="flex flex-col items-center space-y-12 pt-16">
              {menuItems.map(({ id, label, href }) => (
                <a
                  key={id}
                  href={href ?? `/#${id}`}
                  className="font-serif text-2xl font-bold"
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
