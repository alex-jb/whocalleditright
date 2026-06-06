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

// 2026-06-06 v2: switched from "1970s Time Magazine" editorial illustration
// to cute chibi caricature — the Trump-style cartoon Alex sent as reference.
// Big rounded head, small body, simple flat shading. Recognizable as the
// archetype the metaphor describes, but stylized as a friendly approachable
// cartoon. Reads better on small (80px) leaderboard avatars + matches the
// "audit the giants" tonal contrast (cute visual + serious Brier data).
const STYLE_PREFIX = [
  "Cute chibi caricature in flat 2D vector illustration style.",
  "Big rounded head, small body, simplified facial features, bold clean linework.",
  "Friendly approachable expression. Solid color blocks, minimal shading.",
  "Muted color palette: off-white background #F5F4EE, charcoal #0E0E0C linework,",
  "single muted-orange accent #E45A2A used sparingly for one prop or detail.",
].join(" ");

const STYLE_SUFFIX = [
  "Background: solid off-white #F5F4EE, no clutter.",
  "Square 1024x1024 format. NO text, NO logos, NO watermarks, NO photo-realism.",
  "Composition: chibi head-and-shoulders centered, character fills ~70% of frame.",
].join(" ");

const PORTRAITS = {
  druckenmiller: "An older hedge fund manager, white hair, wire-rim glasses, navy suit jacket and tie, holding a tiny laptop showing a downward stock chart in muted orange.",
  tepper: "A balding middle-aged man with a goofy confident grin, wearing oversized aviator sunglasses with a tiny stock ticker reflection in the lenses, dark suit.",
  burry: "A nervous-looking man with messy brown hair, wearing a casual t-shirt under an open dark blazer, holding a tiny calculator with a worried expression.",
  "cathie-wood": "A woman with short bobbed blonde hair, friendly smile, wearing a minimalist white blazer, looking up at tiny orbital trajectory lines arcing overhead.",
  ackman: "A tall man with neatly combed dark hair and confident smile, wearing a tailored grey suit, holding a stack of papers, standing under a tiny spotlight beam.",
  buffett: "An elderly cheerful man with white hair, large glasses, friendly grandfather expression, wearing a red tie and grey suit, holding a tiny rolled-up newspaper.",
  icahn: "An older man with white hair, intense scowl, wearing a heavy dark overcoat, holding a vintage rotary phone receiver to his ear.",
  dalio: "A bald older man with friendly meditative expression, wearing a casual grey sweater, standing in front of a tiny abstract risk-radar diagram on a wall.",
  einhorn: "A middle-aged man with brown hair and wire glasses, half-shadowed face, wearing a green eyeshade visor, scattered tiny note paper around his feet.",
  marks: "An elderly man with thinning white hair and a friendly smile, wearing a tan blazer, sitting at an old oak desk with a tiny leather notebook open.",
  miller: "A middle-aged man with grey hair, wearing a checkered scarf and dark overcoat, walking forward with a tiny perspective corridor receding behind him.",
  gundlach: "A middle-aged man with slicked-back dark hair, sharp suit, intense expression, standing in front of a tiny US Treasury bond certificate poster.",
  "tom-lee": "A middle-aged Asian-American man with glasses, big optimistic smile, business-casual blue shirt, holding a tiny chart with an upward orange arrow.",
  "lyn-alden": "A woman with long brown hair and friendly thoughtful expression, wearing a sweater, standing on a tiny hilltop overlooking a financial district at dusk.",
  spitznagel: "A bald middle-aged man with sharp serious profile, wearing a dark suit, holding a tiny black umbrella tipped down, tiny raindrops around him.",
  cole: "A middle-aged man with thoughtful expression, wearing a vintage tan trading floor jacket, holding a tiny pocket watch, faint smoke effects in the air.",
  "el-erian": "A middle-aged man with grey hair and warm smile, wearing a navy blazer, holding a tiny globe in one hand, tiny shipping container silhouettes behind him.",
  greenblatt: "A middle-aged man with curly grey hair, kind expression, wearing a brown corduroy blazer, holding a tiny magnifying glass over a crossword puzzle.",
  gerstner: "A middle-aged man with short dark hair, confident smile, wearing a casual blazer over a t-shirt, standing in front of tiny multi-panel screens showing semiconductor wafers.",
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
