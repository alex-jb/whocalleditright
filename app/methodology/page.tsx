import type { Metadata } from 'next';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    'How the Who Called It Right Brier scorecard is computed, what data sources it pulls from, and what the v0 prototype intentionally omits.',
  alternates: {
    canonical: 'https://whocalleditright.com/methodology',
  },
};

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-20">
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        How this works
      </div>
      <h1 className="font-display mt-6 text-[clamp(3rem,7vw,6rem)] uppercase text-ink">
        Methodology
      </h1>

      <blockquote className="mt-12 border-l-4 border-accent bg-cream-deep px-6 py-6">
        <p className="editorial-pull text-ink">
          &ldquo;Probability is the very guide of life.&rdquo;
        </p>
        <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
          — Bishop Joseph Butler, 1736<sup>[1]</sup>
        </footer>
      </blockquote>

      <section className="prose-section mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 1
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            Data sources
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <ul className="space-y-4">
            <li>
              <strong className="text-ink">SEC EDGAR 13F-HR filings.</strong> Quarterly
              position disclosures required of institutional managers with $100M+ AUM.
              Filings are due 45 days after quarter end. Q1 2026 filings posted around
              2026-05-15.
            </li>
            <li>
              <strong className="text-ink">Public statements.</strong> Verifiable quotes
              from CNBC, Bloomberg, podcasts, X posts, and quarterly letters (Oaktree
              memos, GMO letters, ARK commentary).
            </li>
            <li>
              <strong className="text-ink">Price data.</strong> End-of-day closes from
              public market data providers, snapshot at the time of build.
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 2
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            From 13F to a &ldquo;call&rdquo;
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <p>
            A 13F shows quarter-end positions, not intra-quarter trades. We translate each
            delta into an implied directional view:
          </p>
          <ul className="mt-4 space-y-2 font-mono text-sm">
            <li>
              NEW or INCREASED <span className="text-ink-dim">→</span>{' '}
              <span className="text-tier-green">BULLISH</span>
            </li>
            <li>
              EXITED or DECREASED <span className="text-ink-dim">→</span>{' '}
              <span className="text-tier-red">BEARISH</span>
            </li>
            <li>
              HELD <span className="text-ink-dim">→</span>{' '}
              <span className="text-ink-dim">NEUTRAL (not scored in v0)</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 3
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            Brier scoring rule
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <p>
            Brier (1950)<sup>[2]</sup> = (forecast − outcome)². We treat each directional call
            as a confidence-1 forecast and score against the realized 30-day move.
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <strong className="text-ink">Bullish call:</strong> outcome = 1 if price moved
              up (≥ 0%), else 0.
            </li>
            <li>
              <strong className="text-ink">Bearish call:</strong> outcome = 1 if price moved
              down (≤ 0%), else 0.
            </li>
            <li>
              Magnitude weight scales the penalty: a 2% wrong move is less bad than a 20%
              wrong move. Floor 0, cap 1.
            </li>
          </ul>
          <p className="mt-4">
            Lower Brier = better calibration.{' '}
            <code className="font-mono text-tier-green">0.00</code> means perfect;{' '}
            <code className="font-mono text-tier-red">1.00</code> means maximally wrong.
          </p>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 4
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            Color tiers
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <ul className="space-y-2">
            <li>
              <span className="font-mono text-tier-green">green</span> ≤ 0.20 — well-calibrated
            </li>
            <li>
              <span className="font-mono text-tier-yellow">yellow</span> 0.21 to 0.40 — mixed
            </li>
            <li>
              <span className="font-mono text-tier-red">red</span> &gt; 0.40 — poorly calibrated
              for this set
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 5
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            What v0 skips
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <ul className="space-y-4">
            <li>
              <strong className="text-ink">Position sizing.</strong> A 0.1% portfolio nibble
              and a 5% conviction add count the same. A production version would weight by
              % of fund AUM.
            </li>
            <li>
              <strong className="text-ink">Risk-adjusted returns.</strong> Raw price move
              only. No beta adjustment, no sector hedge attribution.
            </li>
            <li>
              <strong className="text-ink">Probabilistic forecasts.</strong> Real Brier
              expects a stated probability (e.g., &ldquo;65% chance NVDA up by year-end&rdquo;).
              13F filings don&apos;t disclose probabilities. We use confidence=1 as a coarse
              approximation.<sup>[3]</sup>
            </li>
            <li>
              <strong className="text-ink">Selection bias.</strong> We track 5 of 19 funds
              with real Q1 data; the other 14 are stubs. Roster will fill in as 13Fs are
              parsed.
            </li>
            <li>
              <strong className="text-ink">Survivorship bias.</strong> We only score
              positions disclosed. Closed positions we don&apos;t see don&apos;t penalize.
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 6
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            Update cadence
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <p>
            Data lives in{' '}
            <a
              href="https://github.com/alex-jb/whocalleditright-data"
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link text-ink"
            >
              github.com/alex-jb/whocalleditright-data
            </a>
            . The site re-fetches every 30 minutes (ISR). Quarterly 13Fs land in Feb / May
            / Aug / Nov; we re-score the prior quarter when new data arrives. Public
            statement calls update continuously.
          </p>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 7
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            Not financial advice
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <p>
            This site is a research and calibration audit. It is not investment advice, an
            offer to sell, or a solicitation. The author holds no positions in any name
            shown. Past calibration does not predict future calibration.
          </p>
        </div>
      </section>

      <footer className="mt-20 border-t border-rule pt-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
          References
        </div>
        <ol className="mt-4 space-y-2 font-mono text-[11px] leading-relaxed text-ink-soft">
          <li>
            [1] Butler, J. (1736). <em>The Analogy of Religion, Natural and Revealed</em>.
            London.
          </li>
          <li>
            [2] Brier, G. W. (1950). &ldquo;Verification of forecasts expressed in terms of
            probability.&rdquo; <em>Monthly Weather Review</em>, 78(1), 1–3.
          </li>
          <li>
            [3] Gneiting, T., &amp; Raftery, A. E. (2007). &ldquo;Strictly proper scoring rules,
            prediction, and estimation.&rdquo;{' '}
            <em>Journal of the American Statistical Association</em>, 102(477), 359–378.
          </li>
        </ol>
      </footer>
    </article>
  );
}
