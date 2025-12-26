/**
 * Livery configuration for Dark Mode example
 *
 * Each tenant has both light and dark theme variants.
 * The theme is determined by: tenant + color mode.
 */

import { createResolver } from '@livery/core';
import { createDynamicThemeProvider } from '@livery/react';
import { schema, type AppTheme } from './schema';

type ColorMode = 'light' | 'dark';

// Light mode themes per tenant
const lightThemes: Record<string, AppTheme> = {
  acme: {
    brand: {
      name: 'Acme Corp',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
    },
    colors: {
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceHover: '#f1f5f9',
      border: '#e2e8f0',
      text: '#0f172a',
      textMuted: '#64748b',
      textInverse: '#ffffff',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    border: {
      radius: '8px',
    },
  },
  globex: {
    brand: {
      name: 'Globex',
      primary: '#10b981',
      primaryHover: '#059669',
    },
    colors: {
      background: '#fefefe',
      surface: '#f0fdf4',
      surfaceHover: '#dcfce7',
      border: '#bbf7d0',
      text: '#14532d',
      textMuted: '#4d7c0f',
      textInverse: '#ffffff',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    border: {
      radius: '12px',
    },
  },
};

// Dark mode themes per tenant
const darkThemes: Record<string, AppTheme> = {
  acme: {
    brand: {
      name: 'Acme Corp',
      primary: '#60a5fa',
      primaryHover: '#93c5fd',
    },
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      surfaceHover: '#334155',
      border: '#334155',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      textInverse: '#0f172a',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    border: {
      radius: '8px',
    },
  },
  globex: {
    brand: {
      name: 'Globex',
      primary: '#34d399',
      primaryHover: '#6ee7b7',
    },
    colors: {
      background: '#022c22',
      surface: '#064e3b',
      surfaceHover: '#065f46',
      border: '#047857',
      text: '#d1fae5',
      textMuted: '#6ee7b7',
      textInverse: '#022c22',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    border: {
      radius: '12px',
    },
  },
};

export const THEMES = ['acme', 'globex'] as const;
export type ThemeId = (typeof THEMES)[number];

/**
 * Creates a compound theme ID that includes the color mode.
 * This allows the resolver to fetch the correct theme variant.
 */
export function createThemeId(theme: ThemeId, mode: ColorMode): string {
  return `${theme}:${mode}`;
}

export function parseThemeId(themeId: string): { theme: ThemeId; mode: ColorMode } {
  const [theme, mode] = themeId.split(':') as [ThemeId, ColorMode];
  return { theme, mode };
}

async function fetchTheme({ themeId }: { themeId: string }): Promise<AppTheme> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const { theme, mode } = parseThemeId(themeId);
  const themeData = mode === 'dark' ? darkThemes : lightThemes;

  return themeData[theme] ?? lightThemes['acme']!;
}

export const resolver = createResolver({
  schema,
  fetcher: fetchTheme,
});

export const { DynamicThemeProvider, useTheme, useThemeValue, useThemeReady } = createDynamicThemeProvider({
  schema,
});
