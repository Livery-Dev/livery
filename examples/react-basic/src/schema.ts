/**
 * Shared theme schema for the Livery React example.
 *
 * This schema defines the structure of theme tokens that tenants can customize.
 * TypeScript will infer types from this schema automatically.
 */

import { createSchema, t, type InferTheme } from '@livery/core';

/**
 * Create the theme schema with all customizable tokens.
 * Each token has a default value that tenants can override.
 */
export const schema = createSchema({
  definition: {
    // Brand identity
    brand: {
      /** Tenant display name */
      name: t.string().default('Your App'),
      /** Primary brand color - used for buttons, links, accents */
      primary: t.color().default('#3b82f6'),
      /** Secondary brand color - used for highlights and secondary actions */
      secondary: t.color().default('#64748b'),
    },

    // Core color palette
    colors: {
      /** Page background color */
      background: t.color().default('#ffffff'),
      /** Card/surface background color */
      surface: t.color().default('#f8fafc'),
      /** Primary text color */
      text: t.color().default('#1e293b'),
      /** Muted/secondary text color */
      textMuted: t.color().default('#64748b'),
    },

    // Typography settings
    typography: {
      /** Primary font family */
      fontFamily: t.fontFamily().default('Inter, system-ui, sans-serif'),
      /** Base font size */
      fontSize: t.dimension().default('16px'),
      /** Base line height */
      lineHeight: t.number().default(1.5),
    },

    // Spacing scale
    spacing: {
      /** Small spacing (8px) */
      sm: t.dimension().default('8px'),
      /** Medium spacing (16px) */
      md: t.dimension().default('16px'),
      /** Large spacing (24px) */
      lg: t.dimension().default('24px'),
    },

    // Border settings
    borders: {
      /** Border radius for cards, buttons, etc. */
      radius: t.dimension().default('8px'),
    },
  },
});

/**
 * Inferred theme type from the schema.
 * Use this type when working with theme data.
 */
export type AppTheme = InferTheme<typeof schema.definition>;
