import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { BLOG_DIR } from "@/lib/blog";

/**
 * The images next to the articles in `content/blog`, served as
 * `/blog-assets/<dir>/<file>`. Every file is listed below, so each one is
 * prerendered at build time into a static file.
 */
const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export function generateStaticParams() {
  return readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
      readdirSync(path.join(BLOG_DIR, entry.name))
        .filter((file) => path.extname(file).toLowerCase() in CONTENT_TYPES)
        .map((file) => ({ dir: entry.name, file }))
    );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dir: string; file: string }> }
) {
  const { dir, file } = await params;
  const contentType = CONTENT_TYPES[path.extname(file).toLowerCase()];
  const isPlainName = (name: string) =>
    name === path.basename(name) && !name.startsWith(".");

  if (!contentType || !isPlainName(dir) || !isPlainName(file)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    return new Response(
      new Uint8Array(readFileSync(path.join(BLOG_DIR, dir, file))),
      {
        headers: {
          "Content-Type": contentType,
          "Cache-Control":
            "public, max-age=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
