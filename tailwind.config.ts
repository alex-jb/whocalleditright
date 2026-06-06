import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5F4EE',
          deep: '#ECEAE0',
        },
        ink: {
          DEFAULT: '#0E0E0C',
          soft: '#2A2A26',
          dim: '#6B6A63',
          mute: '#9B998F',
        },
        rule: {
          DEFAULT: '#1C1B19',
          soft: '#C9C6BA',
        },
        accent: {
          DEFAULT: '#E45A2A',
          soft: '#F2DDD0',
        },
        tier: {
          green: '#2F6E3A',
          yellow: '#B07A12',
          red: '#B43321',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter Tight', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
