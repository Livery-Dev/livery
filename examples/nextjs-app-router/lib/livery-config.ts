/**
 * Livery configuration - Server-safe exports
 *
 * This file contains the schema and resolver configuration that can be
 * safely imported in both Server and Client components.
 */

import { createSchema, createResolver, t, type InferTheme } from '@livery/core';

/**
 * Theme schema definition
 *
 * This defines the structure of your theme. You can add any tokens
 * that make sense for your application.
 */
export const schema = createSchema({
  definition: {
    brand: {
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#8b5cf6'),
      accent: t.color().default('#f59e0b'),
    },
    background: {
      default: t.color().default('#ffffff'),
      surface: t.color().default('#f8fafc'),
      muted: t.color().default('#f1f5f9'),
    },
    text: {
      primary: t.color().default('#0f172a'),
      secondary: t.color().default('#475569'),
      muted: t.color().default('#94a3b8'),
    },
    spacing: {
      xs: t.dimension().default('4px'),
      sm: t.dimension().default('8px'),
      md: t.dimension().default('16px'),
      lg: t.dimension().default('24px'),
      xl: t.dimension().default('32px'),
    },
    borderRadius: {
      sm: t.dimension().default('4px'),
      md: t.dimension().default('8px'),
      lg: t.dimension().default('12px'),
      full: t.dimension().default('9999px'),
    },
  },
});

/**
 * Inferred theme type from the schema
 */
export type Theme = InferTheme<typeof schema.definition>;

/**
 * Demo themes for different tenants
 *
 * In a real application, these would be fetched from a database or API.
 */
const demoThemes: Record<string, Theme> = {
  acme: {
    brand: {
      primary: '#ef4444',
      secondary: '#f97316',
      accent: '#fbbf24',
    },
    background: {
      default: '#ffffff',
      surface: '#fef2f2',
      muted: '#fee2e2',
    },
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      muted: '#9ca3af',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
  },
  beta: {
    brand: {
      primary: '#10b981',
      secondary: '#06b6d4',
      accent: '#8b5cf6',
    },
    background: {
      default: '#ffffff',
      surface: '#ecfdf5',
      muted: '#d1fae5',
    },
    text: {
      primary: '#064e3b',
      secondary: '#065f46',
      muted: '#047857',
    },
    spacing: {
      xs: '6px',
      sm: '12px',
      md: '18px',
      lg: '30px',
      xl: '42px',
    },
    borderRadius: {
      sm: '6px',
      md: '12px',
      lg: '18px',
      full: '9999px',
    },
  },
  gamma: {
    brand: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
    },
    background: {
      default: '#0f172a',
      surface: '#1e293b',
      muted: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: {
      sm: '2px',
      md: '4px',
      lg: '8px',
      full: '9999px',
    },
  },
};

/**
 * Theme resolver
 *
 * Fetches theme data for a given theme ID. In a real application,
 * this would fetch from a database, API, or CMS.
 */
export const resolver = createResolver({
  schema,
  fetcher: async ({ themeId }): Promise<Theme> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Return demo theme or default
    const theme = demoThemes[themeId];
    if (theme) {
      return theme;
    }

    // Return defaults from schema
    return {
      brand: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
      },
      background: {
        default: '#ffffff',
        surface: '#f8fafc',
        muted: '#f1f5f9',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        muted: '#94a3b8',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
    };
  },
});
