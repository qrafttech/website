import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { parse } from "yaml";

const BLOG_DIR = path.join(import.meta.dirname, "../content/blog");

/** Every `fr.md` and `en.md` of the blog, with its front matter. */
const articles = readdirSync(BLOG_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((entry) =>
    ["fr", "en"].map((locale) => path.join(entry.name, `${locale}.md`))
  )
  .filter((file) => existsSync(path.join(BLOG_DIR, file)))
  .map((file) => {
    const source = readFileSync(path.join(BLOG_DIR, file), "utf8");
    const front = source.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
    return { file, data: parse(front) ?? {} };
  });

// A draft may not have its cover yet; an article with a date goes out.
test("an article with a date has a cover", () => {
  const without = articles
    .filter(({ data }) => data.date && !data.cover)
    .map(({ file }) => file);
  assert.deepEqual(without, []);
});

test("a cover is a file of the article's folder", () => {
  const notFound = articles
    .filter(({ data }) => data.cover)
    .map(({ file, data }) => path.join(path.dirname(file), String(data.cover)))
    .filter((cover) => !existsSync(path.join(BLOG_DIR, cover)));
  assert.deepEqual(notFound, []);
});
