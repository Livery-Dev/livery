/**
 * Theme schema for the dark mode example.
 *
 * This schema is used for both light and dark variants.
 * Each tenant defines both variants with appropriate colors.
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
      // Semantic colors that change between light/dark
      background: t.color().default('#ffffff'),
      surface: t.color().default('#f8fafc'),
      surfaceHover: t.color().default('#f1f5f9'),
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
