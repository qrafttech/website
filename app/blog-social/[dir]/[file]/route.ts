import { readdirSync } from "node:fs";
import path from "node:path";
import { cacheLife } from "next/cache";
import sharp from "sharp";

import { BLOG_DIR, socialSource } from "@/lib/blog";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import { OG_IMAGE_SIZE } from "@/lib/site";

/**
 * The image of an article's link preview (`og:image`), served as
 * `/blog-social/<dir>/<locale>.jpg`. Every article is listed below, so each
 * image is made once, at build time.
 *
 * LinkedIn, X and WhatsApp crop the image to `OG_IMAGE_SIZE`, which cuts the
 * title off a 3:2 cover. So the cover is fitted whole inside that frame and
 * its edge pixels are stretched to fill the rest: on a plain background the
 * seam does not show. A cover that is not on one (a photo, a tall screenshot)
 * needs a `social` image of its own.
 *
 * An image that cannot be read throws, so a misspelt file name fails the
 * build instead of publishing an article without a preview.
 */
export function generateStaticParams() {
  return readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
      LOCALES.filter((locale) => socialSource(entry.name, locale)).map(
        (locale) => ({ dir: entry.name, file: `${locale}.jpg` })
      )
    );
}

/** Cached, or the route would be rendered on every request, not at build. */
async function preview(source: string) {
  "use cache";
  cacheLife("max");

  const { width, height } = await sharp(source).metadata();
  const scale = Math.min(
    OG_IMAGE_SIZE.width / width,
    OG_IMAGE_SIZE.height / height
  );
  const fitted = {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
  const padX = OG_IMAGE_SIZE.width - fitted.width;
  const padY = OG_IMAGE_SIZE.height - fitted.height;

  const image = await sharp(source)
    .flatten({ background: "#ffffff" })
    .resize(fitted.width, fitted.height)
    .extend({
      left: Math.floor(padX / 2),
      right: Math.ceil(padX / 2),
      top: Math.floor(padY / 2),
      bottom: Math.ceil(padY / 2),
      extendWith: "copy",
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Uint8Array(image);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dir: string; file: string }> }
) {
  const { dir, file } = await params;
  const locale = path.basename(file, ".jpg");
  const isPlainName = dir === path.basename(dir) && !dir.startsWith(".");

  if (!isPlainName || !isLocale(locale) || file !== `${locale}.jpg`) {
    return new Response("Not found", { status: 404 });
  }

  const source = socialSource(dir, locale);
  if (!source) return new Response("Not found", { status: 404 });

  return new Response(await preview(source), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
