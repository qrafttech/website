/* Regenerates `lib/stack-icons.ts` from the `simple-icons` package.
 *
 * The icon data used to be pasted in by hand, which meant a brand refresh was a
 * copy-paste job and nothing recorded where a path came from. Now the list of
 * slugs lives here and the data is read straight out of the installed package,
 * so `yarn gen:stack-icons` after a `simple-icons` bump is the whole update.
 *
 * Only add a slug that `simple-icons` actually ships. Icons are single-`<path>`
 * on a 24×24 viewBox — `app/components/StackIcon.tsx` assumes both — and no
 * entry here is ever hand-drawn: a brand with no usable official SVG (OpenAI,
 * pgvector, RSpec, Llama) renders as a label-only chip instead. That is a
 * deliberate design state, not a gap.
 *
 * A brand the package shipped and later dropped (AWS and Heroku, both pulled
 * at the owner's request) lives in `VENDORED` below: its data is copied
 * verbatim from the last release that carried it, pinned by version — still
 * the official path, never a hand-drawn one. A brand the package never
 * carried (Scalingo, Langfuse) lives in `BRAND_SOURCED`: the brand's own
 * published mark, mechanically normalised to this file's contract.
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
  "cloudflare",
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

/** Icons `simple-icons` shipped and later removed. Each entry is copied
 *  verbatim from the last release that carried it — official data with pinned
 *  provenance, emitted after the live slugs. Never edit a path by hand. */
const VENDORED = {
  /* simple-icons@14.15.0, removed in 15.0.0. */
  amazonwebservices: {
    hex: "232F3E",
    path: "M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z",
  },
  /* simple-icons@15.22.0, removed in 16.0.0. */
  heroku: {
    hex: "430098",
    path: "M20.61 0H3.39C2.189 0 1.23.96 1.23 2.16v19.681c0 1.198.959 2.159 2.16 2.159h17.22c1.2 0 2.159-.961 2.159-2.159V2.16C22.77.96 21.811 0 20.61 0zm.96 21.841c0 .539-.421.96-.96.96H3.39c-.54 0-.96-.421-.96-.96V2.16c0-.54.42-.961.96-.961h17.22c.539 0 .96.421.96.961v19.681zM6.63 20.399L9.33 18l-2.7-2.4v4.799zm9.72-9.719c-.479-.48-1.379-1.08-2.879-1.08-1.621 0-3.301.421-4.5.84V3.6h-2.4v10.38l1.68-.78s2.76-1.26 5.16-1.26c1.2 0 1.5.66 1.5 1.26v7.2h2.4v-7.2c.059-.179.059-1.501-.961-2.52zM13.17 7.5h2.4c1.08-1.26 1.62-2.521 1.8-3.9h-2.399c-.241 1.379-.841 2.64-1.801 3.9z",
  },
};

/** Marks `simple-icons` never carried, taken from the brand's own published
 *  assets and mechanically normalised — paths concatenated and coordinates
 *  rescaled to the 24×24 viewBox with `svgpath`, never redrawn. A multicolour
 *  mark flattens to its lead brand colour, which is how `simple-icons` treats
 *  such logos too. */
const BRAND_SOURCED = {
  /* langfuse-icon.svg (512×512) from github.com/langfuse/langfuse-docs
     /public, scaled ×24/512; flattened to the mark's lead red. */
  langfuse: {
    hex: "FF5D5F",
    path: "M11.941 14.168L13.371 15.316C13.371 15.316 14.465 14.504 15.27 14.385 16.113 14.26 17.013 14.73 17.848 15.291 19.108 16.138 20.168 17.213 20.168 17.213L21.41 15.994C21.41 15.994 17.985 12.283 15.27 12.619 13.488 12.839 11.941 14.168 11.941 14.168Z M3.762 7.092L2.59 8.381C2.59 8.381 5.855 11.427 8.426 11.427 9.598 11.427 11.223 10.509 12.621 9.317 13.418 8.637 14.309 7.865 15.199 7.865 15.798 7.865 16.587 8.182 17.332 9.015 17.332 9.015 17.813 8.727 18.105 8.52 18.363 8.338 18.745 8.027 18.745 8.027 17.674 6.884 16.125 6.049 15.199 6.131 13.699 6.131 12.621 7.065 11.285 8.145 9.949 9.224 9.387 9.67 8.426 9.67 6.809 9.67 3.762 7.092 3.762 7.092Z M3.762 16.91L2.59 15.621C2.59 15.621 5.855 12.574 8.426 12.574 9.598 12.574 11.223 13.492 12.621 14.685 13.418 15.365 14.309 16.137 15.199 16.137 15.801 16.137 16.584 15.807 17.332 14.965 17.332 14.965 17.782 15.242 18.059 15.434 18.343 15.631 18.762 15.957 18.762 15.957 17.69 17.109 16.13 17.953 15.199 17.871 13.699 17.871 12.809 17.076 11.473 15.996 10.137 14.916 9.387 14.332 8.426 14.332 6.809 14.332 3.762 16.91 3.762 16.91Z M19.043 9.996C18.738 10.207 18.246 10.512 18.246 10.512 18.246 10.512 18.527 11.121 18.527 11.941 18.527 12.762 18.27 13.465 18.27 13.465 18.27 13.465 18.711 13.741 18.996 13.934 19.292 14.134 19.746 14.473 19.746 14.473 19.746 14.473 20.285 13.348 20.285 11.941 20.285 10.535 19.746 9.48 19.746 9.48 19.746 9.48 19.323 9.803 19.043 9.996Z M12.012 9.809L13.371 8.684C13.371 8.684 14.465 9.471 15.27 9.59 16.113 9.715 17.013 9.244 17.848 8.684 19.108 7.837 20.168 6.762 20.168 6.762L21.41 7.98C21.41 7.98 17.985 11.691 15.27 11.355 13.488 11.135 12.012 9.809 12.012 9.809Z M8.731 6.105C10.489 6.105 11.965 7.605 11.965 7.605 11.965 7.605 11.554 7.929 11.285 8.145 11.005 8.369 10.559 8.73 10.559 8.73 10.559 8.73 9.785 7.91 8.731 7.91 8.298 7.91 7.736 8.17 7.137 8.684 6.675 9.08 6.194 9.573 5.871 10.184 5.593 10.712 5.441 11.334 5.426 11.988 5.408 12.809 5.699 13.67 6.176 14.355 6.496 14.815 6.878 15.16 7.278 15.457 7.796 15.842 8.337 16.113 8.731 16.113 9.151 16.113 9.528 15.967 9.809 15.832 10.254 15.574 10.605 15.27 10.605 15.27L11.988 16.418C11.988 16.418 11.426 16.98 10.653 17.402 10.153 17.649 9.511 17.895 8.731 17.895 7.951 17.895 7.046 17.48 6.199 16.84 5.652 16.426 5.116 15.935 4.699 15.34 4.017 14.364 3.666 13.177 3.668 11.988 3.67 10.784 4.059 9.592 4.746 8.613 5.824 7.207 7.419 6.105 8.731 6.105Z",
  },
  /* The scalingo.com site mark (32×32, single path, official red), scaled
     ×24/32. */
  scalingo: {
    hex: "D42327",
    path: "M6.43 5.48s11.14-1.114 11.139-2.971v4.456s0 1.857-11.139 2.971z m0.047 5.942s11.14-1.114 11.14-2.971v4.456s0 1.857-11.14 2.97z m0 5.941s11.14-1.114 11.14-2.971v4.456s0 1.857-11.14 2.971z",
  },
};

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

const entries = [
  ...SLUGS.map((slug) => [slug, iconFor(slug)]),
  ...Object.entries(VENDORED),
  ...Object.entries(BRAND_SOURCED),
];

const body = entries
  .map(([slug, icon]) =>
    [
      `  ${slug}: {`,
      `    hex: ${JSON.stringify(icon.hex)},`,
      `    path: ${JSON.stringify(icon.path)},`,
      `  },`,
    ].join("\n")
  )
  .join("\n");

const FOOTER = `
} as const satisfies Record<string, StackIconData>;

export type StackIconSlug = keyof typeof STACK_ICONS;
`;

writeFileSync(join(root, "lib", "stack-icons.ts"), HEADER + body + FOOTER);

console.log(`Wrote ${entries.length} icons to lib/stack-icons.ts`);
