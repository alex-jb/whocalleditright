import { HeroDruckenmillerCallout } from '@/components/HeroDruckenmillerCallout';
import { FundCard } from '@/components/FundCard';
import { getLeaderboard } from '@/lib/data/funds-loader';

// ISR — re-render every 30 min so new data from whocalleditright-data shows up.
export const revalidate = 1800;

export default async function HomePage() {
  const leaderboard = await getLeaderboard();
  const withCallsCount = leaderboard.filter((e) => e.manager.cumulative_total > 0).length;
  const stubCount = leaderboard.length - withCallsCount;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Hedge Fund Manager Brier Scorecard',
    description:
      'Brier scores for 19 of the most-cited hedge fund managers and pundits, computed from SEC 13F filings and public statements.',
    url: 'https://whocalleditright.com',
    creator: {
      '@type': 'Person',
      name: 'Alex Ji',
      url: 'https://github.com/alex-jb',
    },
    license: 'https://opensource.org/licenses/MIT',
    keywords: ['13F', 'Brier score', 'hedge fund', 'SEC filings'],
    distribution: {
      '@type': 'DataDownload',
      contentUrl: 'https://github.com/alex-jb/whocalleditright-data',
      encodingFormat: 'application/json',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroDruckenmillerCallout />

      <section
        id="leaderboard"
        aria-labelledby="leaderboard-heading"
        className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24"
      >
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Leaderboard · Q1 2026 calls
            </div>
            <h2
              id="leaderboard-heading"
              className="font-display-md mt-3 text-4xl text-ink sm:text-5xl"
            >
              Ranked by Brier score
            </h2>
            <p className="editorial-body mt-3 max-w-xl text-sm text-ink-soft">
              Lower is better. <span className="font-mono text-ink">0.00</span> is perfect,{' '}
              <span className="font-mono text-ink">1.00</span> is maximally wrong.
            </p>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
            <span className="text-ink">{withCallsCount}</span> tracked · {stubCount} pending
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px bg-rule-soft md:grid-cols-2 lg:grid-cols-3">
          {leaderboard.map((entry) => (
            <FundCard key={entry.manager.slug} entry={entry} />
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-sm text-ink-soft">
          Brier score = mean squared error of directional forecast vs. realized move.{' '}
          <a href="/methodology" className="editorial-link text-ink">
            Read the methodology
          </a>
          .
        </p>
      </section>
    </>
  );
}
