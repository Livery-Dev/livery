/**
 * Livery configuration for Tailwind example
 */

import { createResolver } from '@livery/core';
import { createDynamicThemeProvider } from '@livery/react';
import { schema, type AppTheme } from './schema';

// Mock themes - demonstrates Tailwind integration
const themes: Record<string, Partial<AppTheme>> = {
  startup: {
    brand: {
      primary: '#8b5cf6', // Purple
      secondary: '#a78bfa',
    },
    border: {
      radius: {
        sm: '8px',
        md: '12px',
        lg: '24px',
      },
    },
    typography: {
      headingFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      baseSize: '16px',
    },
  },
  enterprise: {
    brand: {
      primary: '#0f172a', // Slate
      secondary: '#334155',
    },
    border: {
      radius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
      },
    },
    typography: {
      headingFont: 'Georgia, serif',
      bodyFont: 'system-ui, sans-serif',
      baseSize: '15px',
    },
  },
  creative: {
    brand: {
      primary: '#f97316', // Orange
      secondary: '#fb923c',
    },
    border: {
      radius: {
        sm: '16px',
        md: '24px',
        lg: '9999px',
      },
    },
    typography: {
      headingFont: 'Comic Sans MS, cursive',
      bodyFont: 'system-ui, sans-serif',
      baseSize: '18px',
    },
  },
};

export const THEMES = ['startup', 'enterprise', 'creative'] as const;
export type ThemeId = (typeof THEMES)[number];

async function fetchTheme({ themeId }: { themeId: string }): Promise<Partial<AppTheme>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return themes[themeId] ?? {};
}

export const resolver = createResolver({
  schema,
  fetcher: fetchTheme,
});

export const { DynamicThemeProvider, useTheme, useThemeValue, useThemeReady } = createDynamicThemeProvider({
  schema,
});
