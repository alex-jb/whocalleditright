import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CallCard } from '@/components/CallCard';
import { BrierBadge } from '@/components/BrierBadge';
import { FUND_SLUGS, getFund } from '@/lib/data/funds-loader';

export const revalidate = 1800;

export async function generateStaticParams() {
  return FUND_SLUGS.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fund = await getFund(slug);
  if (!fund) {
    return { title: 'Fund not found' };
  }
  const title = `${fund.name} (${fund.fund}) — Brier ${fund.cumulative_brier.toFixed(3)}`;
  const description =
    fund.cumulative_total > 0
      ? `${fund.name} of ${fund.fund}: ${fund.cumulative_correct}/${fund.cumulative_total} correct calls in Q1 2026, average Brier ${fund.cumulative_brier.toFixed(3)}.`
      : `${fund.name} of ${fund.fund}: Q1 2026 13F calls pending parse.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://whocalleditright.com/fund/${slug}`,
    },
  };
}

export default async function FundPage({ params }: PageProps) {
  const { slug } = await params;
  const fund = await getFund(slug);
  if (!fund) notFound();

  const hasCalls = fund.cumulative_total > 0;
  const hitRate = hasCalls ? fund.cumulative_correct / fund.cumulative_total : 0;

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fund.name,
    affiliation: {
      '@type': 'Organization',
      name: fund.fund,
    },
    url: `https://whocalleditright.com/fund/${fund.slug}`,
    image: `https://whocalleditright.com/portraits/${fund.slug}.png`,
    sameAs: fund.twitter ? [`https://x.com/${fund.twitter}`] : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      <article className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-16">
        <Link
          href="/"
          className="editorial-link font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim"
        >
          ← Back to leaderboard
        </Link>

        <header className="mt-10 grid grid-cols-12 gap-8 border-b border-rule pb-12">
          {/* Portrait + masthead */}
          <div className="col-span-12 lg:col-span-4">
            <div className="relative aspect-square w-full overflow-hidden border border-ink bg-cream-deep">
              <Image
                src={`/portraits/${fund.slug}.png`}
                alt={`Stylized editorial portrait of ${fund.name}`}
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute left-0 top-0 m-3 bg-cream px-2 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ink">
                {fund.fund}
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
              Stylized illustration. Not the subject&apos;s likeness.
            </p>
          </div>

          {/* Name + bio + stats */}
          <div className="col-span-12 lg:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {fund.fund}
            </div>
            <h1 className="font-display mt-4 text-[clamp(2.75rem,6vw,5rem)] uppercase text-ink">
              {fund.name}
            </h1>
            {fund.bio && (
              <p className="editorial-body mt-6 max-w-2xl text-lg leading-snug text-ink-soft">
                {fund.bio}
              </p>
            )}

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-rule pt-8 sm:grid-cols-4">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
                  Cumulative Brier
                </dt>
                <dd className="mt-2">
                  <BrierBadge brier={fund.cumulative_brier} empty={!hasCalls} size="lg" />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
                  Calls tracked
                </dt>
                <dd className="mt-2 font-display text-4xl tracking-tight text-ink">
                  {fund.cumulative_total}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
                  Correct
                </dt>
                <dd className="mt-2 font-display text-4xl tracking-tight text-tier-green">
                  {fund.cumulative_correct}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
                  Hit rate
                </dt>
                <dd className="mt-2 font-display text-4xl tracking-tight text-ink">
                  {hasCalls ? `${(hitRate * 100).toFixed(0)}%` : '—'}
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <section aria-labelledby="calls-heading" className="mt-14">
          <div className="flex items-baseline justify-between border-b border-rule pb-3">
            <h2
              id="calls-heading"
              className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent"
            >
              Q1 2026 calls
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
              Filed 2026-05-15
            </span>
          </div>

          {hasCalls ? (
            <div className="mt-8 grid grid-cols-1 gap-6">
              {fund.calls.map((call, i) => (
                <CallCard
                  key={`${call.ticker}-${call.date}-${i}`}
                  call={call}
                  managerName={fund.name}
                  fundName={fund.fund}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-dashed border-rule-soft bg-cream p-12 text-center">
              <p className="editorial-body text-ink-soft">
                No Q1 2026 calls tracked yet.
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute">
                We are still parsing this fund&apos;s most recent 13F filing.
              </p>
            </div>
          )}
        </section>
      </article>
    </>
  );
}
