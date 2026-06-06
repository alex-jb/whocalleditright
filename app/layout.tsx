import type { Metadata } from 'next';
import { Inter_Tight, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const jetMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = 'https://whocalleditright.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Who Called It Right — Brier scorecard for 19 fund managers',
    template: '%s — Who Called It Right',
  },
  description:
    'A public Brier scorecard for 19 of the most-cited hedge fund managers and macro pundits. Auto-updated from SEC 13F filings and verifiable public statements. Druckenmiller dumped GOOGL+AMZN before the June 2026 NASDAQ drop. Nobody tracks this systematically. Now we do.',
  applicationName: 'Who Called It Right',
  keywords: [
    'hedge fund tracking',
    '13F filing',
    'Brier score',
    'Druckenmiller',
    'Michael Burry',
    'Cathie Wood',
    'hedge fund leaderboard',
    'fund manager calibration',
    'SEC 13F',
  ],
  authors: [{ name: 'Alex Ji' }],
  creator: 'Alex Ji',
  publisher: 'Alex Ji',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Who Called It Right — Brier scorecard for 19 fund managers',
    description:
      'A public Brier scorecard auditing the most-cited hedge fund managers. Auto-updated from SEC 13F filings.',
    siteName: 'Who Called It Right',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Who Called It Right',
    description:
      'Brier scorecard for 19 of the most-cited fund managers. Auto-updated from SEC 13F filings.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetMono.variable}`}>
      <body className="bg-cream text-ink">
        <header className="border-b border-rule">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="font-display-md text-lg tracking-tight text-ink">
                WHO CALLED IT RIGHT
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim sm:inline">
                .com
              </span>
            </Link>
            <nav
              aria-label="Primary"
              className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft"
            >
              <Link href="/" className="editorial-link">
                Leaderboard
              </Link>
              <Link href="/methodology" className="editorial-link">
                Methodology
              </Link>
              <Link href="/about" className="editorial-link">
                About
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t border-rule bg-cream-deep">
          <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                  whocalleditright.com
                </div>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
                  A public Brier scorecard for 19 fund managers and macro pundits.
                  Auto-updated from SEC EDGAR 13F filings.
                </p>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                  Data
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a
                      href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F-HR"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link text-ink-soft"
                    >
                      SEC EDGAR 13F-HR
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/alex-jb/whocalleditright-data"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link text-ink-soft"
                    >
                      whocalleditright-data on GitHub
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                  Solo founder project
                </div>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
                  Built by{' '}
                  <a href="https://x.com/alex_jb" className="editorial-link">
                    @alex_jb
                  </a>{' '}
                  as part of{' '}
                  <a
                    href="https://github.com/alex-jb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link"
                  >
                    Solo Founder OS
                  </a>
                  .
                </p>
              </div>
            </div>
            <div className="mt-12 border-t border-rule-soft pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
              Not financial advice. No positions implied. Data may be stale. See methodology for limits.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
