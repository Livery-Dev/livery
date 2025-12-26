import { createSchema, t } from '@livery/core';

/**
 * Theme schema for the Livery documentation site.
 * Demonstrates various token types and nested structures.
 * Each theme can completely transform the look and feel.
 */
export const schema = createSchema({
  definition: {
    colors: {
      // Brand colors
      primary: t.color().describe('Primary brand color'),
      primaryHover: t.color().describe('Primary hover state'),
      accent: t.color().describe('Accent/highlight color'),

      // Background colors
      background: t.color().describe('Main background'),
      backgroundAlt: t.color().describe('Alternate background'),
      backgroundDark: t.color().describe('Dark background'),
      surface: t.color().describe('Card/surface background'),
      surfaceHover: t.color().describe('Card hover background'),

      // Text colors
      text: t.color().describe('Primary text'),
      textMuted: t.color().describe('Secondary/muted text'),
      textInverse: t.color().describe('Inverse text (on dark bg)'),

      // Border colors
      border: t.color().describe('Default border'),
      borderHover: t.color().describe('Border on hover'),

      // State colors
      success: t.color().describe('Success state'),
      warning: t.color().describe('Warning state'),
      error: t.color().describe('Error state'),
    },

    typography: {
      fontFamily: {
        sans: t.fontFamily().describe('Sans-serif font stack'),
        serif: t.fontFamily().describe('Serif font stack'),
        mono: t.fontFamily().describe('Monospace font stack'),
        display: t.fontFamily().describe('Display/heading font'),
      },
      fontSize: {
        xs: t.dimension().describe('Extra small text'),
        sm: t.dimension().describe('Small text'),
        base: t.dimension().describe('Base text'),
        lg: t.dimension().describe('Large text'),
        xl: t.dimension().describe('Extra large text'),
        '2xl': t.dimension().describe('2x large text'),
        '3xl': t.dimension().describe('3x large text'),
        '4xl': t.dimension().describe('4x large text'),
      },
      fontWeight: {
        normal: t.fontWeight().describe('Normal weight'),
        medium: t.fontWeight().describe('Medium weight'),
        semibold: t.fontWeight().describe('Semibold weight'),
        bold: t.fontWeight().describe('Bold weight'),
      },
      letterSpacing: {
        tight: t.dimension().describe('Tight letter spacing'),
        normal: t.dimension().describe('Normal letter spacing'),
        wide: t.dimension().describe('Wide letter spacing'),
      },
      lineHeight: {
        tight: t.string().describe('Tight line height'),
        normal: t.string().describe('Normal line height'),
        relaxed: t.string().describe('Relaxed line height'),
      },
    },

    spacing: {
      xs: t.dimension().describe('Extra small spacing'),
      sm: t.dimension().describe('Small spacing'),
      md: t.dimension().describe('Medium spacing'),
      lg: t.dimension().describe('Large spacing'),
      xl: t.dimension().describe('Extra large spacing'),
      '2xl': t.dimension().describe('2x large spacing'),
    },

    borderRadius: {
      none: t.dimension().describe('No radius'),
      sm: t.dimension().describe('Small radius'),
      md: t.dimension().describe('Medium radius'),
      lg: t.dimension().describe('Large radius'),
      xl: t.dimension().describe('Extra large radius'),
      full: t.dimension().describe('Full/pill radius'),
    },

    borders: {
      width: {
        none: t.dimension().describe('No border'),
        thin: t.dimension().describe('Thin border'),
        medium: t.dimension().describe('Medium border'),
        thick: t.dimension().describe('Thick border'),
      },
    },

    shadows: {
      none: t.shadow().describe('No shadow'),
      sm: t.shadow().describe('Small shadow'),
      md: t.shadow().describe('Medium shadow'),
      lg: t.shadow().describe('Large shadow'),
      xl: t.shadow().describe('Extra large shadow'),
    },

    // Syntax highlighting colors for code blocks
    syntax: {
      background: t.color().describe('Code block background'),
      text: t.color().describe('Default code text'),
      comment: t.color().describe('Comments'),
      string: t.color().describe('Strings and template literals'),
      keyword: t.color().describe('Keywords (import, const, etc.)'),
      function: t.color().describe('Function names'),
      property: t.color().describe('Object properties'),
      punctuation: t.color().describe('Punctuation and operators'),
      value: t.color().describe('Numbers, booleans, constants'),
    },

    // Theme metadata for UI
    meta: {
      name: t.string().describe('Theme display name'),
      description: t.string().describe('Theme description'),
    },
  },
});

export type ThemeSchema = typeof schema;
