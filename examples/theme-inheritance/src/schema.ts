/**
 * Theme schema for the inheritance example.
 */

import { createSchema, t, type InferTheme } from '@livery/core';

export const schema = createSchema({
  definition: {
    brand: {
      name: t.string().default('Your App'),
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
    },

    colors: {
      background: t.color().default('#ffffff'),
      surface: t.color().default('#f8fafc'),
      text: t.color().default('#1e293b'),
      textMuted: t.color().default('#64748b'),
      border: t.color().default('#e2e8f0'),
    },

    typography: {
      fontFamily: t.fontFamily().default('Inter, system-ui, sans-serif'),
      fontSize: t.dimension().default('16px'),
      lineHeight: t.number().default(1.5),
    },

    spacing: {
      sm: t.dimension().default('8px'),
      md: t.dimension().default('16px'),
      lg: t.dimension().default('24px'),
    },

    borders: {
      radius: t.dimension().default('8px'),
    },
  },
});

export type AppTheme = InferTheme<typeof schema.definition>;

/**
 * Deep partial type for theme overrides.
 * Allows tenants to override any subset of the theme.
 */
export type ThemeOverrides = {
  [K in keyof AppTheme]?: Partial<AppTheme[K]>;
};
