# whocalleditright.com — Launch Plan

Target: ship to production this week. Soft-launch on X then HN.

---

## 0. Pre-launch checklist

- [ ] `npm install` runs clean
- [ ] `npm run build` passes locally (REQUIRED before push — Vercel build minutes cost real $)
- [ ] `npm run typecheck` clean
- [ ] Generate the 19 real portraits via `bash scripts/gen_portraits.sh` (replaces procedural placeholders in `public/portraits/`)
- [ ] Visit `localhost:3000` and verify:
  - [ ] Hero displays the Druckenmiller portrait, big "WHO / CALLED IT / RIGHT" display headline, and the editorial 2-column body
  - [ ] Leaderboard shows Burry on top (Brier 0.022), Druckenmiller #2 (0.113)
  - [ ] All 19 funds render (5 with data, 14 as stubs at reduced opacity)
  - [ ] `/fund/druckenmiller` shows 6 calls including the GOOGL/AMZN exits in the editorial layout
  - [ ] Each call card has a working "Share this take ↗" twitter intent link
  - [ ] `/methodology` and `/about` render with the editorial 2-column body + footnoted references
  - [ ] `/not-a-real-fund` shows the editorial 404
- [ ] Lighthouse on `localhost`: confirm ≥95 perf / 100 SEO / 100 a11y

---

## 1. Create the data repo

```bash
# On Alex's laptop
cd ~/Desktop
gh repo create alex-jb/whocalleditright-data --public \
  --description "Public Brier scorecard data feed for whocalleditright.com" \
  --license MIT
cd whocalleditright-data
mkdir -p data/funds
cp /Users/alexji/Desktop/whosecallwasright/data/funds/*.json data/funds/

cat > README.md <<'EOF'
# whocalleditright-data

Public JSON feed for [whocalleditright.com](https://whocalleditright.com).

One file per fund manager at `data/funds/<slug>.json`. Schema in
[whocalleditright/lib/types.ts](https://github.com/alex-jb/whocalleditright/blob/main/lib/types.ts).

Updated by `whocalleditright_sync.py` from the local 13F tracker daily.
EOF

git add -A
git commit -m "seed: 5 full Q1 2026 funds + 14 stubs"
git push -u origin main
```

---

## 2. Domain DNS (Namecheap → Vercel)

1. Buy `whocalleditright.com` on Namecheap (~$13/yr).
2. In Namecheap → Domain List → Manage → Advanced DNS.
3. Delete default records. Add:
   - `A` record, host `@`, value `76.76.21.21`, TTL automatic
   - `CNAME` record, host `www`, value `cname.vercel-dns.com.`, TTL automatic
4. Wait 5-15 min for DNS to propagate.

Verify with `dig whocalleditright.com` — should resolve to a Vercel IP.

---

## 3. Vercel deploy

```bash
cd /Users/alexji/Desktop/whosecallwasright   # folder name unchanged

# First push to GitHub (DON'T push before npm run build passes locally)
gh repo create alex-jb/whocalleditright --public \
  --description "Public Brier scorecard for 19 hedge fund managers — editorial 1970s Time Magazine aesthetic" \
  --source . --remote origin
git add -A
git commit -m "feat: scaffold v0 + editorial rebrand to whocalleditright"
git push -u origin main

# Then connect to Vercel
~/.local/node/bin/vercel link --yes
~/.local/node/bin/vercel env add NEXT_PUBLIC_WHOSECALL_DATA_MODE production
# enter: remote
~/.local/node/bin/vercel env add NEXT_PUBLIC_WHOSECALL_DATA_BASE_URL production
# enter: https://raw.githubusercontent.com/alex-jb/whocalleditright-data/main/data/funds

~/.local/node/bin/vercel --prod --force --yes
```

Then in Vercel dashboard → Project → Settings → Domains → add `whocalleditright.com` and `www.whocalleditright.com` → set canonical to apex.

---

## 4. Smoke test prod

```bash
curl -sI https://whocalleditright.com | head -5
# Expect: HTTP/2 200

curl -s https://whocalleditright.com/ | grep -o "Druckenmiller dumped" | head -1
# Expect: Druckenmiller dumped

curl -s https://whocalleditright.com/fund/druckenmiller | grep -o "GOOGL"
# Expect: matches

curl -sI https://whocalleditright.com/opengraph-image | head -3
# Expect: HTTP/2 200, content-type: image/png
```

Manually:
- Visit on mobile (375px). Hero should stack (display headline first, portrait below), leaderboard collapses to 1 column.
- Share URL into a Discord/Slack and confirm OG card renders the editorial off-white Druckenmiller hook.

---

## 5. Post-launch viral X thread template

Post these at 9:30am ET Monday or 10am ET Tuesday for best reach.

> Stanley Druckenmiller dumped $GOOGL and $AMZN in his Q1 2026 13F filing.
>
> The 13F posted May 15th.
>
> Three weeks later — Friday June 5th — the NASDAQ dropped 4.2%. The worst day in 14 months.
>
> GOOGL -7%. AMZN -5%.
>
> Nobody tracks this systematically. So I built it. 🧵

(Then 6-tweet thread, one per number)

> 2/ I scored every Q1 2026 13F change for 19 of the most-cited fund managers and pundits using Brier scores — the standard statistical measure for forecast calibration.
>
> Lower Brier = better caller. 0 is perfect, 1 is maximally wrong.

> 3/ Burry tops the board at 0.022 (NVDA + PLTR puts paying off, BABA conviction up 28%).
>
> Druckenmiller: 0.113 (5/6 correct including the GOOGL+AMZN exits).
>
> Cathie Wood: 0.416 (long GOOGL/META right before the drop).

> 4/ Why this site:
>
> - The half-life of a bad call is 3 news cycles. Brier scores don't forget.
> - Calibration is rare. Loud opinions are not.
> - Track 10+ calls before you decide who to follow.

> 5/ Tech stack for the curious:
>
> - SEC EDGAR poller (Python, cron'd daily)
> - JSON → GitHub raw → Next.js 16 server components
> - 0 client JS for data, ISR every 30 min
> - Zero database
> - Editorial design: Inter Tight Black + JetBrains Mono, off-white #F5F4EE, muted-orange accent
>
> Code: github.com/alex-jb/whocalleditright

> 6/ It's part of Solo Founder OS, the 11-agent stack I'm building to run the operations of a one-person company.
>
> Site: whocalleditright.com
> Data: github.com/alex-jb/whocalleditright-data
> Methodology: whocalleditright.com/methodology

> 7/ Caveats: 5 of 19 funds have Q1 2026 data; the other 14 are stubs while I parse 13Fs. v0 doesn't weight by position size and uses confidence-1 forecasts. All called out in the methodology page.
>
> Will be tightening this over the next two quarters.

---

## 6. Reddit / HN

- **r/SecurityAnalysis**: title "Brier-scored leaderboard for 19 hedge fund managers, based on Q1 2026 13Fs"
- **r/dataisbeautiful**: with a screenshot of the editorial leaderboard grid
- **HN Show**: "Show HN: Brier scorecard for 19 hedge fund managers — editorial 1970s Time aesthetic"

---

## 7. After 48 hours

- [ ] Check analytics for which fund pages got most hits
- [ ] Reply to every comment under the X thread (Cluely-style)
- [ ] If the Druckenmiller framing landed, write a follow-up post:
      "Here's what Druckenmiller bought instead" (TSM, MU, AVGO)
- [ ] Schedule weekly Sunday retro post: "This week's biggest Brier swings"
