import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import {
  createLiveryMiddleware,
  extractFromSubdomain,
  extractFromPath,
  extractFromHeader,
  extractFromQuery,
} from '../src/middleware/index.js';
import { createThemeExtractor } from '../src/middleware/tenant-extraction.js';

// Mock NextRequest
function createMockRequest(options: {
  url?: string;
  host?: string;
  headers?: Record<string, string>;
}): NextRequest {
  const {
    url = 'https://acme.example.com/dashboard',
    host = 'acme.example.com',
    headers = {},
  } = options;

  const parsedUrl = new URL(url);

  // Create a minimal mock of NextRequest
  const headerMap = new Map<string, string>(Object.entries({ host, ...headers }));

  // Create a mock nextUrl that returns a proper URL on clone
  const nextUrl = {
    pathname: parsedUrl.pathname,
    searchParams: parsedUrl.searchParams,
    clone: () => new URL(url),
  };

  return {
    headers: {
      get: (name: string) => headerMap.get(name.toLowerCase()) ?? null,
    },
    nextUrl,
    url,
  } as unknown as NextRequest;
}

describe('extractFromSubdomain', () => {
  it('extracts theme from subdomain', () => {
    const request = createMockRequest({
      host: 'acme.example.com',
    });

    const result = extractFromSubdomain(request);
    expect(result.themeId).toBe('acme');
  });

  it('ignores www subdomain', () => {
    const request = createMockRequest({
      host: 'www.example.com',
    });

    const result = extractFromSubdomain(request);
    expect(result.themeId).toBeNull();
  });

  it('ignores app subdomain', () => {
    const request = createMockRequest({
      host: 'app.example.com',
    });

    const result = extractFromSubdomain(request);
    expect(result.themeId).toBeNull();
  });

  it('ignores custom subdomains', () => {
    const request = createMockRequest({
      host: 'staging.example.com',
    });

    const result = extractFromSubdomain(request, { ignore: ['staging'] });
    expect(result.themeId).toBeNull();
  });

  it('extracts theme with base domain', () => {
    const request = createMockRequest({
      host: 'acme.yourapp.io',
    });

    const result = extractFromSubdomain(request, { baseDomain: 'yourapp.io' });
    expect(result.themeId).toBe('acme');
  });

  it('returns null when base domain matches exactly with no subdomain', () => {
    const request = createMockRequest({
      host: 'yourapp.io',
    });

    const result = extractFromSubdomain(request, { baseDomain: 'yourapp.io' });
    expect(result.themeId).toBeNull();
  });

  it('returns null when base domain consumes all parts', () => {
    const request = createMockRequest({
      host: 'app.yourapp.io', // 3 parts
    });

    // baseDomain has 3 parts, same as host - no subdomain left
    const result = extractFromSubdomain(request, { baseDomain: 'app.yourapp.io' });
    expect(result.themeId).toBeNull();
  });

  it('returns null for root domain', () => {
    const request = createMockRequest({
      host: 'example.com',
    });

    const result = extractFromSubdomain(request);
    expect(result.themeId).toBeNull();
  });
});

describe('extractFromPath', () => {
  it('extracts theme from path with prefix', () => {
    const request = createMockRequest({
      url: 'https://example.com/t/acme/dashboard',
    });

    const result = extractFromPath(request, { prefix: '/t/' });
    expect(result.themeId).toBe('acme');
    expect(result.rewritePath).toBe('/dashboard');
  });

  it('extracts theme and rewrites path', () => {
    const request = createMockRequest({
      url: 'https://example.com/t/beta/settings/profile',
    });

    const result = extractFromPath(request, { prefix: '/t/', rewrite: true });
    expect(result.themeId).toBe('beta');
    expect(result.rewritePath).toBe('/settings/profile');
  });

  it('returns null for non-matching path', () => {
    const request = createMockRequest({
      url: 'https://example.com/dashboard',
    });

    const result = extractFromPath(request, { prefix: '/t/' });
    expect(result.themeId).toBeNull();
  });

  it('handles root path after prefix', () => {
    const request = createMockRequest({
      url: 'https://example.com/t/acme',
    });

    const result = extractFromPath(request, { prefix: '/t/' });
    expect(result.themeId).toBe('acme');
    expect(result.rewritePath).toBe('/');
  });
});

describe('extractFromHeader', () => {
  it('extracts theme from header', () => {
    const request = createMockRequest({
      headers: { 'x-theme-id': 'acme' },
    });

    const result = extractFromHeader(request, { name: 'x-theme-id' });
    expect(result.themeId).toBe('acme');
  });

  it('returns null for missing header', () => {
    const request = createMockRequest({
      headers: {},
    });

    const result = extractFromHeader(request, { name: 'x-theme-id' });
    expect(result.themeId).toBeNull();
  });
});

describe('extractFromQuery', () => {
  it('extracts theme from query parameter', () => {
    const request = createMockRequest({
      url: 'https://example.com/dashboard?theme=acme',
    });

    const result = extractFromQuery(request, { name: 'theme' });
    expect(result.themeId).toBe('acme');
  });

  it('returns null for missing query parameter', () => {
    const request = createMockRequest({
      url: 'https://example.com/dashboard',
    });

    const result = extractFromQuery(request, { name: 'theme' });
    expect(result.themeId).toBeNull();
  });
});

describe('createLiveryMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates middleware with subdomain strategy', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'subdomain',
    });

    const request = createMockRequest({
      host: 'acme.example.com',
      url: 'https://acme.example.com/dashboard',
    });

    const response = await middleware(request);

    expect(response).toBeDefined();
    expect(response?.headers.get('x-livery-theme')).toBe('acme');
  });

  it('creates middleware with path strategy', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'path',
      path: { prefix: '/t/' },
    });

    const request = createMockRequest({
      url: 'https://example.com/t/acme/dashboard',
      host: 'example.com',
    });

    const response = await middleware(request);

    expect(response).toBeDefined();
    expect(response?.headers.get('x-livery-theme')).toBe('acme');
  });

  it('creates middleware with header strategy', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'header',
      header: { name: 'x-theme-id' },
    });

    const request = createMockRequest({
      headers: { 'x-theme-id': 'acme' },
    });

    const response = await middleware(request);

    expect(response).toBeDefined();
    expect(response?.headers.get('x-livery-theme')).toBe('acme');
  });

  it('creates middleware with custom strategy', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'custom',
      getTheme: ({ request }) => ({
        themeId: request.headers.get('host')?.split('.')[0] ?? null,
      }),
    });

    const request = createMockRequest({
      host: 'acme.example.com',
    });

    const response = await middleware(request);

    expect(response).toBeDefined();
    expect(response?.headers.get('x-livery-theme')).toBe('acme');
  });

  it('uses custom theme header name', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'subdomain',
      themeHeader: 'x-workspace-id',
    });

    const request = createMockRequest({
      host: 'acme.example.com',
    });

    const response = await middleware(request);

    expect(response?.headers.get('x-workspace-id')).toBe('acme');
  });

  it('skips configured paths', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'subdomain',
      skipPaths: ['/api', '/_next'],
    });

    const request = createMockRequest({
      host: 'acme.example.com',
      url: 'https://acme.example.com/api/users',
    });

    const response = await middleware(request);

    expect(response).toBeUndefined();
  });

  it('continues without theme when none found', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'subdomain',
    });

    const request = createMockRequest({
      host: 'example.com', // No subdomain
    });

    const response = await middleware(request);

    expect(response).toBeUndefined();
  });

  it('validates theme when validator provided', async () => {
    const validate = vi.fn().mockResolvedValue(true);

    const middleware = createLiveryMiddleware({
      strategy: 'subdomain',
      validate,
    });

    const request = createMockRequest({
      host: 'acme.example.com',
    });

    const response = await middleware(request);

    expect(validate).toHaveBeenCalledWith({ themeId: 'acme' });
    expect(response?.headers.get('x-livery-theme')).toBe('acme');
  });

  it('rejects invalid theme', async () => {
    const validate = vi.fn().mockResolvedValue(false);

    const middleware = createLiveryMiddleware({
      strategy: 'subdomain',
      validate,
    });

    const request = createMockRequest({
      host: 'invalid.example.com',
    });

    const response = await middleware(request);

    expect(validate).toHaveBeenCalledWith({ themeId: 'invalid' });
    expect(response).toBeUndefined();
  });

  it('redirects to fallback when no theme found', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'subdomain',
      fallback: '/select-workspace',
    });

    const request = createMockRequest({
      host: 'example.com', // No subdomain
      url: 'https://example.com/dashboard',
    });

    const response = await middleware(request);

    expect(response).toBeDefined();
    // NextResponse.redirect returns a response with redirect status
    expect(response?.status).toBe(307);
  });

  it('redirects to fallback when validation fails', async () => {
    const validate = vi.fn().mockResolvedValue(false);

    const middleware = createLiveryMiddleware({
      strategy: 'subdomain',
      validate,
      fallback: '/invalid-workspace',
    });

    const request = createMockRequest({
      host: 'invalid.example.com',
      url: 'https://invalid.example.com/dashboard',
    });

    const response = await middleware(request);

    expect(validate).toHaveBeenCalledWith({ themeId: 'invalid' });
    expect(response).toBeDefined();
    expect(response?.status).toBe(307);
  });

  it('creates middleware with query strategy', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'query',
      query: { name: 'theme' },
    });

    const request = createMockRequest({
      url: 'https://example.com/dashboard?theme=acme',
      host: 'example.com',
    });

    const response = await middleware(request);

    expect(response).toBeDefined();
    expect(response?.headers.get('x-livery-theme')).toBe('acme');
  });

  it('accepts strategy as a function', async () => {
    const customExtractor = vi.fn().mockReturnValue({ themeId: 'custom-theme' });

    const middleware = createLiveryMiddleware({
      strategy: customExtractor,
    });

    const request = createMockRequest({
      host: 'example.com',
    });

    const response = await middleware(request);

    expect(customExtractor).toHaveBeenCalled();
    expect(response?.headers.get('x-livery-theme')).toBe('custom-theme');
  });

  it('rewrites path when path strategy with rewrite', async () => {
    const middleware = createLiveryMiddleware({
      strategy: 'path',
      path: { prefix: '/t/', rewrite: true },
    });

    const request = createMockRequest({
      url: 'https://example.com/t/acme/settings/profile',
      host: 'example.com',
    });

    const response = await middleware(request);

    expect(response).toBeDefined();
    expect(response?.headers.get('x-livery-theme')).toBe('acme');
  });
});

describe('createThemeExtractor', () => {
  it('throws error for header strategy without options', () => {
    expect(() => createThemeExtractor('header', {})).toThrow(
      'Header options required for header strategy'
    );
  });

  it('throws error for query strategy without options', () => {
    expect(() => createThemeExtractor('query', {})).toThrow(
      'Query options required for query strategy'
    );
  });

  it('throws error for custom strategy without getTheme', () => {
    expect(() => createThemeExtractor('custom', {})).toThrow(
      'getTheme function required for custom strategy'
    );
  });

  it('throws error for unknown strategy', () => {
    expect(() =>
      createThemeExtractor('unknown' as 'subdomain', {})
    ).toThrow('Unknown strategy: unknown');
  });
});
