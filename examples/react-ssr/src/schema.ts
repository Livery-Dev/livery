/**
 * Theme schema for SSR example
 */

import { createSchema, t, type InferTheme } from '@livery/core';

export const schema = createSchema({
  definition: {
    brand: {
      name: t.string().default('SSR App'),
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
    },
    colors: {
      background: t.color().default('#ffffff'),
      surface: t.color().default('#f8fafc'),
      text: t.color().default('#0f172a'),
      textMuted: t.color().default('#64748b'),
    },
    spacing: {
      sm: t.dimension().default('8px'),
      md: t.dimension().default('16px'),
      lg: t.dimension().default('24px'),
    },
    border: {
      radius: t.dimension().default('8px'),
    },
  },
});

export type AppTheme = InferTheme<typeof schema.definition>;
