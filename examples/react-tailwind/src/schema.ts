/**
 * Theme schema for Tailwind example - demonstrates comprehensive theming
 */

import { createSchema, t, type InferTheme } from '@livery/core';

export const schema = createSchema({
  definition: {
    brand: {
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
    },
    spacing: {
      sm: t.dimension().default('8px'),
      md: t.dimension().default('16px'),
      lg: t.dimension().default('24px'),
    },
    border: {
      radius: {
        sm: t.dimension().default('4px'),
        md: t.dimension().default('8px'),
        lg: t.dimension().default('16px'),
      },
    },
    typography: {
      headingFont: t.fontFamily().default('system-ui, sans-serif'),
      bodyFont: t.fontFamily().default('system-ui, sans-serif'),
      baseSize: t.dimension().default('16px'),
    },
  },
});

export type AppTheme = InferTheme<typeof schema.definition>;
