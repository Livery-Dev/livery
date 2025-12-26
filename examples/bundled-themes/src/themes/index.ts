/**
 * Theme registry - central place to manage all themes.
 *
 * This pattern is useful when themes are bundled with the application
 * (as opposed to fetched from an API).
 */

import type { AppTheme } from '../schema';
import { acmeTheme } from './acme';
import { globexTheme } from './globex';
import { initechTheme } from './initech';

/**
 * Available theme IDs
 */
export const THEME_IDS = ['acme', 'globex', 'initech'] as const;

/**
 * Theme ID type
 */
export type ThemeId = (typeof THEME_IDS)[number];

/**
 * Theme registry mapping theme IDs to their themes.
 * All themes are type-checked against AppTheme.
 */
export const themes: Record<ThemeId, AppTheme> = {
  acme: acmeTheme,
  globex: globexTheme,
  initech: initechTheme,
};

/**
 * Get a theme by theme ID.
 * Returns undefined if the theme doesn't exist.
 */
export function getTheme(themeId: string): AppTheme | undefined {
  if (isThemeId(themeId)) {
    return themes[themeId];
  }
  return undefined;
}

/**
 * Type guard to check if a string is a valid theme ID.
 */
export function isThemeId(value: string): value is ThemeId {
  return THEME_IDS.includes(value as ThemeId);
}
