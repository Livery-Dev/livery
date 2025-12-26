/**
 * Livery setup - creates typed provider and hooks from schema.
 */

import { createResolver } from '@livery/core';
import { createDynamicThemeProvider } from '@livery/react';
import { schema, type AppTheme } from './schema';

/**
 * List of available theme IDs.
 */
export const THEMES = ['acme', 'globex', 'initech'] as const;
export type ThemeId = (typeof THEMES)[number];

/**
 * Fetch theme data from JSON files.
 * In production, this would be an API call.
 */
async function fetchTheme({ themeId }: { themeId: string }): Promise<Partial<AppTheme>> {
  const response = await fetch(`/themes/${themeId}.json`);

  if (!response.ok) {
    throw new Error(`Theme not found: ${themeId}`);
  }

  return response.json();
}

/**
 * Theme resolver with caching.
 */
export const resolver = createResolver({
  schema,
  fetcher: fetchTheme,
  cache: {
    ttl: 60 * 1000, // 1 minute cache
    staleWhileRevalidate: true,
  },
});

/**
 * Create typed dynamic theme provider and hooks.
 */
export const { DynamicThemeProvider, useTheme, useThemeValue, useThemeReady } = createDynamicThemeProvider({
  schema,
});
