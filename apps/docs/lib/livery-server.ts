/**
 * Server-side Livery utilities for the documentation site.
 * Uses toCssStringAll to generate CSS for all themes at once,
 * enabling instant theme switching via data-theme attribute.
 */

import { toCssStringAll, type InferTheme } from '@livery/core';
import { schema } from './schema';
import {
  defaultTheme,
  darkTheme,
  oceanTheme,
  forestTheme,
  sunsetTheme,
  type ThemeName,
} from './themes';

type Theme = InferTheme<typeof schema.definition>;

// Define all themes in a single object for toCssStringAll
const allThemes: Record<ThemeName, Theme> = {
  default: defaultTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
};

/**
 * Generate CSS for ALL themes at once.
 * This outputs CSS like:
 *   :root, [data-theme="default"] { --colors-primary: #171717; ... }
 *   [data-theme="dark"] { --colors-primary: #FFFFFF; ... }
 *   [data-theme="ocean"] { ... }
 *   etc.
 *
 * Theme switching then only requires changing document.documentElement.dataset.theme
 * No runtime CSS regeneration, no loading states, no jitter.
 */
export function generateAllThemesCss(): string {
  return toCssStringAll({
    schema,
    themes: allThemes,
    defaultTheme: 'default',
  });
}

// Re-export for convenience
export { schema } from './schema';
export { type ThemeName } from './themes';
