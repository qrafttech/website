import type { StaticImageData } from "next/image";

import Rich from "@/components/Rich";
import Section from "@/components/Section";
import SectionTitle from "@/components/SectionTitle";
import Diptych from "@/components/Diptych";
import Figure from "@/components/Figure";
import type { Dictionary, OriginePhotoKey } from "@/lib/i18n/types";

import openSpaceImg from "@/public/images/scene-open-space.jpg";
import revueDeCodeImg from "@/public/images/scene-revue-de-code.jpg";

/**
 * One anchor scene plus at most two supporting frames across the whole page —
 * more becomes a gallery, and a gallery is decor. Two of the three land here;
 * the balcony frame is the third, beside the invitation's CTA.
 */
const PHOTOS: Partial<Record<OriginePhotoKey, StaticImageData>> = {
  openSpace: openSpaceImg,
  revueDeCode: revueDeCodeImg,
};

function photo(origine: Dictionary["origine"], key: OriginePhotoKey) {
  const meta = origine.photos.find((p) => p.key === key);
  const src = PHOTOS[key];
  if (!meta || !src) return null;
  return { ...meta, src };
}

/** Two diptych rows, so this padding is paid four times. At 7.5rem it was
 *  480px of pure air in one section — long because it was padded, not because
 *  it was dense. */
const HALF = "px-gutter py-14 nav:py-[5.5rem]";

export default function Origine({
  origine,
}: {
  origine: Dictionary["origine"];
}) {
  const anchor = photo(origine, "openSpace");
  const supporting = photo(origine, "revueDeCode");

  return (
    <Section id="origine" band="panel" contain="bleed" rhythm="">
      <Diptych
        gutter="0rem"
        text={
          <div className={HALF}>
            {/* M4 — the dateline. « Marseille, 2020. » became « Tout a commencé
                à Marseille, en 2020. »: six words where there were two, so it
                runs at the section display size and not above it, or the line
                shouts over the section it opens — which is a paragraph of
                prose, not a claim. */}
            <SectionTitle className="max-w-[18ch]">
              <Rich content={origine.dateline} />
            </SectionTitle>
            <div className="mt-8 flex max-w-[52ch] flex-col gap-5 text-[1.0625rem] leading-[1.7] text-muted">
              {origine.paragraphs.slice(0, 2).map((paragraph, index) => (
                <p key={index}>
                  <Rich content={paragraph} />
                </p>
              ))}
            </div>
          </div>
        }
        proof={
          anchor ? (
            <Figure
              src={anchor.src}
              alt={anchor.alt}
              caption={anchor.caption}
              size="bleed"
              className="nav:h-full"
            />
          ) : null
        }
      />

      {/* The pull-quote used to interrupt here, and its `border-y` was doing
          the structural work of turning one long column of prose into two
          beats. The quote is gone; the hairline stays, so the dateline half
          and the recruitment half still read as separate movements — and it
          is the same rule language the diptych already speaks. */}
      <Diptych
        className="border-t border-line"
        gutter="0rem"
        text={
          <div className={HALF}>
            <div className="flex max-w-[52ch] flex-col gap-5 text-[1.0625rem] leading-[1.7] text-muted">
              {origine.paragraphs.slice(2).map((paragraph, index) => (
                <p key={index}>
                  <Rich content={paragraph} />
                </p>
              ))}
            </div>
            <p className="mt-8 font-display text-[1.375rem] font-bold text-ink">
              {origine.join}
            </p>
          </div>
        }
        proof={
          <div className={HALF}>
            {supporting ? (
              <Figure
                src={supporting.src}
                alt={supporting.alt}
                caption={supporting.caption}
              />
            ) : null}
          </div>
        }
      />
    </Section>
  );
}
