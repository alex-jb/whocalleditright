import Image from 'next/image';

/**
 * Editorial hero. Brutalist + 1970s-Time-cover composition:
 *
 *   Left 60%:  giant 4-line display headline "WHO / CALLED / IT / RIGHT"
 *              + editorial 2-paragraph subhead
 *              + solid-black pill CTA
 *
 *   Right 40%: single stylized portrait of Druckenmiller
 *              (placeholder gradient until scripts/gen_portraits.sh runs)
 *
 * Below: the verbatim Druckenmiller story callout in a 2-column editorial
 * pull, orange accent rule on the left side. Copy is unchanged from spec.
 */
export function HeroDruckenmillerCallout() {
  return (
    <section
      aria-labelledby="hero-headline"
      className="border-b border-rule"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
        {/* LEFT — display headline + sub + CTA */}
        <div className="col-span-12 lg:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            Issue 01 · Q1 2026 13F filings
          </div>
          <h1
            id="hero-headline"
            className="font-display mt-6 text-[clamp(3.5rem,9vw,8.5rem)] uppercase text-ink"
          >
            Who<br />Called&nbsp;It<br />Right
          </h1>
          <p className="editorial-body mt-8 max-w-xl text-lg leading-snug text-ink-soft">
            A public Brier scorecard for 19 of the most-cited hedge fund
            managers and macro pundits. Auto-updated from SEC 13F filings and
            verifiable public statements. Free. No paywall. No newsletter
            capture.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#leaderboard"
              className="inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-cream transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
            >
              See the leaderboard
              <span aria-hidden>↓</span>
            </a>
            <a
              href="/methodology"
              className="editorial-link font-mono text-xs uppercase tracking-[0.22em] text-ink-soft"
            >
              Read methodology
            </a>
          </div>
        </div>

        {/* RIGHT — single big AI portrait, editorial 1970s Time cover frame */}
        <div className="col-span-12 lg:col-span-5">
          <figure className="relative">
            <div className="relative aspect-square w-full overflow-hidden border border-ink bg-cream-deep">
              <Image
                src="/portraits/druckenmiller.png"
                alt="Stylized editorial portrait of Stanley Druckenmiller, 1970s Time Magazine cover style"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute left-0 top-0 m-3 bg-cream px-2 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ink">
                Vol. 01 · No. 01
              </div>
              <div className="absolute bottom-0 right-0 m-3 bg-ink px-2 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-cream">
                Druckenmiller — Brier 0.113
              </div>
            </div>
            <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
              Stylized illustration. Not the subject's likeness.
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Editorial Druckenmiller callout — orange accent rule + 2-col body */}
      <div className="mx-auto max-w-7xl border-t border-rule px-6 py-16 sm:px-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-3">
            <div className="border-l-4 border-accent pl-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                Why this site exists
              </div>
              <p className="editorial-pull mt-4 text-ink">
                &ldquo;He looks prescient. Nobody tracks this systematically.&rdquo;
              </p>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <div className="grid gap-6 text-ink-soft sm:grid-cols-2 sm:gap-10">
              <div className="editorial-body text-[15px]">
                <p>
                  Stanley Druckenmiller dumped{' '}
                  <span className="font-mono font-bold text-ink">$GOOGL</span>{' '}
                  and{' '}
                  <span className="font-mono font-bold text-ink">$AMZN</span> in
                  his Q1 2026 13F filing. The filing posted{' '}
                  <span className="font-mono text-ink">2026-05-15</span>.
                </p>
                <p className="mt-4">
                  Three weeks later, Friday{' '}
                  <span className="font-mono text-ink">2026-06-05</span>: NASDAQ
                  down{' '}
                  <span className="font-mono font-bold text-tier-red">-4.2%</span>
                  , the worst single day in 14 months.{' '}
                  <span className="font-mono text-tier-red">GOOGL -7%</span>.{' '}
                  <span className="font-mono text-tier-red">AMZN -5%</span>.
                </p>
              </div>
              <div className="editorial-body text-[15px]">
                <p>
                  He looks prescient. But the half-life of a bad market call is
                  three news cycles. Loud opinions don&apos;t age. Brier scores do.
                </p>
                <p className="mt-4 text-ink">
                  So I built a public Brier scorecard for 19 of the most-cited
                  fund managers and pundits. You are three seconds from seeing
                  who else is calibrated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
