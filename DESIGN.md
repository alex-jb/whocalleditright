# DESIGN.md — Whocalleditright

> Single source of truth for the visual identity of whocalleditright.
> LLM agents (Claude, Cursor, Codex) should read this before touching any UI.
> Format follows nexu-io/open-design 9-section schema.

---

## 1. Palette

Editorial 1970s Time-magazine ink-on-cream. Single warm accent. No gradients, no glassmorphism.

| Token | Hex | Use |
|---|---|---|
| `--color-cream` | `#F5F4EE` | Page background, body |
| `--color-cream-deep` | `#ECEAE0` | Card / panel background |
| `--color-ink` | `#0E0E0C` | Primary text, display headlines, focus outline |
| `--color-ink-soft` | `#2A2A26` | Body text |
| `--color-ink-dim` | `#6B6A63` | Meta text, captions |
| `--color-ink-mute` | `#9B998F` | Disabled, divider labels |
| `--color-rule` | `#1C1B19` | Heavy editorial rule lines |
| `--color-rule-soft` | `#C9C6BA` | Light dividers between paragraphs |
| `--color-accent` | `#E45A2A` | Muted orange — single accent for links, key callouts, selection |
| `--color-accent-soft` | `#F2DDD0` | Accent background wash |
| `--color-tier-green` | `#2F6E3A` | Correct call / good Brier (< 0.15) |
| `--color-tier-yellow` | `#B07A12` | Pending / mid-Brier (0.15–0.25) |
| `--color-tier-red` | `#B43321` | Missed call / bad Brier (> 0.25) |

**Hard rule:** ONE dominant ink + ONE accent (orange) per screen. Never co-introduce red and green outside the tier system.

---

## 2. Typography

| Role | Font | Weight | Tracking | Leading |
|---|---|---|---|---|
| Display headline | Inter Tight | 900 | -0.035em | 0.92 |
| Sub-headline | Inter Tight | 800 | -0.025em | 1.0 |
| Body | Inter Tight | 400 | normal | 1.55 |
| Pull-quote | Georgia (system serif) | italic | normal | 1.35 |
| Ticker / numbers | JetBrains Mono | 700 | -0.02em | 1.0 |

OpenType features `ss01` + `cv11` enabled site-wide. No web-font WOFF2 fallback issues — Inter Tight via `next/font/google`.

**No display-script fonts, no novelty fonts. Editorial sans only.**

---

## 3. Spacing

Tailwind 4 default scale (4px base). Editorial wide gutters at desktop, single-column at small.

- Page max-width: `max-w-6xl` (1152px), centered.
- Section vertical rhythm: `py-16` (64px) between major sections.
- Card padding: `p-6` (24px) inner.
- Column rule between body paragraphs via `.col-rule-divider` (1px `--color-rule-soft`).
- Mobile: collapse to single column at `md` (768px) breakpoint.

---

## 4. Motion

**Zero scroll animation. Zero parallax. Zero hover-lift transforms.**

Allowed motion:
- Editorial link underline reveal: `background-size 180ms ease-out` (in `.editorial-link`).
- Standard focus-visible outline (instantaneous).
- Page transitions: native Next.js (no Framer Motion, no GSAP).

If you find yourself reaching for `@keyframes`, stop. The aesthetic is print, not web.

---

## 5. Voice

Bloomberg-meets-Brandly. Factual, sparse, non-AI-buzzwordy.

**Do:**
- "Druckenmiller called the AI peak. Wrong by 14 months."
- "Brier 0.18. Top quintile."
- "Tracked since 2024-09."

**Don't:**
- "Comprehensive analysis of leading indicators..."
- "Delve into the nuances of..."
- "In the rapidly evolving landscape of..."
- Em dashes (use period or comma).
- Emoji in copy (per AGENTS.md project-wide).
- Exclamation marks.

---

## 6. Anti-patterns (NEVER ship)

- Gradients of any kind.
- Drop shadows on cards (use 1px ink rule instead).
- Hover lift / scale / rotate transforms.
- Emoji in user-facing copy.
- Em dashes in any prose.
- Centered hero over dark mesh / gradient.
- "Three equal feature cards" SaaS layout.
- AI-purple. Glassmorphism. Mesh gradients. Mirror balls.
- Generic `Inter + slate-900` LLM default.
- Multi-color brand splashes (more than 1 accent on screen).

---

## 7. Aesthetics

**1970s Time / Newsweek editorial.** Off-white newsprint cream. Heavy black ink display. Single muted-orange accent. Tight letter-spacing on huge sans-serif headlines. Chibi caricature portrait illustrations of forecasters (Druckenmiller, Burry, etc.) — flat, two-color, no shading.

Big numerical Brier scores as the centerpiece. Cards stack like magazine layout, not dashboard tiles. Editorial pull-quotes break up scrollable lists.

References (visual mood):
- Bloomberg Businessweek covers (2018–2022)
- 1970s Time magazine layouts
- Brandly's editorial-data hybrid

---

## 8. Components

| Component | File | Visual contract |
|---|---|---|
| `CallCard` | `components/CallCard.tsx` | Forecaster portrait (chibi, 64px) + name + call + outcome pill |
| `BrierBadge` | `components/BrierBadge.tsx` | Mono ticker number + tier color background |
| `FundCard` | `components/FundCard.tsx` | Fund name + key call summary + Brier score |
| `HeroDruckenmillerCallout` | `components/HeroDruckenmillerCallout.tsx` | Magazine pull-quote treatment for hero |
| Status pill | inline | "tracked" / "pending" — uppercase, mono, tier-colored |

All cards use 1px `--color-rule` border, NOT drop shadow. All numbers in JetBrains Mono. All names in Inter Tight 800.

---

## 9. References

Academic + cited sources surface in `/methodology`:

- Bishop Butler 1736 — *The Analogy of Religion* (origin of probability-as-rational-grounds doctrine).
- Glenn Brier 1950 — "Verification of Forecasts Expressed in Terms of Probability." *Monthly Weather Review*.
- Tilmann Gneiting & Adrian Raftery 2007 — "Strictly Proper Scoring Rules, Prediction, and Estimation." *JASA*.

Internal references:
- AGENTS.md (project root) — voice + content rules.
- README.md / README.zh-CN.md — bilingual launch positioning.
- LAUNCH_PLAN.md — distribution playbook.
- Taste Skill at `.claude/skills/taste-skill/` — invoke for any new visual decision.

---

*Last reviewed: 2026-06-06. Update when palette / typography / component contracts change.*
