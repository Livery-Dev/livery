/**
 * Theme schema for Dark Mode example
 *
 * Demonstrates how to structure a schema that supports light/dark mode
 * with tenant-specific color palettes.
 */

import { createSchema, t, type InferTheme } from '@livery/core';

export const schema = createSchema({
  definition: {
    brand: {
      name: t.string().default('App'),
      primary: t.color().default('#3b82f6'),
      primaryHover: t.color().default('#2563eb'),
    },
    colors: {
      background: t.color().default('#ffffff'),
      surface: t.color().default('#f8fafc'),
      surfaceHover: t.color().default('#f1f5f9'),
      border: t.color().default('#e2e8f0'),
      text: t.color().default('#0f172a'),
      textMuted: t.color().default('#64748b'),
      textInverse: t.color().default('#ffffff'),
    },
    spacing: {
      xs: t.dimension().default('4px'),
      sm: t.dimension().default('8px'),
      md: t.dimension().default('16px'),
      lg: t.dimension().default('24px'),
      xl: t.dimension().default('32px'),
    },
    border: {
      radius: t.dimension().default('8px'),
    },
  },
});

export type AppTheme = InferTheme<typeof schema.definition>;
