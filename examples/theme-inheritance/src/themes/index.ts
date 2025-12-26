/**
 * Theme registry with inheritance support.
 */

import type { AppTheme, ThemeOverrides } from '../schema';
import { baseTheme } from './base';
import { acmeOverrides, globexOverrides, initechOverrides, minimalOverrides } from './overrides';

export const THEME_IDS = ['acme', 'globex', 'initech', 'minimal'] as const;
export type ThemeId = (typeof THEME_IDS)[number];

/**
 * Map of theme IDs to their overrides.
 */
const themeOverrides: Record<ThemeId, ThemeOverrides> = {
  acme: acmeOverrides,
  globex: globexOverrides,
  initech: initechOverrides,
  minimal: minimalOverrides,
};

/**
 * Deep merge two objects.
 * The override values take precedence.
 */
function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };

  for (const key of Object.keys(override) as Array<keyof T>) {
    const overrideValue = override[key];

    if (
      overrideValue !== undefined &&
      typeof overrideValue === 'object' &&
      overrideValue !== null &&
      !Array.isArray(overrideValue) &&
      typeof base[key] === 'object' &&
      base[key] !== null
    ) {
      // Recursively merge nested objects
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        overrideValue as Record<string, unknown>
      ) as T[keyof T];
    } else if (overrideValue !== undefined) {
      // Override primitive values
      result[key] = overrideValue as T[keyof T];
    }
  }

  return result;
}

/**
 * Get the resolved theme for a theme ID.
 * Merges the base theme with theme-specific overrides.
 */
export function getTheme(themeId: ThemeId): AppTheme {
  const overrides = themeOverrides[themeId];
  return deepMerge(baseTheme, overrides as Partial<AppTheme>);
}

/**
 * Get the base theme (useful for comparison).
 */
export function getBaseTheme(): AppTheme {
  return baseTheme;
}

/**
 * Get the raw overrides for a theme (useful for displaying what changed).
 */
export function getOverrides(themeId: ThemeId): ThemeOverrides {
  return themeOverrides[themeId];
}

export { baseTheme };
