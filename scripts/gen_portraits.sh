#!/usr/bin/env bash
# Generate 19 fund-manager portraits via OpenAI gpt-image-1.
#
# Prereqs:
#   1. echo 'OPENAI_API_KEY=sk-...' >> .env.local   (already gitignored)
#   2. node >= 18 (uses built-in fetch)
#
# Run from the repo root:
#   bash scripts/gen_portraits.sh                # all 19, ~5 min, ~$0.76
#   bash scripts/gen_portraits.sh druckenmiller  # just one
#
# Output: public/portraits/<slug>.png  (1024x1024)
# Overwrites the procedural placeholders from make_placeholders.mjs.

set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.local ] && [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "Missing OPENAI_API_KEY. Add to .env.local or export it." >&2
  exit 1
fi

node scripts/gen_portraits.mjs "$@"
