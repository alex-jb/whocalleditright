#!/usr/bin/env node
/**
 * Generate 19 editorial-style fund manager portraits via OpenAI gpt-image-1.
 * Reads OPENAI_API_KEY from .env.local in this repo.
 *
 * Style: 1970s Time Magazine cover editorial illustration —
 * heavy contrast lines, muted palette (off-white #F5F4EE, charcoal,
 * single muted orange #E45A2A), NOT photorealistic, no text in image.
 *
 * Each portrait is a metaphor (NOT a description of the real person).
 * See PORTRAITS below for per-fund style cues.
 *
 * Output: public/portraits/<slug>.png  (1024x1024)
 *
 * Usage:
 *   node scripts/gen_portraits.mjs              # all 19
 *   node scripts/gen_portraits.mjs <slug>...    # just listed slugs
 *
 * Cost ballpark: gpt-image-1 at 1024x1024 is ~$0.04/image -> ~$0.76 for the set.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "public", "portraits");
mkdirSync(OUT, { recursive: true });

// Light .env.local loader (no dotenv dep)
try {
  const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  /* no .env.local — rely on shell env */
}

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY. Put it in .env.local or export it.");
  process.exit(1);
}

const STYLE_PREFIX = [
  "Editorial stylized portrait illustration of a hedge fund manager,",
  "in the style of a 1970s Time Magazine cover.",
  "NOT photo-realistic. Heavy contrast lines, muted color palette",
  "(off-white #F5F4EE, charcoal, single muted orange accent #E45A2A).",
].join(" ");

const STYLE_SUFFIX = [
  "Background: off-white #F5F4EE solid.",
  "Square format. No text in image. No logos. No watermarks.",
  "Composition: editorial magazine cover, head-and-shoulders or 3/4 body.",
].join(" ");

const PORTRAITS = {
  druckenmiller: "The subject stands in front of a wall of stacked old computer monitors, profile view.",
  tepper: "The subject wears reflective aviator sunglasses with a stock ticker tape visible inside the lens.",
  burry: "Hooded silhouette with one eye visible, calculator floating in hand.",
  "cathie-wood": "The subject looks up at orbital trajectory lines arcing overhead, wearing a minimalist white blazer.",
  ackman: "The subject stands at a podium under a single white spotlight, papers in hand.",
  buffett: "Old library armchair, the subject holds a newspaper, single desk lamp glow.",
  icahn: "Heavy overcoat, the subject holds a phone receiver, standing behind frosted glass.",
  dalio: "The subject stands in front of a giant abstract risk-radar diagram on a wall.",
  einhorn: "Half-shadowed face, eyeshade visor, scattered note paper around the subject's feet.",
  marks: "Old oak desk with leather notebook, mountains visible through the window behind the subject.",
  miller: "The subject wears a checkered scarf, walking down a long corridor receding into perspective.",
  gundlach: "The subject stands in front of a giant US Treasury bond certificate poster.",
  "tom-lee": "The subject holds a chart with an upward arrow, slight smile, business-casual.",
  "lyn-alden": "The subject stands on a hilltop overlooking a financial district at dusk.",
  spitznagel: "Black umbrella tipped down, raindrops, sharp profile silhouette.",
  cole: "Vintage trading floor jacket, the subject holds a pocket watch, smoke effects in the air.",
  "el-erian": "The subject holds a globe, with shipping container silhouettes in the background.",
  greenblatt: "Crossword puzzle visible on desk, magnifying glass, library backdrop.",
  gerstner: "The subject stands at a wall of multi-panel screens showing semiconductor wafers.",
};

async function generate(slug, cue) {
  const prompt = `${STYLE_PREFIX} ${cue} ${STYLE_SUFFIX}`;
  console.log(`\n→ ${slug}`);
  console.log(`  cue: ${cue}`);
  const t0 = Date.now();
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt,
      size: "1024x1024",
      n: 1,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error(`  ✗ ${res.status} ${txt.slice(0, 200)}`);
    return;
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) {
    console.error("  ✗ no image data");
    console.error("  response:", JSON.stringify(data).slice(0, 300));
    return;
  }
  const buf = Buffer.from(b64, "base64");
  const dst = resolve(OUT, `${slug}.png`);
  writeFileSync(dst, buf);
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`  ✓ ${dst.replace(ROOT + "/", "")} (${(buf.length / 1024).toFixed(0)} KB, ${sec}s)`);
}

const targets = process.argv.slice(2);
const list = targets.length ? targets : Object.keys(PORTRAITS);

for (const slug of list) {
  const cue = PORTRAITS[slug];
  if (!cue) {
    console.warn(`Skipping unknown slug: ${slug}`);
    continue;
  }
  await generate(slug, cue);
}

console.log(`\nDone. ${list.length} portraits in public/portraits/`);
