import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createSchema, t, type ThemeResolver, type InferTheme } from '@livery/core';
import { getLiveryServerProps } from '../src/server/index';
import { LiveryScript } from '../src/server/livery-script';

// Test schema
const schema = createSchema({
  definition: {
    colors: {
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
    },
    spacing: {
      md: t.dimension().default('16px'),
    },
  },
});

type TestTheme = InferTheme<typeof schema.definition>;

describe('getLiveryServerProps', () => {
  const mockTheme: TestTheme = {
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
    },
    spacing: {
      md: '20px',
    },
  };

  const createMockResolver = (): ThemeResolver<typeof schema.definition> => ({
    resolve: vi.fn().mockResolvedValue(mockTheme),
    invalidate: vi.fn(),
    clearCache: vi.fn(),
    get: vi.fn(),
  });

  it('resolves theme and generates CSS', async () => {
    const resolver = createMockResolver();

    const result = await getLiveryServerProps({
      schema,
      themeId: 'test-theme',
      resolver,
    });

    expect(result.themeId).toBe('test-theme');
    expect(result.initialTheme).toEqual(mockTheme);
    expect(result.css).toContain('--colors-primary');
    expect(result.css).toContain('#ff0000');
    expect(resolver.resolve).toHaveBeenCalledWith({ themeId: 'test-theme' });
  });

  it('applies CSS options when provided', async () => {
    const resolver = createMockResolver();

    const result = await getLiveryServerProps({
      schema,
      themeId: 'test-theme',
      resolver,
      cssOptions: { prefix: 'app' },
    });

    expect(result.css).toContain('--app-colors-primary');
  });

  it('generates valid CSS string', async () => {
    const resolver = createMockResolver();

    const result = await getLiveryServerProps({
      schema,
      themeId: 'test-theme',
      resolver,
    });

    // CSS should be wrapped in :root selector
    expect(result.css).toContain(':root {');
    expect(result.css).toContain('}');
  });
});

describe('LiveryScript', () => {
  it('renders style element with CSS', () => {
    const css = ':root { --colors-primary: #ff0000; }';

    const { container } = render(<LiveryScript css={css} />);
    const styleEl = container.querySelector('style');

    expect(styleEl).toBeTruthy();
    expect(styleEl?.innerHTML).toBe(css);
  });

  it('uses default id', () => {
    const { container } = render(<LiveryScript css=":root {}" />);
    const styleEl = container.querySelector('style');

    expect(styleEl?.id).toBe('livery-critical');
  });

  it('uses custom id', () => {
    const { container } = render(<LiveryScript css=":root {}" id="my-theme-css" />);
    const styleEl = container.querySelector('style');

    expect(styleEl?.id).toBe('my-theme-css');
  });
});
