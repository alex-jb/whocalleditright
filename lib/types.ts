/**
 * Core types for Who Called It Right.
 *
 * Data is fetched from github.com/alex-jb/whocalleditright-data as raw JSON.
 * One file per fund manager under data/funds/<slug>.json.
 */

export type CallAction = 'NEW' | 'INCREASED' | 'EXITED' | 'DECREASED' | 'HELD';

export type ImpliedView = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface FundCall {
  /** ISO date of the call or 13F filing (YYYY-MM-DD). */
  date: string;
  /** Stock ticker, uppercase. */
  ticker: string;
  /** What the fund did. */
  action: CallAction;
  /** Verbatim or paraphrased rationale, often "From Q1 2026 13F filing". */
  rationale_quote: string;
  /** Price on call date, USD. */
  price_at_call: number;
  /** Latest known price for comparison, USD. */
  price_today: number;
  /** What the action implies. */
  implied_view: ImpliedView;
  /** Realized % move from call date to today. Negative = price went down. */
  actual_move_pct: number;
  /** Brier score for this single call. 0 = perfect, 1 = max wrong. */
  brier_score: number;
  /** True if the directional call was correct. */
  call_correct: boolean;
}

export interface FundManager {
  /** URL-safe identifier, e.g. "druckenmiller". */
  slug: string;
  /** Display name, e.g. "Stanley Druckenmiller". */
  name: string;
  /** Fund / firm name. */
  fund: string;
  /** Optional Twitter handle, no @. */
  twitter: string | null;
  /** Photo URL, can be null for stubs. */
  photo_url: string | null;
  /** Short bio for fund page (1-2 sentences). */
  bio?: string;
  /** All tracked calls. */
  calls: FundCall[];
  /** Sum of Brier scores across calls / total calls. Lower is better. */
  cumulative_brier: number;
  /** Number of correct directional calls. */
  cumulative_correct: number;
  /** Total number of tracked calls. */
  cumulative_total: number;
}

export interface LeaderboardEntry {
  rank: number;
  manager: FundManager;
  /** Average Brier across calls (manager.cumulative_brier already stores avg). */
  avg_brier: number;
  /** Correct / total as a 0-1 ratio. */
  hit_rate: number;
}
