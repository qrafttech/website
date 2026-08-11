/**
 * Build-time generator for the site-wide paper-grain tile.
 *
 *   node scripts/gen-grain.mjs   ->  public/images/grain.png  (128x128, 8-bit grey)
 *
 * The noise is the SVG `feTurbulence` algorithm, transcribed from the reference
 * implementation in the SVG 1.1 Filter Effects chapter, run with
 * `type="fractalNoise"` and `stitchTiles="stitch"` so the 128x128 result tiles
 * seamlessly. Baking it here means the site ships one committed PNG: zero JS,
 * zero runtime SVG filter, nothing fetched or computed in the browser.
 *
 * Re-run this script only if the constants below change; the output is
 * deterministic for a given SEED.
 */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const TILE = 128;
const SEED = 7;
const BASE_FREQUENCY = 0.8;
const NUM_OCTAVES = 4;
// Remap the raw noise into [FLOOR, 1]. Under `mix-blend-mode: multiply` at
// opacity .035 a value of 1 is "no ink"; FLOOR sets the darkest speck.
const FLOOR = 0.22;

/* ------------------------------------------------------------------ *
 * feTurbulence — SVG 1.1, 15.7.6 "Filter primitive 'feTurbulence'"    *
 * ------------------------------------------------------------------ */

const BSize = 0x100;
const BM = 0xff;
const PerlinN = 0x1000;

const RAND_m = 2147483647; // 2**31 - 1
const RAND_a = 16807; // 7**5
const RAND_q = 127773; // m / a
const RAND_r = 2836; // m % a

function setupSeed(lSeed) {
  let s = lSeed;
  if (s <= 0) s = -(s % (RAND_m - 1)) + 1;
  if (s > RAND_m - 1) s = RAND_m - 1;
  return s;
}

function random(lSeed) {
  let result = RAND_a * (lSeed % RAND_q) - RAND_r * Math.floor(lSeed / RAND_q);
  if (result <= 0) result += RAND_m;
  return result;
}

function init(lSeed) {
  const uLatticeSelector = new Int32Array(BSize + BSize + 2);
  // 4 channels x (BSize + BSize + 2) x 2 gradient components
  const fGradient = [];
  for (let k = 0; k < 4; k++)
    fGradient.push(new Float64Array((BSize + BSize + 2) * 2));

  let seed = setupSeed(lSeed);
  let i;
  for (let k = 0; k < 4; k++) {
    for (i = 0; i < BSize; i++) {
      if (k === 0) uLatticeSelector[i] = i;
    }
  }
  for (i = 0; i < BSize; i++) {
    uLatticeSelector[i] = i;
    for (let k = 0; k < 4; k++) {
      let a, b;
      seed = random(seed);
      a = ((seed % (BSize + BSize)) - BSize) / BSize;
      seed = random(seed);
      b = ((seed % (BSize + BSize)) - BSize) / BSize;
      const s = Math.sqrt(a * a + b * b);
      if (s !== 0) {
        a /= s;
        b /= s;
      }
      fGradient[k][i * 2] = a;
      fGradient[k][i * 2 + 1] = b;
    }
  }
  while (--i) {
    const k = uLatticeSelector[i];
    seed = random(seed);
    const j = seed % BSize;
    uLatticeSelector[i] = uLatticeSelector[j];
    uLatticeSelector[j] = k;
  }
  for (i = 0; i < BSize + 2; i++) {
    uLatticeSelector[BSize + i] = uLatticeSelector[i];
    for (let k = 0; k < 4; k++) {
      fGradient[k][(BSize + i) * 2] = fGradient[k][i * 2];
      fGradient[k][(BSize + i) * 2 + 1] = fGradient[k][i * 2 + 1];
    }
  }
  return { uLatticeSelector, fGradient };
}

const sCurve = (t) => t * t * (3 - 2 * t);
const lerp = (t, a, b) => a + t * (b - a);

function noise2(lattice, channel, vx, vy, stitch) {
  const { uLatticeSelector, fGradient } = lattice;

  let t = vx + PerlinN;
  let bx0 = Math.floor(t) & BM;
  let bx1 = (bx0 + 1) & BM;
  const rx0 = t - Math.floor(t);
  const rx1 = rx0 - 1;

  t = vy + PerlinN;
  let by0 = Math.floor(t) & BM;
  let by1 = (by0 + 1) & BM;
  const ry0 = t - Math.floor(t);
  const ry1 = ry0 - 1;

  if (stitch) {
    // Wrap lattice coordinates back into the tile so edges meet.
    if (bx0 >= stitch.nWrapX) bx0 -= stitch.nWidth;
    if (bx1 >= stitch.nWrapX) bx1 -= stitch.nWidth;
    if (by0 >= stitch.nWrapY) by0 -= stitch.nHeight;
    if (by1 >= stitch.nWrapY) by1 -= stitch.nHeight;
  }
  bx0 &= BM;
  bx1 &= BM;
  by0 &= BM;
  by1 &= BM;

  const i = uLatticeSelector[bx0];
  const j = uLatticeSelector[bx1];
  const b00 = uLatticeSelector[i + by0];
  const b10 = uLatticeSelector[j + by0];
  const b01 = uLatticeSelector[i + by1];
  const b11 = uLatticeSelector[j + by1];

  const sx = sCurve(rx0);
  const sy = sCurve(ry0);
  const g = fGradient[channel];

  let u = rx0 * g[b00 * 2] + ry0 * g[b00 * 2 + 1];
  let v = rx1 * g[b10 * 2] + ry0 * g[b10 * 2 + 1];
  const a = lerp(sx, u, v);
  u = rx0 * g[b01 * 2] + ry1 * g[b01 * 2 + 1];
  v = rx1 * g[b11 * 2] + ry1 * g[b11 * 2 + 1];
  const b = lerp(sx, u, v);
  return lerp(sy, a, b);
}

function turbulence(
  lattice,
  channel,
  x,
  y,
  baseFreqX,
  baseFreqY,
  numOctaves,
  stitchTile
) {
  let stitch = null;
  let fx = baseFreqX;
  let fy = baseFreqY;

  if (stitchTile) {
    // Adjust the base frequency so an integral number of periods fits the tile.
    if (fx !== 0) {
      const loFreq = Math.floor(stitchTile.width * fx) / stitchTile.width;
      const hiFreq = Math.ceil(stitchTile.width * fx) / stitchTile.width;
      fx = fx / loFreq < hiFreq / fx ? loFreq : hiFreq;
    }
    if (fy !== 0) {
      const loFreq = Math.floor(stitchTile.height * fy) / stitchTile.height;
      const hiFreq = Math.ceil(stitchTile.height * fy) / stitchTile.height;
      fy = fy / loFreq < hiFreq / fy ? loFreq : hiFreq;
    }
    stitch = {
      nWidth: Math.round(stitchTile.width * fx),
      nWrapX: (stitchTile.x * fx + PerlinN + stitchTile.width * fx) | 0,
      nHeight: Math.round(stitchTile.height * fy),
      nWrapY: (stitchTile.y * fy + PerlinN + stitchTile.height * fy) | 0,
    };
  }

  let sum = 0;
  let vx = x * fx;
  let vy = y * fy;
  let ratio = 1;

  for (let octave = 0; octave < numOctaves; octave++) {
    // fractalNoise: signed sum (turbulence would sum absolute values).
    sum += noise2(lattice, channel, vx, vy, stitch) / ratio;
    vx *= 2;
    vy *= 2;
    ratio *= 2;
    if (stitch) {
      stitch = {
        nWidth: stitch.nWidth * 2,
        nWrapX: 2 * stitch.nWrapX - PerlinN,
        nHeight: stitch.nHeight * 2,
        nWrapY: 2 * stitch.nWrapY - PerlinN,
      };
    }
  }
  return sum;
}

/* ------------------------------------------------------------------ *
 * Minimal 8-bit greyscale PNG encoder                                  *
 * ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++)
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodeGreyPng(width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 0; // colour type: greyscale
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  const raw = Buffer.alloc((width + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width + 1)] = 0; // filter type: none
    pixels.copy(raw, y * (width + 1) + 1, y * width, (y + 1) * width);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------------ */

const lattice = init(SEED);
const stitchTile = { x: 0, y: 0, width: TILE, height: TILE };

const values = new Float64Array(TILE * TILE);
let min = Infinity;
let max = -Infinity;
for (let y = 0; y < TILE; y++) {
  for (let x = 0; x < TILE; x++) {
    const t = turbulence(
      lattice,
      0,
      x,
      y,
      BASE_FREQUENCY,
      BASE_FREQUENCY,
      NUM_OCTAVES,
      stitchTile
    );
    const v = (t + 1) / 2; // fractalNoise maps [-1,1] -> [0,1]
    values[y * TILE + x] = v;
    if (v < min) min = v;
    if (v > max) max = v;
  }
}

const pixels = Buffer.alloc(TILE * TILE);
for (let i = 0; i < values.length; i++) {
  const normalised = (values[i] - min) / (max - min);
  pixels[i] = Math.round((FLOOR + normalised * (1 - FLOOR)) * 255);
}

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "grain.png"
);
writeFileSync(out, encodeGreyPng(TILE, TILE, pixels));
console.log(
  `grain.png ${TILE}x${TILE} written (raw range ${min.toFixed(
    3
  )}..${max.toFixed(3)})`
);
