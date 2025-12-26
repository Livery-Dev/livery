import { describe, it, expect } from 'vitest';
import { createSchema } from '../src/schema/index';
import { t } from '../src/schema/tokens';
import { toCssVariables, toCssString, toCssStringAll, cssVar, createCssVarHelper } from '../src/css/index';
import type { InferTheme } from '../src/types/index';

describe('toCssVariables', () => {
  const schema = createSchema({
    definition: {
      colors: {
        primary: t.color(),
        secondary: t.color(),
      },
      spacing: {
        sm: t.dimension(),
        md: t.dimension(),
      },
    },
  });

  const theme: InferTheme<typeof schema.definition> = {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
    },
    spacing: {
      sm: '4px',
      md: '8px',
    },
  };

  it('generates CSS variables from theme', () => {
    const variables = toCssVariables({ schema, theme });

    expect(variables['--colors-primary']).toBe('#3b82f6');
    expect(variables['--colors-secondary']).toBe('#64748b');
    expect(variables['--spacing-sm']).toBe('4px');
    expect(variables['--spacing-md']).toBe('8px');
  });

  it('converts camelCase to kebab-case', () => {
    const schemaWithCamelCase = createSchema({
      definition: {
        typography: {
          fontFamily: t.fontFamily(),
          fontSize: t.dimension(),
          lineHeight: t.number(),
        },
      },
    });

    const themeWithCamelCase = {
      typography: {
        fontFamily: 'Inter',
        fontSize: '16px',
        lineHeight: 1.5,
      },
    };

    const variables = toCssVariables({ schema: schemaWithCamelCase, theme: themeWithCamelCase });

    expect(variables['--typography-font-family']).toBe('Inter');
    expect(variables['--typography-font-size']).toBe('16px');
    expect(variables['--typography-line-height']).toBe('1.5');
  });

  it('supports prefix option', () => {
    const variables = toCssVariables({ schema, theme, options: { prefix: 'theme' } });

    expect(variables['--theme-colors-primary']).toBe('#3b82f6');
    expect(variables['--theme-spacing-sm']).toBe('4px');
  });

  it('supports custom separator', () => {
    const variables = toCssVariables({ schema, theme, options: { separator: '_' } });

    expect(variables['--colors-primary']).toBe('#3b82f6');
  });

  it('supports custom transformName', () => {
    const variables = toCssVariables({
      schema,
      theme,
      options: {
        transformName: (path) => path.replace(/\./g, '__'),
      },
    });

    expect(variables['--colors__primary']).toBe('#3b82f6');
    expect(variables['--spacing__sm']).toBe('4px');
  });

  it('handles deeply nested schemas', () => {
    const deepSchema = createSchema({
      definition: {
        brand: {
          colors: {
            light: {
              primary: t.color(),
            },
          },
        },
      },
    });

    const deepTheme = {
      brand: {
        colors: {
          light: {
            primary: '#fff',
          },
        },
      },
    };

    const variables = toCssVariables({ schema: deepSchema, theme: deepTheme });
    expect(variables['--brand-colors-light-primary']).toBe('#fff');
  });

  it('handles all token types', () => {
    const allTypesSchema = createSchema({
      definition: {
        color: t.color(),
        dimension: t.dimension(),
        num: t.number(),
        str: t.string(),
        bool: t.boolean(),
        fontFamily: t.fontFamily(),
        fontWeight: t.fontWeight(),
        shadow: t.shadow(),
        url: t.url(),
      },
    });

    const allTypesTheme = {
      color: '#fff',
      dimension: '16px',
      num: 42,
      str: 'hello',
      bool: true,
      fontFamily: 'Inter',
      fontWeight: 700,
      shadow: '0 2px 4px #000',
      url: 'https://example.com',
    };

    const variables = toCssVariables({ schema: allTypesSchema, theme: allTypesTheme });

    expect(variables['--color']).toBe('#fff');
    expect(variables['--dimension']).toBe('16px');
    expect(variables['--num']).toBe('42');
    expect(variables['--str']).toBe('hello');
    expect(variables['--bool']).toBe('true');
    expect(variables['--font-family']).toBe('Inter');
    expect(variables['--font-weight']).toBe('700');
    expect(variables['--shadow']).toBe('0 2px 4px #000');
    expect(variables['--url']).toBe('https://example.com');
  });

  it('returns empty object for empty theme', () => {
    const emptySchema = createSchema({ definition: {} });
    const variables = toCssVariables({ schema: emptySchema, theme: {} as never });
    expect(variables).toEqual({});
  });
});

describe('toCssString', () => {
  const schema = createSchema({
    definition: {
      colors: {
        primary: t.color(),
      },
      spacing: {
        sm: t.dimension(),
      },
    },
  });

  const theme = {
    colors: { primary: '#3b82f6' },
    spacing: { sm: '4px' },
  };

  it('generates CSS string with :root selector', () => {
    const css = toCssString({ schema, theme });

    expect(css).toContain(':root {');
    expect(css).toContain('--colors-primary: #3b82f6;');
    expect(css).toContain('--spacing-sm: 4px;');
    expect(css).toContain('}');
  });

  it('supports custom selector', () => {
    const css = toCssString({ schema, theme, selector: '.theme-container' });

    expect(css).toContain('.theme-container {');
    expect(css).not.toContain(':root');
  });

  it('supports data attribute selector', () => {
    const css = toCssString({ schema, theme, selector: '[data-theme="dark"]' });

    expect(css).toContain('[data-theme="dark"] {');
  });

  it('applies prefix in CSS string', () => {
    const css = toCssString({ schema, theme, options: { prefix: 'app' } });

    expect(css).toContain('--app-colors-primary: #3b82f6;');
  });

  it('returns empty string for empty theme', () => {
    const emptySchema = createSchema({ definition: {} });
    const css = toCssString({ schema: emptySchema, theme: {} as never });
    expect(css).toBe('');
  });

  it('formats output with proper indentation', () => {
    const css = toCssString({ schema, theme });
    const lines = css.split('\n');

    expect(lines[0]).toBe(':root {');
    expect(lines[1]).toMatch(/^\s{2}--/); // indented with 2 spaces
    expect(lines[lines.length - 1]).toBe('}');
  });
});

describe('cssVar', () => {
  it('generates var() reference', () => {
    const ref = cssVar({ path: 'colors.primary' });
    expect(ref).toBe('var(--colors-primary)');
  });

  it('converts camelCase to kebab-case', () => {
    const ref = cssVar({ path: 'typography.fontSize' });
    expect(ref).toBe('var(--typography-font-size)');
  });

  it('supports prefix', () => {
    const ref = cssVar({ path: 'colors.primary', options: { prefix: 'theme' } });
    expect(ref).toBe('var(--theme-colors-primary)');
  });

  it('handles nested paths', () => {
    const ref = cssVar({ path: 'brand.colors.light.primary' });
    expect(ref).toBe('var(--brand-colors-light-primary)');
  });

  it('handles single segment path', () => {
    const ref = cssVar({ path: 'primary' });
    expect(ref).toBe('var(--primary)');
  });
});

describe('createCssVarHelper', () => {
  const schema = createSchema({
    definition: {
      colors: {
        primary: t.color(),
        secondary: t.color(),
      },
    },
  });

  it('creates a typed helper function', () => {
    const themeVar = createCssVarHelper({ schema });

    expect(themeVar('colors.primary')).toBe('var(--colors-primary)');
    expect(themeVar('colors.secondary')).toBe('var(--colors-secondary)');
  });

  it('applies options', () => {
    const themeVar = createCssVarHelper({ schema, options: { prefix: 'app' } });

    expect(themeVar('colors.primary')).toBe('var(--app-colors-primary)');
  });

  it('can be used in template literals', () => {
    const themeVar = createCssVarHelper({ schema });

    const style = `
      color: ${themeVar('colors.primary')};
      background: ${themeVar('colors.secondary')};
    `;

    expect(style).toContain('var(--colors-primary)');
    expect(style).toContain('var(--colors-secondary)');
  });
});

describe('Edge cases', () => {
  it('handles special characters in values', () => {
    const schema = createSchema({
      definition: {
        shadow: t.shadow(),
        fontFamily: t.fontFamily(),
      },
    });

    const theme = {
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
    };

    const variables = toCssVariables({ schema, theme });

    // Values are escaped to prevent CSS injection attacks
    expect(variables['--shadow']).toBe(theme.shadow);
    expect(variables['--font-family']).toBe('\\"Helvetica Neue\\", Arial, sans-serif');
  });

  it('escapes potentially dangerous values to prevent CSS injection', () => {
    const schema = createSchema({
      definition: {
        malicious: t.string(),
      },
    });

    const theme = {
      malicious: 'red; } body { background: url(evil); } .x {',
    };

    const variables = toCssVariables({ schema, theme });

    // Semicolons and braces should be escaped
    expect(variables['--malicious']).toBe('red\\; \\} body \\{ background: url(evil)\\; \\} .x \\{');
  });

  it('handles numeric values', () => {
    const schema = createSchema({
      definition: {
        opacity: t.number(),
        zIndex: t.number(),
      },
    });

    const theme = {
      opacity: 0.5,
      zIndex: 100,
    };

    const variables = toCssVariables({ schema, theme });

    expect(variables['--opacity']).toBe('0.5');
    expect(variables['--z-index']).toBe('100');
  });

  it('handles boolean values', () => {
    const schema = createSchema({
      definition: {
        enabled: t.boolean(),
      },
    });

    const theme = {
      enabled: true,
    };

    const variables = toCssVariables({ schema, theme });
    expect(variables['--enabled']).toBe('true');
  });
});

describe('toCssStringAll', () => {
  const schema = createSchema({
    definition: {
      colors: {
        primary: t.color(),
        background: t.color(),
      },
    },
  });

  it('generates CSS for multiple themes', () => {
    const themes = {
      light: { colors: { primary: '#3b82f6', background: '#ffffff' } },
      dark: { colors: { primary: '#60a5fa', background: '#1e1e1e' } },
    };

    const css = toCssStringAll({ schema, themes });

    expect(css).toContain('[data-theme="light"]');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('--colors-primary: #3b82f6');
    expect(css).toContain('--colors-background: #1e1e1e');
  });

  it('applies default theme to :root selector', () => {
    const themes = {
      light: { colors: { primary: '#3b82f6', background: '#ffffff' } },
      dark: { colors: { primary: '#60a5fa', background: '#1e1e1e' } },
    };

    const css = toCssStringAll({ schema, themes, defaultTheme: 'light' });

    expect(css).toContain(':root, [data-theme="light"]');
    expect(css).not.toContain(':root, [data-theme="dark"]');
  });

  it('uses custom attribute for selector', () => {
    const themes = {
      light: { colors: { primary: '#3b82f6', background: '#ffffff' } },
    };

    const css = toCssStringAll({ schema, themes, attribute: 'data-color-scheme' });

    expect(css).toContain('[data-color-scheme="light"]');
    expect(css).not.toContain('[data-theme="light"]');
  });

  it('applies prefix option', () => {
    const themes = {
      light: { colors: { primary: '#3b82f6', background: '#ffffff' } },
    };

    const css = toCssStringAll({ schema, themes, options: { prefix: 'app' } });

    expect(css).toContain('--app-colors-primary');
  });

  it('skips themes with empty variables', () => {
    const emptySchema = createSchema({ definition: {} });
    const themes = {
      light: {},
      dark: {},
    };

    const css = toCssStringAll({ schema: emptySchema, themes });

    expect(css).toBe('');
  });
});
