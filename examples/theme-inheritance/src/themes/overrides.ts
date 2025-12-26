/**
 * Tenant overrides - only the values that differ from base.
 *
 * Notice how each tenant only defines what they want to customize.
 * Everything else is inherited from the base theme.
 */

import type { ThemeOverrides } from '../schema';

/**
 * Acme only customizes brand colors and font.
 * Inherits: spacing, borders, background colors
 */
export const acmeOverrides: ThemeOverrides = {
  brand: {
    name: 'Acme Corporation',
    primary: '#ef4444',
    secondary: '#f97316',
  },
  colors: {
    // Only override text colors to match brand
    text: '#7f1d1d',
    textMuted: '#b91c1c',
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
};

/**
 * Globex customizes more - colors, font, and border radius.
 * Inherits: spacing, line height
 */
export const globexOverrides: ThemeOverrides = {
  brand: {
    name: 'Globex Industries',
    primary: '#8b5cf6',
    secondary: '#a855f7',
  },
  colors: {
    background: '#faf5ff',
    text: '#4c1d95',
    textMuted: '#7c3aed',
    border: '#ddd6fe',
  },
  typography: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '15px',
  },
  borders: {
    radius: '6px',
  },
};

/**
 * Initech only changes brand - minimal customization.
 * Inherits: almost everything!
 */
export const initechOverrides: ThemeOverrides = {
  brand: {
    name: 'Initech',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
  },
  typography: {
    fontFamily: 'IBM Plex Sans, sans-serif',
  },
};

/**
 * Minimal tenant - only changes the name!
 * Shows that tenants can override as little as they want.
 */
export const minimalOverrides: ThemeOverrides = {
  brand: {
    name: 'Minimal Corp',
  },
};
