"use client";

import { useState, type CSSProperties } from "react";
import Image, { StaticImageData } from "next/image";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface Photo {
  src: StaticImageData;
  alt: string;
}

const GALLERY_SIZES = "(min-width: 1024px) 1100px, 90vw";
const PER_ROW = 3;

export default function CoworkGallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<Photo | null>(null);

  const rows: Photo[][] = [];
  for (let i = 0; i < photos.length; i += PER_ROW) {
    rows.push(photos.slice(i, i + PER_ROW));
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-4">
        {rows.map((row) => (
          <div
            key={row.map((photo) => photo.alt).join("|")}
            className="flex flex-col gap-4 sm:flex-row"
          >
            {row.map((photo) => (
              <button
                key={photo.alt}
                type="button"
                onClick={() => setActive(photo)}
                aria-label={`Agrandir : ${photo.alt}`}
                style={
                  { "--r": photo.src.width / photo.src.height } as CSSProperties
                }
                className="group relative w-full overflow-hidden [aspect-ratio:var(--r)] sm:w-auto sm:[flex-basis:0] sm:[flex-grow:var(--r)]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={GALLERY_SIZES}
                  placeholder="blur"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      <Dialog
        open={active !== null}
        onClose={() => setActive(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {active && (
            <Dialog.Panel
              className="relative"
              style={{
                aspectRatio: active.src.width / active.src.height,
                width: `min(90vw, ${
                  (85 * active.src.width) / active.src.height
                }vh)`,
              }}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Fermer"
                className="absolute -top-10 right-0 text-white hover:text-white/70"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes={GALLERY_SIZES}
                className="object-cover"
              />
            </Dialog.Panel>
          )}
        </div>
      </Dialog>
    </>
  );
}
