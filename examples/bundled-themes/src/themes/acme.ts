/**
 * Acme Corporation theme configuration.
 *
 * This theme is type-checked against the schema.
 * TypeScript will error if any values are missing or invalid.
 */

import type { AppTheme } from '../schema';

export const acmeTheme: AppTheme = {
  brand: {
    name: 'Acme Corporation',
    primary: '#ef4444',
    secondary: '#f97316',
  },
  colors: {
    background: '#fef2f2',
    surface: '#ffffff',
    text: '#7f1d1d',
    textMuted: '#b91c1c',
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
    lineHeight: 1.6,
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  borders: {
    radius: '12px',
  },
};
