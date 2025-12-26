/**
 * Theme manager with inheritance support.
 *
 * Demonstrates:
 * - Base theme with tenant-specific overrides
 * - Deep merge to combine base + overrides
 * - Visualizing what each tenant overrides
 */

import { toCssString } from '@livery/core';
import { schema, type AppTheme } from './schema';
import { getTheme, getOverrides, getBaseTheme, THEME_IDS, type ThemeId } from './themes';

let currentThemeId: ThemeId = THEME_IDS[0];

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
 */
function applyTheme(theme: AppTheme): void {
  const css = toCssString({ schema, theme });
  injectThemeStyles(css);
}

/**
 * Switch to a theme.
 */
export function switchTheme(themeId: ThemeId): void {
  currentThemeId = themeId;

  // Get the merged theme (base + overrides)
  const theme = getTheme(themeId);
  applyTheme(theme);

  console.log(`[Livery] Switched to theme: ${themeId}`);
  console.log(`[Livery] Overrides:`, getOverrides(themeId));

  // Dispatch event for UI updates
  window.dispatchEvent(
    new CustomEvent('livery:theme-changed', {
      detail: { themeId, theme, overrides: getOverrides(themeId) },
    })
  );
}

/**
 * Get the current theme ID.
 */
export function getCurrentThemeId(): ThemeId {
  return currentThemeId;
}

/**
 * Get the current resolved theme.
 */
export function getCurrentTheme(): AppTheme {
  return getTheme(currentThemeId);
}

/**
 * Get the current theme's overrides.
 */
export function getCurrentOverrides() {
  return getOverrides(currentThemeId);
}

/**
 * Get the base theme for comparison.
 */
export { getBaseTheme };

/**
 * Get all theme IDs.
 */
export function getThemeIds(): readonly ThemeId[] {
  return THEME_IDS;
}

/**
 * Initialize with the first theme.
 */
export function initializeTheme(): void {
  switchTheme(THEME_IDS[0]);
}

export type { ThemeId };
