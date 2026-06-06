import type { FundCall } from '@/lib/types';
import { BrierBadge } from './BrierBadge';

interface CallCardProps {
  call: FundCall;
  /** Manager + fund — used for share text. */
  managerName?: string;
  fundName?: string;
}

function formatPct(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Editorial call card — gigantic ticker on the left,
 * narrative middle, Brier delta + share-this-take footer.
 * Thin black border, no shadow, sharp corners.
 */
export function CallCard({ call, managerName, fundName }: CallCardProps) {
  const moveColor =
    call.actual_move_pct > 0
      ? 'text-tier-green'
      : call.actual_move_pct < 0
      ? 'text-tier-red'
      : 'text-ink-dim';

  const viewBg =
    call.implied_view === 'BULLISH'
      ? 'bg-tier-green'
      : call.implied_view === 'BEARISH'
      ? 'bg-tier-red'
      : 'bg-ink-mute';

  const shareText = managerName
    ? `${managerName} (${fundName ?? ''}) ${call.action} ${call.ticker} on ${call.date}. Brier ${call.brier_score.toFixed(3)} — ${call.call_correct ? 'right call.' : 'wrong call.'} Tracked at whocalleditright.com.`
    : `${call.ticker} ${call.action} on ${call.date}. Brier ${call.brier_score.toFixed(3)}. whocalleditright.com`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <article className="border border-ink bg-cream">
      <div className="grid grid-cols-12 gap-4 p-5 sm:p-6">
        {/* HUGE ticker */}
        <div className="col-span-12 sm:col-span-3">
          <div className="font-ticker text-5xl text-ink sm:text-6xl">{call.ticker}</div>
          <div className="mt-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
            <span className={`inline-block h-1.5 w-1.5 ${viewBg}`} aria-hidden />
            {call.action}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
            {call.date}
          </div>
        </div>

        {/* Narrative + price stats */}
        <div className="col-span-12 sm:col-span-6">
          <p className="editorial-body text-[15px] leading-relaxed text-ink">
            {call.rationale_quote}
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                At call
              </dt>
              <dd className="mt-0.5 font-mono tabular-nums text-ink">
                {formatPrice(call.price_at_call)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                Today
              </dt>
              <dd className="mt-0.5 font-mono tabular-nums text-ink">
                {formatPrice(call.price_today)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                Move
              </dt>
              <dd className={`mt-0.5 font-mono tabular-nums ${moveColor}`}>
                {formatPct(call.actual_move_pct)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Brier verdict */}
        <div className="col-span-12 flex flex-col items-start gap-2 sm:col-span-3 sm:items-end">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
            Brier · this call
          </div>
          <BrierBadge brier={call.brier_score} size="lg" />
          <div
            className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
              call.call_correct ? 'text-tier-green' : 'text-tier-red'
            }`}
            aria-label={call.call_correct ? 'Call was correct' : 'Call was wrong'}
          >
            {call.call_correct ? '— right call' : '— wrong call'}
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-rule-soft px-5 py-3 sm:px-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
          Implied view · <span className="text-ink">{call.implied_view}</span>
        </div>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="editorial-link font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft"
        >
          Share this take ↗
        </a>
      </footer>
    </article>
  );
}
