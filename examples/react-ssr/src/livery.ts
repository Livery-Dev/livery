/**
 * Livery configuration for SSR example
 */

import { createResolver } from '@livery/core';
import { createDynamicThemeProvider } from '@livery/react';
import { schema, type AppTheme } from './schema';

// Mock themes
const themes: Record<string, AppTheme> = {
  acme: {
    brand: {
      name: 'Acme Corp',
      primary: '#3b82f6',
      secondary: '#60a5fa',
    },
    colors: {
      background: '#ffffff',
      surface: '#f0f9ff',
      text: '#0f172a',
      textMuted: '#64748b',
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px',
    },
    border: {
      radius: '8px',
    },
  },
  globex: {
    brand: {
      name: 'Globex Inc',
      primary: '#10b981',
      secondary: '#34d399',
    },
    colors: {
      background: '#ffffff',
      surface: '#f0fdf4',
      text: '#14532d',
      textMuted: '#4d7c0f',
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px',
    },
    border: {
      radius: '12px',
    },
  },
};

export const THEMES = ['acme', 'globex'] as const;
export type ThemeId = (typeof THEMES)[number];

export async function fetchTheme({ themeId }: { themeId: string }): Promise<AppTheme> {
  // Simulate network delay (shorter on server)
  await new Promise((resolve) => setTimeout(resolve, 50));
  return themes[themeId] ?? themes['acme']!;
}

export const resolver = createResolver({
  schema,
  fetcher: fetchTheme,
});

export const { DynamicThemeProvider, useTheme, useThemeValue, useThemeReady } = createDynamicThemeProvider({
  schema,
});
