import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://whocalleditright.com/sitemap.xml',
    host: 'https://whocalleditright.com',
  };
}
