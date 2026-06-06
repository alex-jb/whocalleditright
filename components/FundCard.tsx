import Image from 'next/image';
import Link from 'next/link';
import type { LeaderboardEntry } from '@/lib/types';
import { BrierBadge } from './BrierBadge';

interface FundCardProps {
  entry: LeaderboardEntry;
}

/**
 * Editorial leaderboard card — portrait top-left, name + fund + bio snippet
 * middle, giant Brier number bottom-right. Thin 1px black border, no shadow.
 * Hover: orange underline on name only (no card-lift transform).
 */
export function FundCard({ entry }: FundCardProps) {
  const { manager, rank, avg_brier, hit_rate } = entry;
  const hasCalls = manager.cumulative_total > 0;
  const portraitSrc = `/portraits/${manager.slug}.png`;
  const bioSnippet = manager.bio
    ? manager.bio.length > 140
      ? `${manager.bio.slice(0, 137)}…`
      : manager.bio
    : `${manager.fund}. Awaiting Q1 2026 13F parse.`;

  return (
    <Link
      href={`/fund/${manager.slug}`}
      className={`group flex h-full flex-col border border-ink bg-cream p-5 transition-colors hover:bg-cream-deep focus:bg-cream-deep focus:outline-none ${
        !hasCalls ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-ink bg-cream-deep sm:h-24 sm:w-24">
          <Image
            src={portraitSrc}
            alt={`Stylized editorial portrait of ${manager.name}`}
            width={256}
            height={256}
            className={`h-full w-full object-cover ${hasCalls ? '' : 'opacity-60 grayscale'}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
              #{String(rank).padStart(2, '0')}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              {hasCalls ? 'Tracked' : 'Pending'}
            </span>
          </div>
          <h3 className="font-display-md mt-1 inline text-xl text-ink editorial-link">
            {manager.name}
          </h3>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-dim">
            {manager.fund}
          </div>
        </div>
      </div>

      <p className="editorial-body mt-4 text-[13px] leading-snug text-ink-soft line-clamp-3">
        {bioSnippet}
      </p>

      <div className="mt-auto flex items-end justify-between gap-4 pt-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
            {hasCalls ? 'Calls · Hit' : 'Calls'}
          </div>
          <div className="mt-1 font-mono text-sm tabular-nums text-ink">
            {hasCalls
              ? `${manager.cumulative_correct}/${manager.cumulative_total} · ${(hit_rate * 100).toFixed(0)}%`
              : '—'}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
            Brier
          </div>
          <div className="mt-1">
            <BrierBadge brier={avg_brier} empty={!hasCalls} size="lg" />
          </div>
        </div>
      </div>
    </Link>
  );
}
