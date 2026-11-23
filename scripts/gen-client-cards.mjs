/**
 * The link-preview image of each case study: `public/images/social/<slug>.jpg`.
 *
 * A screenshot alone reads as the client's own site. So the card is the
 * site's (same paper, same border), with the Qraft lockup, the client's logo
 * and the screenshot of the product. Run it after adding a client:
 *
 *   yarn gen:client-cards
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const PAPER = "#fbfbf8";
const LINE = "#e4e3de";
const OUT = "public/images/social";

/** slug → [logo, screenshot], either may be missing. */
const CLIENTS = {
  billi: ["billi-logo.svg", "billi1.png"],
  cevidentia: ["cevidentia-logo.svg", "cevidentia2.webp"],
  easiware: ["easiware-logo.svg", "easiware-screenshot.jpg"],
  embarq: ["embarq-logo.svg", "embarq-screenshot.jpg"],
  bruno: ["bruno-logo.png", "bruno-screenshot.jpg"],
  chloe: ["chloe-logo.svg", "chloe-screenshot.jpg"],
  sante: [null, "sante-screenshot.jpg"],
  episto: ["episto-logo.svg", null],
  hellio: ["hellio-logo.svg", null],
};

const svg = (body) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">${body}</svg>`
  );

/** The Qraft lockup, cut out of the site's own card. */
const lockup = (height) =>
  sharp("public/favicons/thumbnail.png")
    .extract({ left: 100, top: 160, width: 382, height: 152 })
    .resize({ height })
    .toBuffer({ resolveWithObject: true });

const logo = (file, width, height) =>
  sharp(`public/images/logos/clients/${file}`, { density: 400 })
    .resize(width, height, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });

const times = (x, y, size) =>
  `<path d="M${x} ${y}l${size} ${size}m0 ${-size}l${-size} ${size}" stroke="#9b9a94" stroke-width="2.5" stroke-linecap="round"/>`;

/** The screenshot, whole, in a rounded frame on the right of the card. */
async function frame(file) {
  const box = { left: 452, top: 64, width: 684, height: 502 };
  const shot = await sharp(`public/images/${file}`)
    .flatten({ background: "#ffffff" })
    .resize(box.width, box.height, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = shot.info;
  const left = box.left + Math.round((box.width - width) / 2);
  const top = box.top + Math.round((box.height - height) / 2);
  const rect = (extra) =>
    `<rect x="${left}" y="${top}" width="${width}" height="${height}" rx="14" ${extra}/>`;

  const shadow = await sharp(
    svg(rect(`fill="#000" opacity="0.16" transform="translate(0 10)"`))
  )
    .blur(18)
    .toBuffer();
  const rounded = await sharp(shot.data)
    .ensureAlpha()
    .composite([
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="14"/></svg>`
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  return [
    { input: shadow },
    { input: rounded, left, top },
    { input: svg(rect(`fill="none" stroke="${LINE}" stroke-width="1.5"`)) },
  ];
}

/** Qraft × client, stacked on the left when there is a screenshot beside it. */
async function brand(logoFile, stacked) {
  const qraft = await lockup(stacked ? 84 : 104);
  const client =
    logoFile && (await logo(logoFile, stacked ? 280 : 340, stacked ? 76 : 96));
  const cross = stacked ? 18 : 26;
  const gap = stacked ? 30 : 52;

  if (stacked) {
    const total =
      qraft.info.height + (client ? 2 * gap + cross + client.info.height : 0);
    const top = Math.round((HEIGHT - total) / 2);
    const left = 76;
    return [
      { input: qraft.data, left, top },
      ...(client
        ? [
            {
              input: svg(times(left + 4, top + qraft.info.height + gap, cross)),
            },
            {
              input: client.data,
              left,
              top: top + qraft.info.height + 2 * gap + cross,
            },
          ]
        : []),
    ];
  }

  const total = qraft.info.width + 2 * gap + cross + client.info.width;
  const left = Math.round((WIDTH - total) / 2);
  const middle = (height) => Math.round((HEIGHT - height) / 2);
  return [
    { input: qraft.data, left, top: middle(qraft.info.height) },
    { input: svg(times(left + qraft.info.width + gap, middle(cross), cross)) },
    {
      input: client.data,
      left: left + qraft.info.width + 2 * gap + cross,
      top: middle(client.info.height),
    },
  ];
}

mkdirSync(OUT, { recursive: true });

for (const [slug, [logoFile, screenshot]] of Object.entries(CLIENTS)) {
  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: PAPER },
  })
    .composite([
      {
        input: svg(
          `<rect x="1" y="1" width="${WIDTH - 2}" height="${
            HEIGHT - 2
          }" fill="none" stroke="${LINE}" stroke-width="2"/>`
        ),
      },
      ...(screenshot ? await frame(screenshot) : []),
      ...(await brand(logoFile, Boolean(screenshot))),
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT}/${slug}.jpg`);
  console.log(`${OUT}/${slug}.jpg`);
}
