import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start gap-8 px-6 py-32 sm:px-10">
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        404 · Page not found
      </div>
      <h1 className="font-display text-[clamp(3rem,8vw,6rem)] uppercase text-ink">
        Not<br />Tracked
      </h1>
      <p className="editorial-body max-w-lg text-lg text-ink-soft">
        We don&apos;t score this one yet. Maybe you meant a different manager?
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-cream transition-colors hover:bg-accent"
      >
        Back to leaderboard
      </Link>
    </div>
  );
}
