import type { InferTheme } from '@livery/core';
import { schema } from './schema';

// Extract the definition type from the schema
type SchemaDefinition = typeof schema.definition;
type Theme = InferTheme<SchemaDefinition>;

/**
 * 1. Default Theme - Cal.com-inspired grayscale-first design
 * Inter font, minimal shadows, clean borders, high contrast
 * Saturated colors reserved for essential UI elements only
 */
export const defaultTheme: Theme = {
  colors: {
    primary: '#171717', // Near-black for primary actions (Cal.com style)
    primaryHover: '#262626', // Slightly lighter on hover
    accent: '#2563EB', // Blue accent for visual contrast
    background: '#FFFFFF',
    backgroundAlt: '#F4F4F4', // Very subtle off-white
    backgroundDark: '#0f172A',
    surface: '#FFFFFF',
    surfaceHover: '#F5F5F5', // Neutral-100
    text: '#171717', // Near-black (high contrast)
    textMuted: '#525252', // Neutral-600 (improved contrast)
    textInverse: '#FFFFFF',
    border: '#E5E5E5', // Neutral-200 (subtle)
    borderHover: '#D4D4D4', // Neutral-300
    success: '#10B981', // Emerald for success states
    warning: '#F59E0B', // Amber for warnings
    error: '#EF4444', // Red for errors
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'var(--font-mono), ui-monospace, monospace',
      display: 'var(--font-cal), var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.75rem', // 28px
      '4xl': '4rem', // 64px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    full: '9999px',
  },
  borders: {
    width: {
      none: '0',
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    md: '0 1px 3px 0 rgb(0 0 0 / 0.06)',
    lg: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
    xl: '0 10px 15px -3px rgb(0 0 0 / 0.08)',
  },
  syntax: {
    background: '#171717', // neutral-900
    text: '#e5e5e5', // neutral-200
    comment: '#9ca3af', // gray-400 (improved contrast)
    string: '#6ee7b7', // emerald-300
    keyword: '#c4b5fd', // violet-300
    function: '#60a5fa', // blue-400
    property: '#7dd3fc', // sky-300
    punctuation: '#d4d4d4', // neutral-300
    value: '#fbbf24', // amber-400
  },
  meta: {
    name: 'Default',
    description: 'Cal.com-inspired minimal design',
  },
};

/**
 * 2. Dark Theme - Cal.com-inspired dark mode
 * Near-black background, white text, grayscale-first with teal accent
 */
export const darkTheme: Theme = {
  colors: {
    primary: '#FFFFFF', // White for primary actions in dark mode
    primaryHover: '#E5E5E5', // Slightly dimmer on hover
    accent: '#3B82F6', // Blue accent (brighter for dark mode)
    background: '#0A0A0A', // Near-black (Cal.com style)
    backgroundAlt: '#141414', // Slightly lighter than background
    backgroundDark: '#000000',
    surface: '#1F1F1F', // Card backgrounds - lighter for contrast
    surfaceHover: '#2A2A2A', // Hover state
    text: '#FAFAFA', // Near-white
    textMuted: '#D4D4D4', // Neutral-300 (improved contrast)
    textInverse: '#171717',
    border: '#333333', // Subtle but visible border
    borderHover: '#525252', // Neutral-600
    success: '#34D399', // Brighter emerald for dark mode
    warning: '#FBBF24', // Brighter amber
    error: '#F87171', // Brighter red
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'var(--font-mono), ui-monospace, monospace',
      display: 'var(--font-cal), var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.75rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  borders: {
    width: {
      none: '0',
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
    md: '0 1px 3px 0 rgb(0 0 0 / 0.3)',
    lg: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
    xl: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
  },
  syntax: {
    background: '#1a1a1a', // Slightly lighter than theme background
    text: '#fafafa', // neutral-50
    comment: '#9ca3af', // gray-400 (improved contrast)
    string: '#34d399', // emerald-400
    keyword: '#a78bfa', // violet-400
    function: '#38bdf8', // sky-400
    property: '#67e8f9', // cyan-300
    punctuation: '#d1d5db', // gray-300
    value: '#fcd34d', // amber-300
  },
  meta: {
    name: 'Dark',
    description: 'Cal.com-inspired dark mode',
  },
};

/**
 * 3. Ocean Theme - GitHub-inspired flat design
 * System fonts, square corners, visible borders, minimal shadows
 */
export const oceanTheme: Theme = {
  colors: {
    primary: '#2563EB', // Blue-600
    primaryHover: '#1D4ED8', // Blue-700
    accent: '#7C3AED', // Violet-600
    background: '#FFFFFF',
    backgroundAlt: '#F6F8FA', // GitHub's bg color
    backgroundDark: '#0A0A0A',
    surface: '#FFFFFF',
    surfaceHover: '#F3F4F6',
    text: '#24292F', // GitHub's text color
    textMuted: '#57606A',
    textInverse: '#FFFFFF',
    border: '#D0D7DE', // GitHub's border
    borderHover: '#8C959F',
    success: '#1A7F37',
    warning: '#9A6700',
    error: '#CF222E',
  },
  typography: {
    fontFamily: {
      // GitHub's system font stack
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace',
      display:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '0.875rem', // GitHub uses 14px base
      lg: '1rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '600', // GitHub doesn't use 700
    },
    letterSpacing: {
      tight: '0',
      normal: '0',
      wide: '0',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.5',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  borderRadius: {
    none: '0',
    sm: '3px', // GitHub's small radius
    md: '6px', // GitHub's standard radius
    lg: '6px',
    xl: '6px',
    full: '9999px',
  },
  borders: {
    width: {
      none: '0',
      thin: '1px',
      medium: '1px', // GitHub uses consistent 1px borders
      thick: '2px',
    },
  },
  shadows: {
    none: 'none',
    sm: '0 1px 0 rgba(27, 31, 36, 0.04)', // GitHub's subtle shadow
    md: '0 3px 6px rgba(140, 149, 159, 0.15)',
    lg: '0 8px 24px rgba(140, 149, 159, 0.2)',
    xl: '0 12px 28px rgba(140, 149, 159, 0.3)',
  },
  syntax: {
    background: '#0d1117', // GitHub dark
    text: '#c9d1d9', // GitHub text
    comment: '#8b949e', // GitHub comment
    string: '#a5d6ff', // GitHub string (blue)
    keyword: '#ff7b72', // GitHub keyword (red/coral)
    function: '#d2a8ff', // GitHub function (purple)
    property: '#79c0ff', // GitHub property (light blue)
    punctuation: '#c9d1d9', // Same as text
    value: '#79c0ff', // GitHub constant
  },
  meta: {
    name: 'Ocean',
    description: 'GitHub-inspired flat design',
  },
};

/**
 * 4. Forest Theme - Spotify-inspired bold design
 * Montserrat font, pill buttons, large radius, no borders, elevation-based
 */
export const forestTheme: Theme = {
  colors: {
    primary: '#1DB954', // Spotify green
    primaryHover: '#1ED760',
    accent: '#1DB954',
    background: '#121212', // Spotify's bg
    backgroundAlt: '#181818',
    backgroundDark: '#000000',
    surface: '#282828', // Spotify's card bg
    surfaceHover: '#3E3E3E',
    text: '#FFFFFF',
    textMuted: '#B3B3B3',
    textInverse: '#000000',
    border: '#404040', // More visible border
    borderHover: '#525252',
    success: '#1DB954',
    warning: '#FFA42B',
    error: '#F15E6C',
  },
  typography: {
    fontFamily: {
      // Spotify uses Circular, we use Montserrat as alternative
      sans: 'var(--font-montserrat), -apple-system, BlinkMacSystemFont, sans-serif',
      serif: 'Georgia, serif',
      mono: 'var(--font-mono), monospace',
      display: 'var(--font-montserrat), -apple-system, BlinkMacSystemFont, sans-serif',
    },
    fontSize: {
      xs: '0.6875rem', // 11px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem',
      xl: '1.5rem',
      '2xl': '2rem',
      '3xl': '3rem', // Spotify uses big headings
      '4xl': '4rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: '-0.04em', // Spotify uses tight letter spacing
      normal: '-0.02em',
      wide: '0.1em', // Wide for small caps
    },
    lineHeight: {
      tight: '1.1',
      normal: '1.4',
      relaxed: '1.6',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px', // Spotify's card radius
    xl: '16px',
    full: '500px', // Pill buttons
  },
  borders: {
    width: {
      none: '0',
      thin: '0', // Spotify doesn't use borders
      medium: '0',
      thick: '2px',
    },
  },
  shadows: {
    none: 'none',
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.5)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.5)',
  },
  syntax: {
    background: '#1e1e1e', // Slightly lighter than theme background
    text: '#e2e2e2',
    comment: '#6a6a6a',
    string: '#1DB954', // Spotify green for strings
    keyword: '#b3b3b3', // Muted for keywords
    function: '#1ed760', // Brighter green for functions
    property: '#b4e7c6', // Light green for properties
    punctuation: '#727272',
    value: '#1DB954', // Green for values too
  },
  meta: {
    name: 'Forest',
    description: 'Spotify-inspired bold design',
  },
};

/**
 * 5. Sunset Theme - Notion-inspired warm, editorial design
 * Serif headings, warm colors, soft shadows, subtle borders
 */
export const sunsetTheme: Theme = {
  colors: {
    primary: '#EB5757', // Notion's red
    primaryHover: '#E03E3E',
    accent: '#F2994A', // Notion's orange
    background: '#FFFFFF',
    backgroundAlt: '#FBFBFA', // Notion's off-white
    backgroundDark: '#0A0A0A',
    surface: '#FFFFFF',
    surfaceHover: '#F7F6F3',
    text: '#37352F', // Notion's text color
    textMuted: '#9B9A97',
    textInverse: '#FFFFFF',
    border: '#E9E9E7', // Notion's border
    borderHover: '#DFDFDC',
    success: '#6FCF97',
    warning: '#F2994A',
    error: '#EB5757',
  },
  typography: {
    fontFamily: {
      // Notion uses serif for headings
      sans: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif',
      serif: 'var(--font-libre), Georgia, Cambria, "Times New Roman", Times, serif',
      mono: '"SFMono-Regular", Menlo, Consolas, "PT Mono", monospace',
      display: 'var(--font-libre), Georgia, Cambria, "Times New Roman", Times, serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem', // 16px
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.875rem',
      '3xl': '2.5rem',
      '4xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: '-0.01em',
      normal: '0',
      wide: '0.02em',
    },
    lineHeight: {
      tight: '1.3',
      normal: '1.5',
      relaxed: '1.7', // Notion uses generous line height
    },
  },
  spacing: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '32px',
  },
  borderRadius: {
    none: '0',
    sm: '3px', // Notion's radius
    md: '5px',
    lg: '5px',
    xl: '8px',
    full: '9999px',
  },
  borders: {
    width: {
      none: '0',
      thin: '1px',
      medium: '1.5px',
      thick: '2px',
    },
  },
  shadows: {
    none: 'none',
    sm: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px',
    md: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 5px 10px',
    lg: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 9px 24px',
    xl: 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 12px 36px',
  },
  syntax: {
    background: '#2f3437', // Notion dark code bg
    text: '#e3e2e0',
    comment: '#9b9a97', // Notion muted
    string: '#6fcf97', // Notion green
    keyword: '#f2994a', // Notion orange
    function: '#eb5757', // Notion red
    property: '#2d9cdb', // Notion blue
    punctuation: '#9b9a97',
    value: '#f2c94c', // Notion yellow
  },
  meta: {
    name: 'Sunset',
    description: 'Notion-inspired editorial design',
  },
};

/**
 * Theme definitions with metadata for the UI
 */
export const themes = {
  default: {
    name: 'Default',
    description: 'Clean, minimal design',
    theme: defaultTheme,
  },
  dark: {
    name: 'Dark',
    description: 'Modern dark mode',
    theme: darkTheme,
  },
  ocean: {
    name: 'Ocean',
    description: 'GitHub-inspired flat design',
    theme: oceanTheme,
  },
  forest: {
    name: 'Forest',
    description: 'Spotify-inspired bold design',
    theme: forestTheme,
  },
  sunset: {
    name: 'Sunset',
    description: 'Notion-inspired editorial design',
    theme: sunsetTheme,
  },
} as const;

export type ThemeName = keyof typeof themes;
