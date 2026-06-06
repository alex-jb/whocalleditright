import { brierTier } from '@/lib/brier/compute';

interface BrierBadgeProps {
  brier: number;
  /** Show "n/a" appearance when there are zero calls. */
  empty?: boolean;
  /** "lg" prints a giant editorial-display Brier — used on detail headers + cards. */
  size?: 'sm' | 'md' | 'lg';
}

const TIER_FG: Record<'green' | 'yellow' | 'red', string> = {
  green: 'text-tier-green',
  yellow: 'text-tier-yellow',
  red: 'text-tier-red',
};

const TIER_DOT: Record<'green' | 'yellow' | 'red', string> = {
  green: 'bg-tier-green',
  yellow: 'bg-tier-yellow',
  red: 'bg-tier-red',
};

/**
 * Editorial Brier badge.
 *  - small / medium: thin black border, tier-tinted text, mono.
 *  - large: massive display-weight Brier number for cards / header.
 * Tier colors are muted editorial (not neon).
 *
 *  <= 0.20 -> tier-green
 *  0.21..0.40 -> tier-yellow
 *  > 0.40 -> tier-red
 */
export function BrierBadge({ brier, empty, size = 'md' }: BrierBadgeProps) {
  if (empty) {
    if (size === 'lg') {
      return (
        <div className="font-display text-4xl tracking-tight text-ink-mute" aria-label="No calls tracked">
          n/a
        </div>
      );
    }
    return (
      <span
        className="inline-flex items-center gap-1 border border-rule-soft bg-cream px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-mute"
        aria-label="No calls tracked"
      >
        n/a
      </span>
    );
  }

  const tier = brierTier(brier);

  if (size === 'lg') {
    return (
      <div className="flex items-baseline gap-2">
        <span className={`font-display text-5xl tracking-tight ${TIER_FG[tier]}`}>
          {brier.toFixed(3)}
        </span>
        <span className={`inline-block h-2 w-2 ${TIER_DOT[tier]}`} aria-hidden />
      </div>
    );
  }

  const padding = size === 'sm' ? 'px-1.5 py-0' : 'px-2 py-0.5';
  const fontSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-ink ${padding} font-mono ${fontSize} tabular-nums ${TIER_FG[tier]}`}
      aria-label={`Brier score ${brier.toFixed(2)}`}
    >
      <span className={`inline-block h-1.5 w-1.5 ${TIER_DOT[tier]}`} aria-hidden />
      {brier.toFixed(3)}
    </span>
  );
}
