/**
 * Next.js Middleware for Tenant Detection
 *
 * This middleware extracts the tenant ID from the URL path and sets it
 * on a header for downstream use. You can also use subdomain, header,
 * or query-based extraction.
 */

import { createLiveryMiddleware } from '@livery/next/middleware';

export const middleware = createLiveryMiddleware({
  // Use path-based tenant detection: /t/[tenant]/...
  strategy: 'path',
  path: {
    prefix: '/t/',
    rewrite: true, // Rewrites /t/acme/dashboard → /dashboard
  },

  // Skip static files and API routes
  skipPaths: ['/_next', '/api', '/favicon.ico'],
});

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
