import type { FundManager, LeaderboardEntry } from '../types';

/**
 * Data source.
 *
 * Production: fetch from raw.githubusercontent.com/alex-jb/whosecall-data/main/data/funds/<slug>.json
 * Local dev:  read from ./data/funds/<slug>.json bundled in the repo
 *
 * Switch via NEXT_PUBLIC_WHOSECALL_DATA_MODE = "local" | "remote" (default: local)
 */

const DATA_MODE = process.env.NEXT_PUBLIC_WHOSECALL_DATA_MODE ?? 'local';
const REMOTE_BASE =
  process.env.NEXT_PUBLIC_WHOSECALL_DATA_BASE_URL ??
  'https://raw.githubusercontent.com/alex-jb/whocalleditright-data/main/data/funds';

/**
 * The canonical roster — order is used for stub display only.
 * Brier-ranking happens at render time.
 */
export const FUND_SLUGS: readonly string[] = [
  // Top 5 — full Q1 2026 data
  'druckenmiller',
  'tepper',
  'burry',
  'cathie-wood',
  'ackman',
  // 14 stub funds (bio + photo, zero calls in v0)
  'buffett',
  'icahn',
  'dalio',
  'einhorn',
  'marks',
  'miller',
  'gundlach',
  'tom-lee',
  'lyn-alden',
  'spitznagel',
  'cole',
  'el-erian',
  'greenblatt',
  'gerstner',
];

async function fetchFundLocal(slug: string): Promise<FundManager | null> {
  // Static JSON co-located in repo for offline dev.
  // Uses dynamic import so the bundler treats this as static at build time.
  try {
    const mod = await import(`../../data/funds/${slug}.json`);
    return (mod.default ?? mod) as FundManager;
  } catch (err) {
    console.warn(`[funds-loader] local miss for ${slug}:`, (err as Error).message);
    return null;
  }
}

async function fetchFundRemote(slug: string): Promise<FundManager | null> {
  try {
    const res = await fetch(`${REMOTE_BASE}/${slug}.json`, {
      // ISR — re-fetch every 30 min in prod.
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      console.warn(`[funds-loader] remote ${slug} HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as FundManager;
  } catch (err) {
    console.warn(`[funds-loader] remote fetch failed for ${slug}:`, (err as Error).message);
    return null;
  }
}

export async function getFund(slug: string): Promise<FundManager | null> {
  if (DATA_MODE === 'remote') {
    const remote = await fetchFundRemote(slug);
    if (remote) return remote;
    // graceful fallback to bundled seed
    return fetchFundLocal(slug);
  }
  return fetchFundLocal(slug);
}

export async function getAllFunds(): Promise<FundManager[]> {
  const results = await Promise.all(FUND_SLUGS.map((slug) => getFund(slug)));
  return results.filter((f): f is FundManager => f !== null);
}

/**
 * Leaderboard sort:
 *   1. Funds with calls first, ranked by ascending cumulative_brier (lower = better)
 *   2. Stub funds (zero calls) at the bottom, alphabetical
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const funds = await getAllFunds();

  const withCalls = funds
    .filter((f) => f.cumulative_total > 0)
    .sort((a, b) => a.cumulative_brier - b.cumulative_brier);

  const stubs = funds
    .filter((f) => f.cumulative_total === 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const ordered = [...withCalls, ...stubs];

  return ordered.map((manager, idx) => ({
    rank: idx + 1,
    manager,
    avg_brier: manager.cumulative_brier,
    hit_rate:
      manager.cumulative_total > 0
        ? manager.cumulative_correct / manager.cumulative_total
        : 0,
  }));
}
