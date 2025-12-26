/**
 * Theme manager for the Livery vanilla JS example.
 *
 * Demonstrates how to:
 * - Create a resolver with async theme fetching
 * - Apply themes by injecting CSS variables
 * - Switch themes at runtime
 */

import { createResolver, toCssString } from '@livery/core';
import { schema, type AppTheme } from './schema';

/**
 * List of available theme IDs.
 * In production, this would come from your database or API.
 */
export const THEMES = ['acme', 'globex', 'initech'] as const;
export type ThemeId = (typeof THEMES)[number];

/**
 * Fetch theme data from the "database" (JSON files in /themes/).
 * In production, this would be an API call to your backend.
 */
async function fetchTheme({ themeId }: { themeId: string }): Promise<Partial<AppTheme>> {
  const response = await fetch(`/themes/${themeId}.json`);

  if (!response.ok) {
    throw new Error(`Theme not found: ${themeId}`);
  }

  return response.json();
}

/**
 * Create a theme resolver with caching.
 * The resolver handles fetching, validation, and caching of theme data.
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
 * Inject theme CSS variables into the document.
 */
function injectThemeStyles(css: string): void {
  let styleEl = document.getElementById('livery-theme') as HTMLStyleElement | null;

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'livery-theme';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = css;
}

/**
 * Apply a theme to the document.
 * This validates the theme data and injects CSS variables.
 */
export function applyTheme(theme: AppTheme): void {
  const css = toCssString({ schema, theme });
  injectThemeStyles(css);
}

/**
 * Current theme state
 */
let currentTheme: ThemeId | null = null;

/**
 * Get the current theme ID
 */
export function getCurrentTheme(): ThemeId | null {
  return currentTheme;
}

/**
 * Switch to a different theme.
 * Fetches the theme, validates it, and applies CSS variables.
 */
export async function switchTheme(themeId: ThemeId): Promise<void> {
  console.log(`[Livery] Switching to theme: ${themeId}`);

  try {
    // Fetch and resolve the theme (resolver handles validation, coercion, and caching)
    const theme = await resolver.resolve({ themeId });

    // Apply the theme (generates CSS and injects into DOM)
    applyTheme(theme);
    currentTheme = themeId;

    // Update the brand name in the UI
    updateBrandName(theme.brand.name);

    console.log(`[Livery] Theme applied for: ${themeId}`);
  } catch (error) {
    console.error(`[Livery] Failed to switch theme:`, error);
  }
}

/**
 * Update the brand name display in the UI
 */
function updateBrandName(name: string): void {
  const brandNameEl = document.getElementById('brand-name');
  if (brandNameEl) {
    brandNameEl.textContent = name;
  }

  const currentThemeEl = document.getElementById('current-theme');
  if (currentThemeEl && currentTheme) {
    currentThemeEl.textContent = currentTheme;
  }
}
