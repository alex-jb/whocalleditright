# AGENTS.md — whocalleditright

Project rules for LLM agents (Claude Code, Cursor, Codex) working on this codebase.

## Tech contract

- **Next.js 16** + React 19 server components.
- **TypeScript** strict mode.
- **Tailwind CSS 4** with custom editorial palette (see `app/globals.css` + `DESIGN.md`).
- **ISR** every 30 minutes — zero client-side data fetching.
- **No DB, no auth.** Data is read from `data/funds/*.json` (local seed) or `github.com/alex-jb/whocalleditright-data` raw (remote mode).
- **Deployed:** Vercel.

## Voice + content rules

These are HARD rules. Style violations get caught in PR review.

- **No em dashes.** Use period or comma.
- **No emoji** in user-facing copy.
- **No AI buzzwords:** delve, comprehensive, robust, leverage, seamless, cutting-edge.
- **Bilingual rule:** README + public docs ship EN + zh-CN side-by-side.
- **Voice template:** Bloomberg-meets-Brandly. Factual, sparse, non-hyperbolic.

See `DESIGN.md` § 5 (Voice) for full rules.

## Visual rules

The whole visual contract lives in `DESIGN.md` (9-section schema). Read it before any UI change. Highlights:

- 1970s Time-magazine editorial aesthetic. Off-white `#F5F4EE` background.
- Single muted-orange accent `#E45A2A`. Never introduce a second accent.
- Inter Tight 900 display + Inter Tight 400 body + JetBrains Mono tickers.
- Zero scroll animation. Zero hover-lift. Zero drop shadows.
- 1px ink rule lines instead of shadows.

## Design

Taste Skill available at `.claude/skills/taste-skill/` — invoke for visual design decisions (anti-AI-slop guidance for landing pages / hero surfaces / redesigns).

## Build cost discipline

Same rule as VibeXForge: `npm run build` locally before every `git push`. Vercel build minutes are billed per push. Batch commits.

## Data integrity

- Brier scoring in `lib/brier/compute.ts` MUST match the Python implementation in `~/.solo-founder-os/markets/whocalleditright_sync.py`. Both compute the same number from the same input — if one changes, the other does too.
- Portraits are 1970s-Time-style metaphor illustrations, NOT photo likenesses (right-of-publicity).
- Seed JSONs in `data/funds/*.json` are the local-mode fallback. Remote mode reads from the public data repo.

## Memory

- Druckenmiller called the AI peak in Q1 2026 13F — that call is the hero example. See `components/HeroDruckenmillerCallout.tsx`.
- 19 funds tracked. CIK list lives in the Python sync script, not in this repo.
