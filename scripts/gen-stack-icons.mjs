/* Regenerates `lib/stack-icons.ts` from the `simple-icons` package.
 *
 * The icon data used to be pasted in by hand, which meant a brand refresh was a
 * copy-paste job and nothing recorded where a path came from. Now the list of
 * slugs lives here and the data is read straight out of the installed package,
 * so `yarn gen:stack-icons` after a `simple-icons` bump is the whole update.
 *
 * Only add a slug that `simple-icons` actually ships. Icons are single-`<path>`
 * on a 24×24 viewBox — `app/components/StackIcon.tsx` assumes both — and no
 * entry here is ever hand-drawn: a brand with no official single-path SVG
 * (AWS, Heroku, OpenAI, Scalingo, pgvector, RSpec, Llama) renders as a
 * label-only chip instead. That is a deliberate design state, not a gap.
 *
 *   yarn gen:stack-icons
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import * as simpleIcons from "simple-icons";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* `simple-icons` does not export its own package.json, so the pinned range in
   ours is what gets stamped into the generated header. */
const { devDependencies } = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8")
);
const version = devDependencies["simple-icons"];

/** Slugs to emit, grouped by what uses them. Keep alphabetical within a group. */
const SLUGS = [
  /* Referenced by `clients[].stack[].icon` in the locale dictionaries. */
  "apollographql",
  "expo",
  "fastapi",
  "flask",
  "graphql",
  "jest",
  "mui",
  "nestjs",
  "nextdotjs",
  "numpy",
  "pandas",
  "postgresql",
  "react",
  "redis",
  "rubyonrails",
  "shadcnui",
  "sidekiq",
  "tailwindcss",
  "typeorm",
  "typescript",
  /* Referenced by `arsenal.groups[].items[].icon`. */
  "anthropic",
  "claudecode",
  "cursor",
  "docker",
  "githubactions",
  "langchain",
  "langgraph",
  "mistralai",
  "modelcontextprotocol",
  "nodedotjs",
  "rubocop",
  "vercel",
];

const HEADER = `/* GENERATED FILE — do not edit by hand.
 *
 * Run \`yarn gen:stack-icons\` to regenerate from the \`simple-icons\` package.
 * The slug list lives in \`scripts/gen-stack-icons.mjs\`.
 *
 * Source: simple-icons@${version}
 */

export interface StackIconData {
  hex: string;
  path: string;
}

export const STACK_ICONS = {
`;

function iconFor(slug) {
  /* simple-icons exports each icon as `si` + PascalCase slug. */
  const exportName =
    "si" + slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
  const icon = simpleIcons[exportName];

  if (!icon) {
    throw new Error(
      `simple-icons has no export \`${exportName}\` for slug "${slug}". ` +
        `Remove it from SLUGS, or find the real slug — do not hand-author a path.`
    );
  }

  if (icon.path.includes("Z M") || icon.svg.split("<path").length > 2) {
    throw new Error(
      `"${slug}" is not a single-path icon; StackIcon cannot render it.`
    );
  }

  return icon;
}

const body = SLUGS.map((slug) => {
  const icon = iconFor(slug);
  return [
    `  ${slug}: {`,
    `    hex: ${JSON.stringify(icon.hex)},`,
    `    path: ${JSON.stringify(icon.path)},`,
    `  },`,
  ].join("\n");
}).join("\n");

const FOOTER = `
} as const satisfies Record<string, StackIconData>;

export type StackIconSlug = keyof typeof STACK_ICONS;
`;

writeFileSync(join(root, "lib", "stack-icons.ts"), HEADER + body + FOOTER);

console.log(`Wrote ${SLUGS.length} icons to lib/stack-icons.ts`);
