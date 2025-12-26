/**
 * Theme schema for the Livery TypeScript example.
 *
 * This schema defines the structure of theme tokens.
 * TypeScript will enforce type safety when creating themes.
 */

import { createSchema, t, type InferTheme } from '@livery/core';

/**
 * Create the theme schema with all customizable tokens.
 */
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

/**
 * Inferred theme type - used to type-check theme definitions.
 */
export type AppTheme = InferTheme<typeof schema.definition>;
