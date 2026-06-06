#!/usr/bin/env node
/**
 * Emit 19 placeholder portrait PNGs (256x256 solid muted color with
 * per-slug hue) to public/portraits/<slug>.png so the UI has something
 * to render before Alex runs gen_portraits.sh.
 *
 * No external deps — just node:zlib + a hand-rolled PNG writer.
 * Replace the resulting files with real 1024x1024 outputs from
 * gen_portraits.sh whenever the OpenAI key is available.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "public", "portraits");
mkdirSync(OUT, { recursive: true });

const SLUGS = [
  "druckenmiller",
  "tepper",
  "burry",
  "cathie-wood",
  "ackman",
  "buffett",
  "icahn",
  "dalio",
  "einhorn",
  "marks",
  "miller",
  "gundlach",
  "tom-lee",
  "lyn-alden",
  "spitznagel",
  "cole",
  "el-erian",
  "greenblatt",
  "gerstner",
];

// Cream + charcoal + faint per-slug accent.
// Each PNG is a 256x256 grid with 32x32 cell variation so it reads as
// "stylized portrait placeholder" rather than a flat block.
const CREAM = [0xf5, 0xf4, 0xee];
const CHARCOAL = [0x1a, 0x1a, 0x18];
const ORANGE = [0xe4, 0x5a, 0x2a];

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function crc32(buf) {
  let c = ~0 >>> 0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  const crcBuf = Buffer.concat([typeBuf, data]);
  crc.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(slug) {
  const W = 256;
  const H = 256;
  const seed = hashStr(slug);
  // Each row: 1 filter byte + W*3 bytes (RGB)
  const rawRows = [];
  for (let y = 0; y < H; y++) {
    const row = Buffer.alloc(1 + W * 3);
    row[0] = 0; // filter: None
    for (let x = 0; x < W; x++) {
      // Editorial-style abstract pattern: vertical gradient cream -> charcoal
      // with one diagonal "orange accent stripe" whose angle depends on seed
      const t = y / H; // 0..1 vertical
      const baseR = Math.round(CREAM[0] + (CHARCOAL[0] - CREAM[0]) * t * 0.55);
      const baseG = Math.round(CREAM[1] + (CHARCOAL[1] - CREAM[1]) * t * 0.55);
      const baseB = Math.round(CREAM[2] + (CHARCOAL[2] - CREAM[2]) * t * 0.55);

      // Diagonal "1970s editorial" stripe — slope depends on slug.
      const slope = ((seed >>> 4) & 0x07) - 3; // -3..4
      const stripeY = Math.floor((x * (slope + 5)) / 8) % H;
      const onStripe = Math.abs(y - stripeY) < 2;

      // Soft vignette near edges (charcoal in corners)
      const dx = (x - W / 2) / (W / 2);
      const dy = (y - H / 2) / (H / 2);
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      const vignette = r * 0.35;

      // Per-slug "subject mass" — central darker oval (shoulders/head silhouette).
      const cx = W / 2;
      const cy = H * 0.62;
      const rx = W * 0.22;
      const ry = H * 0.30;
      const inMass = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1;
      const headCx = W / 2;
      const headCy = H * 0.32;
      const headR = W * 0.15;
      const inHead =
        ((x - headCx) / headR) ** 2 + ((y - headCy) / headR) ** 2 < 1;

      let R = baseR, G = baseG, B = baseB;
      if (inMass || inHead) {
        R = Math.round(R * 0.45);
        G = Math.round(G * 0.45);
        B = Math.round(B * 0.45);
      }
      if (onStripe) {
        R = ORANGE[0];
        G = ORANGE[1];
        B = ORANGE[2];
      }
      // Apply vignette
      R = Math.max(0, Math.min(255, Math.round(R * (1 - vignette))));
      G = Math.max(0, Math.min(255, Math.round(G * (1 - vignette))));
      B = Math.max(0, Math.min(255, Math.round(B * (1 - vignette))));

      row[1 + x * 3 + 0] = R;
      row[1 + x * 3 + 1] = G;
      row[1 + x * 3 + 2] = B;
    }
    rawRows.push(row);
  }
  const raw = Buffer.concat(rawRows);
  const idat = deflateSync(raw);

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const png = Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  return png;
}

for (const slug of SLUGS) {
  const buf = makePng(slug);
  const path = resolve(OUT, `${slug}.png`);
  writeFileSync(path, buf);
  console.log(`✓ ${slug}.png (${(buf.length / 1024).toFixed(1)} KB)`);
}

console.log(`\nWrote ${SLUGS.length} placeholder portraits to public/portraits/`);
console.log("Replace with real outputs from scripts/gen_portraits.sh when ready.");
