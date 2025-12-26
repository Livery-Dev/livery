/**
 * Theme schema definition.
 *
 * This defines the shape of your design tokens.
 * TypeScript will enforce that all themes match this schema.
 */

import { createSchema, t, type InferTheme } from '@livery/core';

export const schema = createSchema({
  definition: {
    colors: {
      primary: t.color(),
      primaryHover: t.color(),
      background: t.color(),
      foreground: t.color(),
      surface: t.color(),
      surfaceHover: t.color(),
      border: t.color(),
      muted: t.color(),
    },
    radius: t.dimension(),
  },
});

// Infer the theme type from the schema
export type Theme = InferTheme<typeof schema.definition>;
