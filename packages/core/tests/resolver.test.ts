import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSchema } from '../src/schema/index';
import { t } from '../src/schema/tokens';
import { createResolver } from '../src/resolver/index';

describe('createResolver', () => {
  const schema = createSchema({
    definition: {
      colors: {
        primary: t.color().default('#000000'),
        secondary: t.color().default('#666666'),
      },
      spacing: {
        sm: t.dimension().default('4px'),
        md: t.dimension().default('8px'),
      },
    },
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('resolve()', () => {
    it('fetches and returns theme data', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        colors: {
          primary: '#3b82f6',
        },
      });

      const resolver = createResolver({ schema, fetcher });
      const theme = await resolver.resolve({ themeId: 'theme-1' });

      expect(fetcher).toHaveBeenCalledWith({ themeId: 'theme-1' });
      expect(theme.colors.primary).toBe('#3b82f6');
      expect(theme.colors.secondary).toBe('#666666'); // default
    });

    it('applies default values', async () => {
      const fetcher = vi.fn().mockResolvedValue({});

      const resolver = createResolver({ schema, fetcher });
      const theme = await resolver.resolve({ themeId: 'theme-1' });

      expect(theme.colors.primary).toBe('#000000');
      expect(theme.colors.secondary).toBe('#666666');
      expect(theme.spacing.sm).toBe('4px');
      expect(theme.spacing.md).toBe('8px');
    });

    it('caches results', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        colors: { primary: '#3b82f6' },
      });

      const resolver = createResolver({ schema, fetcher });

      await resolver.resolve({ themeId: 'theme-1' });
      await resolver.resolve({ themeId: 'theme-1' });
      await resolver.resolve({ themeId: 'theme-1' });

      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('caches per theme', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        colors: { primary: '#3b82f6' },
      });

      const resolver = createResolver({ schema, fetcher });

      await resolver.resolve({ themeId: 'theme-1' });
      await resolver.resolve({ themeId: 'theme-2' });

      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(fetcher).toHaveBeenCalledWith({ themeId: 'theme-1' });
      expect(fetcher).toHaveBeenCalledWith({ themeId: 'theme-2' });
    });

    it('respects TTL and refetches after expiry', async () => {
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce({ colors: { primary: '#3b82f6' } })
        .mockResolvedValueOnce({ colors: { primary: '#ef4444' } });

      const resolver = createResolver({
        schema,
        fetcher,
        cache: { ttl: 1000, staleWhileRevalidate: false },
      });

      // First fetch
      const theme1 = await resolver.resolve({ themeId: 'theme-1' });
      expect(theme1.colors.primary).toBe('#3b82f6');

      // Advance time past TTL
      vi.advanceTimersByTime(1500);

      // Should refetch
      const theme2 = await resolver.resolve({ themeId: 'theme-1' });
      expect(theme2.colors.primary).toBe('#ef4444');
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it('serves stale data while revalidating', async () => {
      let resolveSecondCall: ((value: unknown) => void) | null = null;

      const fetcher = vi
        .fn()
        .mockResolvedValueOnce({ colors: { primary: '#3b82f6' } })
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveSecondCall = resolve;
            })
        );

      const resolver = createResolver({
        schema,
        fetcher,
        cache: { ttl: 1000, staleWhileRevalidate: true },
      });

      // First fetch
      const theme1 = await resolver.resolve({ themeId: 'theme-1' });
      expect(theme1.colors.primary).toBe('#3b82f6');

      // Advance time past TTL
      vi.advanceTimersByTime(1500);

      // Should return stale data immediately while revalidating
      const theme2 = await resolver.resolve({ themeId: 'theme-1' });
      expect(theme2.colors.primary).toBe('#3b82f6'); // stale data

      // Complete background revalidation
      resolveSecondCall?.({ colors: { primary: '#ef4444' } });
      await vi.runAllTimersAsync();

      // Now should have fresh data
      const theme3 = await resolver.resolve({ themeId: 'theme-1' });
      expect(theme3.colors.primary).toBe('#ef4444');
    });

    it('throws on invalid theme data', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        colors: { primary: 'not-a-color' },
      });

      const resolver = createResolver({ schema, fetcher });

      await expect(resolver.resolve({ themeId: 'theme-1' })).rejects.toThrow('Invalid theme data');
    });

    it('coerces values when possible', async () => {
      const schemaWithNumber = createSchema({
        definition: {
          count: t.number().default(0),
        },
      });

      const fetcher = vi.fn().mockResolvedValue({
        count: '42', // string that can be coerced
      });

      const resolver = createResolver({ schema: schemaWithNumber, fetcher });
      const theme = await resolver.resolve({ themeId: 'theme-1' });

      expect(theme.count).toBe(42);
    });
  });

  describe('invalidate()', () => {
    it('removes theme from cache', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        colors: { primary: '#3b82f6' },
      });

      const resolver = createResolver({ schema, fetcher });

      await resolver.resolve({ themeId: 'theme-1' });
      expect(fetcher).toHaveBeenCalledTimes(1);

      resolver.invalidate({ themeId: 'theme-1' });

      await resolver.resolve({ themeId: 'theme-1' });
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it('does not affect other themes', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        colors: { primary: '#3b82f6' },
      });

      const resolver = createResolver({ schema, fetcher });

      await resolver.resolve({ themeId: 'theme-1' });
      await resolver.resolve({ themeId: 'theme-2' });
      expect(fetcher).toHaveBeenCalledTimes(2);

      resolver.invalidate({ themeId: 'theme-1' });

      await resolver.resolve({ themeId: 'theme-1' }); // should refetch
      await resolver.resolve({ themeId: 'theme-2' }); // should use cache
      expect(fetcher).toHaveBeenCalledTimes(3);
    });
  });

  describe('clearCache()', () => {
    it('removes all themes from cache', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        colors: { primary: '#3b82f6' },
      });

      const resolver = createResolver({ schema, fetcher });

      await resolver.resolve({ themeId: 'theme-1' });
      await resolver.resolve({ themeId: 'theme-2' });
      await resolver.resolve({ themeId: 'theme-3' });
      expect(fetcher).toHaveBeenCalledTimes(3);

      resolver.clearCache();

      await resolver.resolve({ themeId: 'theme-1' });
      await resolver.resolve({ themeId: 'theme-2' });
      await resolver.resolve({ themeId: 'theme-3' });
      expect(fetcher).toHaveBeenCalledTimes(6);
    });
  });

  describe('get()', () => {
    it('returns value at path', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        colors: { primary: '#3b82f6', secondary: '#64748b' },
        spacing: { sm: '4px', md: '8px' },
      });

      const resolver = createResolver({ schema, fetcher });

      const primary = await resolver.get({ themeId: 'theme-1', path: 'colors.primary' });
      expect(primary).toBe('#3b82f6');

      const md = await resolver.get({ themeId: 'theme-1', path: 'spacing.md' });
      expect(md).toBe('8px');
    });

    it('uses cached theme', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        colors: { primary: '#3b82f6' },
      });

      const resolver = createResolver({ schema, fetcher });

      await resolver.get({ themeId: 'theme-1', path: 'colors.primary' });
      await resolver.get({ themeId: 'theme-1', path: 'colors.secondary' });
      await resolver.get({ themeId: 'theme-1', path: 'spacing.sm' });

      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });

  describe('cache size limit', () => {
    it('respects maxSize', async () => {
      const colors = ['#111111', '#222222', '#333333', '#444444'];
      let callIndex = 0;

      const fetcher = vi.fn().mockImplementation(() => {
        const color = colors[callIndex % colors.length];
        callIndex++;
        return Promise.resolve({
          colors: { primary: color },
        });
      });

      const resolver = createResolver({
        schema,
        fetcher,
        cache: { maxSize: 2 },
      });

      await resolver.resolve({ themeId: 'theme-1' });
      await resolver.resolve({ themeId: 'theme-2' });
      await resolver.resolve({ themeId: 'theme-3' }); // should evict theme-1

      expect(fetcher).toHaveBeenCalledTimes(3);

      // theme-2 should still be cached
      await resolver.resolve({ themeId: 'theme-2' });
      expect(fetcher).toHaveBeenCalledTimes(3);

      // theme-1 should have been evicted
      await resolver.resolve({ themeId: 'theme-1' });
      expect(fetcher).toHaveBeenCalledTimes(4);
    });
  });
});
