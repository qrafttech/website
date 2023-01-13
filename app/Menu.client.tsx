"use client";

import { useState } from "react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/20/solid";

import ContactUs from "./ContactUs";

const menuItems = [
  { id: "services", label: "Services" },
  { id: "values", label: "Valeurs" },
  { id: "stack", label: "Stack" },
  { id: "team", label: "Équipe" },
];

export default function Menu() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={
        mobileOpen
          ? "fixed inset-0 z-50 bg-[#08143f] bg-opacity-95 backdrop-blur-sm backdrop-filter"
          : "absolute inset-x-0 z-10"
      }
      onClick={mobileOpen ? () => setMobileOpen(false) : () => {}}
    >
      <div className="max-w-screen-2xl px-4 pt-6 lg:px-24 xl:px-32">
        <div className="flex flex-col text-white">
          <div className="flex items-center justify-between">
            <span className="font-serif text-2xl font-extrabold">Qraft</span>
            <div className="flex items-center space-x-4 md:space-x-10">
              {menuItems.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="max-md:hidden">
                  {label}
                </a>
              ))}
              <ContactUs className="px-3 py-2 text-sm max-md:rounded-xl md:px-4 md:py-3 md:text-base" />
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
              {menuItems.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
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
