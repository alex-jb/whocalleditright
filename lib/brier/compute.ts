import type { CallAction, FundCall, ImpliedView } from '../types';

/**
 * Map a 13F action to the implied directional view.
 *
 * NEW / INCREASED  -> BULLISH (manager is adding exposure)
 * EXITED / DECREASED -> BEARISH (manager is reducing exposure)
 * HELD -> NEUTRAL (not scored)
 */
export function impliedViewFromAction(action: CallAction): ImpliedView {
  switch (action) {
    case 'NEW':
    case 'INCREASED':
      return 'BULLISH';
    case 'EXITED':
    case 'DECREASED':
      return 'BEARISH';
    case 'HELD':
    default:
      return 'NEUTRAL';
  }
}

/**
 * v0 Brier scoring rule (simplified — not production-grade).
 *
 * We treat the directional call as a probabilistic forecast of 1.0
 * (manager is 100% sure direction will materialize), then score against
 * the realized outcome.
 *
 * Bullish call -> outcome = 1 if price went up (actual_move_pct >= 0), else 0
 * Bearish call -> outcome = 1 if price went down (actual_move_pct <= 0), else 0
 *
 * Brier = (forecast - outcome)^2.
 * - Correct direction: (1 - 1)^2 = 0  (perfect)
 * - Wrong direction:   (1 - 0)^2 = 1  (max wrong)
 *
 * We then scale by the magnitude clip 0..1 of |actual_move_pct| / 20 so
 * that a tiny wrong move isn't punished as severely as a big wrong move.
 * Floor 0, cap 1.
 */
export function brierForCall(view: ImpliedView, actualMovePct: number): {
  brier_score: number;
  call_correct: boolean;
} {
  if (view === 'NEUTRAL') {
    return { brier_score: 0.5, call_correct: false };
  }

  const correct =
    view === 'BULLISH' ? actualMovePct >= 0 : actualMovePct <= 0;

  // Magnitude weight 0..1
  const mag = Math.min(1, Math.abs(actualMovePct) / 20);

  // Wrong call: Brier scales up with magnitude.
  // Correct call: Brier scales down (smaller is better) as confirmation grows.
  const brier_score = correct ? Math.max(0, 0.05 - 0.05 * mag) : Math.min(1, 0.5 + 0.5 * mag);

  return {
    brier_score: Number(brier_score.toFixed(3)),
    call_correct: correct,
  };
}

/**
 * Compute aggregate Brier across a manager's calls.
 * Returns average Brier (lower = better calibration) and hit count.
 */
export function aggregateBrier(calls: FundCall[]): {
  cumulative_brier: number;
  cumulative_correct: number;
  cumulative_total: number;
} {
  if (calls.length === 0) {
    return {
      cumulative_brier: 0,
      cumulative_correct: 0,
      cumulative_total: 0,
    };
  }
  const total = calls.length;
  const sum = calls.reduce((acc, c) => acc + c.brier_score, 0);
  const correct = calls.filter((c) => c.call_correct).length;
  return {
    cumulative_brier: Number((sum / total).toFixed(3)),
    cumulative_correct: correct,
    cumulative_total: total,
  };
}

/**
 * Return a brier badge color tier:
 *  - green: <= 0.20 (well-calibrated)
 *  - yellow: 0.21..0.40 (mixed)
 *  - red: > 0.40 (poorly calibrated for this set)
 */
export function brierTier(brier: number): 'green' | 'yellow' | 'red' {
  if (brier <= 0.2) return 'green';
  if (brier <= 0.4) return 'yellow';
  return 'red';
}
