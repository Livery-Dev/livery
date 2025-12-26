import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://livery.dev';

  // Static pages
  const staticPages = [
    '',
    '/docs',
    '/docs/quick-start',
  ];

  // Package docs
  const packages = ['core', 'react', 'next'];
  const packagePages = packages.flatMap((pkg) => [
    `/docs/${pkg}`,
  ]);

  // Guide pages
  const guides = [
    '/docs/integrations',
    '/docs/integrations/tailwind',
    '/docs/integrations/css-in-js',
    '/docs/integrations/vanilla',
    '/docs/dashboard',
    '/docs/dashboard/data-sources',
    '/docs/dashboard/caching',
  ];

  // Core docs
  const coreDocs = [
    '/docs/core/schema',
    '/docs/core/tokens',
    '/docs/core/resolver',
    '/docs/core/validation',
    '/docs/core/css',
  ];

  // React docs
  const reactDocs = [
    '/docs/react/provider',
    '/docs/react/hooks',
    '/docs/react/theme-switching',
    '/docs/react/ssr',
  ];

  // Next.js docs
  const nextDocs = [
    '/docs/next/middleware',
    '/docs/next/app-router',
    '/docs/next/ssr',
  ];

  // API Reference
  const apiDocs = [
    '/docs/api',
    '/docs/api/core',
    '/docs/api/react',
    '/docs/api/next',
  ];

  const allPages = [
    ...staticPages,
    ...packagePages,
    ...guides,
    ...coreDocs,
    ...reactDocs,
    ...nextDocs,
    ...apiDocs,
  ];

  return allPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'weekly' : 'monthly',
    priority: page === '' ? 1 : page === '/docs' ? 0.9 : 0.8,
  }));
}
