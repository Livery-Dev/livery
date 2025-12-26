/**
 * Theme definitions for light and dark modes.
 *
 * Each theme must satisfy the Theme type inferred from the schema.
 * TypeScript catches any missing or mistyped tokens at build time.
 */

import { toCssStringAll } from '@livery/core';
import { schema, type Theme } from './schema';

// Light theme
const light: Theme = {
  colors: {
    primary: '#14B8A6',
    primaryHover: '#0D9488',
    background: '#FFFFFF',
    foreground: '#0F172A',
    surface: '#F8FAFC',
    surfaceHover: '#F1F5F9',
    border: '#E2E8F0',
    muted: '#64748B',
  },
  radius: '0.5rem',
};

// Dark theme
const dark: Theme = {
  colors: {
    primary: '#2DD4BF',
    primaryHover: '#14B8A6',
    background: '#0F172A',
    foreground: '#F8FAFC',
    surface: '#1E293B',
    surfaceHover: '#334155',
    border: '#334155',
    muted: '#94A3B8',
  },
  radius: '0.5rem',
};

// All available themes
export type ThemeId = 'light' | 'dark';

const themes: Record<ThemeId, Theme> = {
  light,
  dark,
};

/**
 * Generate CSS for ALL themes at once.
 *
 * This outputs:
 *   :root, [data-theme="light"] { --colors-primary: #14B8A6; ... }
 *   [data-theme="dark"] { --colors-primary: #2DD4BF; ... }
 *
 * Switching themes is just changing the data-theme attribute.
 * No CSS regeneration needed!
 */
export const themesCss = toCssStringAll({
  schema,
  themes,
  defaultTheme: 'light',
});
