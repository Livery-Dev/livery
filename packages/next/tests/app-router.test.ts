import { describe, it, expect, vi } from 'vitest';
import { createSchema, t, type ThemeResolver } from '@livery/core';
import { getLiveryData, getCacheHeaders, getThemeFromHeaders } from '../src/app-router/index.js';

// Test schema
const schema = createSchema({
  definition: {
    brand: {
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
    },
    spacing: {
      md: t.dimension().default('16px'),
    },
  },
});

type TestTheme = {
  brand: { primary: string; secondary: string };
  spacing: { md: string };
};

// Mock resolver
function createMockResolver(): ThemeResolver<typeof schema.definition> {
  const theme: TestTheme = {
    brand: { primary: '#ff0000', secondary: '#00ff00' },
    spacing: { md: '20px' },
  };

  return {
    resolve: vi.fn().mockResolvedValue(theme),
    invalidate: vi.fn(),
    clearCache: vi.fn(),
    get: vi.fn(),
  };
}

describe('getLiveryData', () => {
  it('resolves theme data for a theme', async () => {
    const resolver = createMockResolver();

    const result = await getLiveryData({
      themeId: 'acme',
      schema,
      resolver,
    });

    expect(resolver.resolve).toHaveBeenCalledWith({ themeId: 'acme' });
    expect(result.themeId).toBe('acme');
    expect(result.theme).toEqual({
      brand: { primary: '#ff0000', secondary: '#00ff00' },
      spacing: { md: '20px' },
    });
    expect(result.css).toContain('--brand-primary');
    expect(result.css).toContain('#ff0000');
  });

  it('generates valid CSS string', async () => {
    const resolver = createMockResolver();

    const { css } = await getLiveryData({
      themeId: 'acme',
      schema,
      resolver,
    });

    expect(css).toContain(':root');
    expect(css).toContain('--brand-primary: #ff0000');
    expect(css).toContain('--brand-secondary: #00ff00');
    expect(css).toContain('--spacing-md: 20px');
  });

  it('accepts CSS options', async () => {
    const resolver = createMockResolver();

    const { css } = await getLiveryData({
      themeId: 'acme',
      schema,
      resolver,
      cssOptions: { prefix: 'theme' },
    });

    expect(css).toContain('--theme-brand-primary');
    expect(css).not.toContain('--brand-primary');
  });
});

describe('getCacheHeaders', () => {
  it('returns default cache headers', () => {
    const headers = getCacheHeaders();

    expect(headers.get('Cache-Control')).toBe('public, max-age=60, stale-while-revalidate=600');
    expect(headers.get('Vary')).toBe('x-livery-theme');
  });

  it('accepts custom max-age', () => {
    const headers = getCacheHeaders({ maxAge: 300 });

    expect(headers.get('Cache-Control')).toContain('max-age=300');
  });

  it('accepts custom stale-while-revalidate', () => {
    const headers = getCacheHeaders({ staleWhileRevalidate: 3600 });

    expect(headers.get('Cache-Control')).toContain('stale-while-revalidate=3600');
  });

  it('accepts private scope', () => {
    const headers = getCacheHeaders({ scope: 'private' });

    expect(headers.get('Cache-Control')).toContain('private');
    expect(headers.get('Cache-Control')).not.toContain('public');
  });

  it('accepts custom vary headers', () => {
    const headers = getCacheHeaders({ vary: ['Accept', 'Accept-Encoding'] });

    expect(headers.get('Vary')).toBe('Accept, Accept-Encoding');
  });
});

describe('getThemeFromHeaders', () => {
  it('returns theme from default header', () => {
    const headers = new Headers({ 'x-livery-theme': 'acme' });
    const themeId = getThemeFromHeaders({ headers });

    expect(themeId).toBe('acme');
  });

  it('returns theme from custom header', () => {
    const headers = new Headers({ 'x-workspace-id': 'beta' });
    const themeId = getThemeFromHeaders({ headers, headerName: 'x-workspace-id' });

    expect(themeId).toBe('beta');
  });

  it('returns null when header not present', () => {
    const headers = new Headers();
    const themeId = getThemeFromHeaders({ headers });

    expect(themeId).toBeNull();
  });
});
