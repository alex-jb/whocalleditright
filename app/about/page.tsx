import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who Called It Right is a solo-founder project auditing hedge fund calibration in public. Part of the Solo Founder OS stack.',
  alternates: {
    canonical: 'https://whocalleditright.com/about',
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-20">
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        Solo founder project
      </div>
      <h1 className="font-display mt-6 text-[clamp(3rem,7vw,6rem)] uppercase text-ink">
        About
      </h1>

      <blockquote className="mt-12 border-l-4 border-accent bg-cream-deep px-6 py-6">
        <p className="editorial-pull text-ink">
          &ldquo;Calibration is rare. Loud opinions are not.&rdquo;
        </p>
        <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
          — House style
        </footer>
      </blockquote>

      <section className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 1
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            What it is
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <p>
            <span className="text-ink">Who Called It Right</span> is a public Brier
            scorecard for 19 of the most-cited hedge fund managers and macro pundits.
            Calls come from SEC EDGAR 13F filings and verifiable public statements. The
            site re-fetches data every 30 minutes from{' '}
            <a
              href="https://github.com/alex-jb/whocalleditright-data"
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link text-ink"
            >
              github.com/alex-jb/whocalleditright-data
            </a>
            .
          </p>
          <p className="mt-4">
            Stanley Druckenmiller dumped GOOGL and AMZN in his Q1 2026 13F. Three weeks
            later, Friday 2026-06-05 hit and the NASDAQ dropped 4.2%. He looks prescient.
            But how often is he prescient versus how often does he get one right and stop
            talking about the misses? A public Brier score answers that.
          </p>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 2
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            Who built it
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <p>
            I&apos;m{' '}
            <a href="https://x.com/alex_jb" className="editorial-link text-ink">
              @alex_jb
            </a>
            , a solo founder building{' '}
            <a
              href="https://github.com/alex-jb"
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link text-ink"
            >
              Solo Founder OS
            </a>
            , an 11-agent stack that runs the day-to-day of a one-person company. The 13F
            tracker that feeds this site polls SEC EDGAR for filings from 19 fund managers
            and pushes the raw deltas into the data repo.
          </p>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 3
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            Why it exists
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <ul className="space-y-4">
            <li>
              <strong className="text-ink">Hold pundits accountable.</strong> The half-life
              of a bad market call is about three news cycles. Brier scores don&apos;t
              forget.
            </li>
            <li>
              <strong className="text-ink">Find calibrated voices.</strong> A 0.10 Brier
              across 10+ calls is rare and worth listening to. A 0.55 Brier across 10+
              calls is theater.
            </li>
            <li>
              <strong className="text-ink">Dogfood the stack.</strong> This site is built
              from the same 13F tracker that informs my personal markets workflow. If it
              works for me it should work for you.
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 4
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            Stack
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <ul className="space-y-1 font-mono text-sm">
            <li>Next.js 16 + React 19 server components</li>
            <li>Tailwind CSS 4</li>
            <li>ISR every 30 min, no client-side data fetching</li>
            <li>Data hosted on GitHub raw (zero DB, zero auth)</li>
            <li>Deployed on Vercel</li>
            <li>Portraits generated via OpenAI gpt-image-1, editorial 1970s Time style</li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            § 5
          </div>
          <h2 className="font-display-md mt-2 text-2xl text-ink">
            Get in touch
          </h2>
        </div>
        <div className="editorial-body lg:col-span-9">
          <p>
            Found a wrong number? A missing call? A fund I should add? DM{' '}
            <a href="https://x.com/alex_jb" className="editorial-link text-ink">
              @alex_jb
            </a>{' '}
            or open an issue at{' '}
            <a
              href="https://github.com/alex-jb/whocalleditright"
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link text-ink"
            >
              github.com/alex-jb/whocalleditright
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
