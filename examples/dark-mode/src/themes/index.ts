/**
 * Theme registry for dark mode example.
 *
 * Each theme has both light and dark variants.
 */

import type { AppTheme } from '../schema';
import { acmeLightTheme, acmeDarkTheme } from './acme';
import { globexLightTheme, globexDarkTheme } from './globex';
import { initechLightTheme, initechDarkTheme } from './initech';

export const THEME_IDS = ['acme', 'globex', 'initech'] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const COLOR_SCHEMES = ['light', 'dark'] as const;
export type ColorScheme = (typeof COLOR_SCHEMES)[number];

/**
 * Theme variants for each theme.
 * Access as: themes[themeId][colorScheme]
 */
export const themes: Record<ThemeId, Record<ColorScheme, AppTheme>> = {
  acme: {
    light: acmeLightTheme,
    dark: acmeDarkTheme,
  },
  globex: {
    light: globexLightTheme,
    dark: globexDarkTheme,
  },
  initech: {
    light: initechLightTheme,
    dark: initechDarkTheme,
  },
};

/**
 * Get a theme for a theme ID and color scheme.
 */
export function getTheme(themeId: ThemeId, colorScheme: ColorScheme): AppTheme {
  return themes[themeId][colorScheme];
}
