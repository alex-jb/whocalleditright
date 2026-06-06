import type { MetadataRoute } from 'next';
import { FUND_SLUGS } from '@/lib/data/funds-loader';

const SITE_URL = 'https://whocalleditright.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/methodology`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const fundRoutes: MetadataRoute.Sitemap = FUND_SLUGS.map((slug) => ({
    url: `${SITE_URL}/fund/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...fundRoutes];
}
