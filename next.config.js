/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Public site, no analytics or telemetry beyond Vercel defaults.
  poweredByHeader: false,
};

module.exports = nextConfig;
