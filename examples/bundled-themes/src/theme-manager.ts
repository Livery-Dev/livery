/**
 * Type-safe theme manager for the Livery TypeScript example.
 *
 * This example demonstrates:
 * - Synchronous theme loading from bundled TypeScript modules
 * - Full type safety with InferTheme
 * - No runtime validation needed (TypeScript catches errors at build time)
 */

import { toCssString } from '@livery/core';
import { schema, type AppTheme } from './schema';
import { themes, THEME_IDS, type ThemeId } from './themes';

/**
 * Current theme state
 */
let currentThemeId: ThemeId | null = null;
let currentTheme: AppTheme | null = null;

/**
 * Get the current theme ID
 */
export function getCurrentThemeId(): ThemeId | null {
  return currentThemeId;
}

/**
 * Get the current theme
 */
export function getCurrentTheme(): AppTheme | null {
  return currentTheme;
}

/**
 * Get all available theme IDs
 */
export function getThemeIds(): readonly ThemeId[] {
  return THEME_IDS;
}

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
 * Since themes are typed, no runtime validation is needed.
 */
export function applyTheme(theme: AppTheme): void {
  const css = toCssString({ schema, theme });
  injectThemeStyles(css);
  currentTheme = theme;
}

/**
 * Switch to a different theme.
 * This is synchronous because themes are bundled with the app.
 */
export function switchTheme(themeId: ThemeId): void {
  const theme = themes[themeId];

  console.log(`[Livery] Switching to theme: ${themeId}`);

  applyTheme(theme);
  currentThemeId = themeId;

  // Update the brand name in the UI
  const brandNameEl = document.getElementById('brand-name');
  if (brandNameEl) {
    brandNameEl.textContent = theme.brand.name;
  }

  // Dispatch custom event for UI updates
  window.dispatchEvent(
    new CustomEvent('livery:theme-changed', {
      detail: { themeId, theme },
    })
  );

  console.log(`[Livery] Theme applied for: ${themeId}`);
}

/**
 * Initialize with the first theme
 */
export function initializeTheme(): void {
  const firstTheme = THEME_IDS[0];
  if (firstTheme) {
    switchTheme(firstTheme);
  }
}

// Re-export types
export type { ThemeId };
