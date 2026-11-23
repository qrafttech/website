/**
 * The lint of the blog's articles, run by `yarn lint` after ESLint.
 *
 * An article with a `date` needs a `cover`, and the cover must be a file of
 * the article's folder. A draft (no `date`) may not have its cover yet.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const BLOG_DIR = "content/blog";

const errors = [];
for (const entry of readdirSync(BLOG_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  for (const locale of ["fr", "en"]) {
    const file = path.join(BLOG_DIR, entry.name, `${locale}.md`);
    if (!existsSync(file)) continue;

    const source = readFileSync(file, "utf8");
    const front = source.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
    const { date, cover } = parse(front) ?? {};

    if (date && !cover) {
      errors.push(`${file}: an article with a date needs a cover`);
    }
    if (cover && !existsSync(path.join(BLOG_DIR, entry.name, String(cover)))) {
      errors.push(`${file}: cover ${cover} not found`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
}
