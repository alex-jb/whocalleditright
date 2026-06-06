import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt =
  'Who Called It Right — Brier scorecard for 19 fund managers';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Editorial OG card. Off-white #F5F4EE bg, heavy black display headline left,
 * placeholder column-rule + portrait swatch right, muted-orange accent rule
 * across the top.
 *
 * Once portraits are generated via scripts/gen_portraits.sh and uploaded to
 * the deployed origin, we can layer in <img src="<origin>/portraits/druckenmiller.png" />
 * here. Edge runtime can fetch but the URL must be absolute — left as a
 * solid swatch for v0 reliability.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#F5F4EE',
          color: '#0E0E0C',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Inter Tight"',
        }}
      >
        {/* Top accent rule + masthead */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 56px',
            borderBottom: '1px solid #1C1B19',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'ui-monospace, SFMono-Regular',
              fontSize: 16,
              color: '#0E0E0C',
              letterSpacing: 4,
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            <span style={{ width: 10, height: 10, background: '#E45A2A' }} />
            <span>WHO CALLED IT RIGHT</span>
          </div>
          <div
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular',
              fontSize: 13,
              color: '#6B6A63',
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            Issue 01 · Q1 2026
          </div>
        </div>

        {/* Main split */}
        <div style={{ display: 'flex', flex: 1, padding: '56px' }}>
          {/* Left — display headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 720,
              paddingRight: 32,
            }}
          >
            <div
              style={{
                fontSize: 136,
                fontWeight: 900,
                lineHeight: 0.92,
                letterSpacing: -4,
                color: '#0E0E0C',
                textTransform: 'uppercase',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span>WHO</span>
              <span>CALLED IT</span>
              <span>RIGHT</span>
            </div>

            <div
              style={{
                marginTop: 36,
                fontSize: 22,
                color: '#2A2A26',
                lineHeight: 1.35,
                maxWidth: 640,
                display: 'flex',
              }}
            >
              Brier-scored. 19 fund managers. Daily-fresh from SEC 13Fs.
            </div>
          </div>

          {/* Right — editorial portrait swatch */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 12,
              borderLeft: '1px solid #1C1B19',
              paddingLeft: 32,
              flex: 1,
            }}
          >
            <div
              style={{
                width: 320,
                height: 320,
                background:
                  'linear-gradient(180deg, #ECEAE0 0%, #2A2A26 100%)',
                border: '1px solid #0E0E0C',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: '#F5F4EE',
                  color: '#0E0E0C',
                  fontFamily: 'ui-monospace',
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  padding: '4px 8px',
                  display: 'flex',
                }}
              >
                Vol. 01
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  background: '#0E0E0C',
                  color: '#F5F4EE',
                  fontFamily: 'ui-monospace',
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  padding: '4px 8px',
                  display: 'flex',
                }}
              >
                Druckenmiller · 0.113
              </div>
            </div>
            <div
              style={{
                fontFamily: 'ui-monospace',
                fontSize: 11,
                color: '#6B6A63',
                letterSpacing: 2,
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              Stylized · Not the subject's likeness
            </div>
          </div>
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 56px',
            borderTop: '1px solid #1C1B19',
            background: '#ECEAE0',
          }}
        >
          <div
            style={{
              fontFamily: 'ui-monospace',
              fontSize: 14,
              color: '#E45A2A',
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Druckenmiller dumped $GOOGL + $AMZN. NASDAQ -4.2% three weeks later.
          </div>
          <div
            style={{
              fontFamily: 'ui-monospace',
              fontSize: 13,
              color: '#6B6A63',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            whocalleditright.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
