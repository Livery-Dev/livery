import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, render, screen, waitFor, act } from '@testing-library/react';
import { createSchema, t, type InferTheme, type ThemeResolver } from '@livery/core';
import { createDynamicThemeProvider } from '../src/provider/create-provider.js';
import type { ThemeState } from '../src/types/index.js';

// Test schema
const schema = createSchema({
  definition: {
    brand: {
      primary: t.color().default('#3b82f6'),
      secondary: t.color().default('#64748b'),
    },
    spacing: {
      md: t.dimension().default('16px'),
    },
  },
});

type TestTheme = InferTheme<typeof schema.definition>;

// Mock resolver factory
function createMockResolver(
  themeOverrides: Partial<TestTheme> = {}
): ThemeResolver<typeof schema.definition> {
  const theme: TestTheme = {
    brand: {
      primary: themeOverrides.brand?.primary ?? '#ff0000',
      secondary: themeOverrides.brand?.secondary ?? '#00ff00',
    },
    spacing: {
      md: themeOverrides.spacing?.md ?? '20px',
    },
  };

  return {
    resolve: vi.fn().mockResolvedValue(theme),
    invalidate: vi.fn(),
    clearCache: vi.fn(),
    get: vi.fn(),
  };
}

describe('createDynamicThemeProvider', () => {
  it('creates a provider and hooks', () => {
    const { DynamicThemeProvider, useTheme, useThemeValue, useThemeReady, ThemeContext } =
      createDynamicThemeProvider({ schema });

    expect(DynamicThemeProvider).toBeDefined();
    expect(useTheme).toBeDefined();
    expect(useThemeValue).toBeDefined();
    expect(useThemeReady).toBeDefined();
    expect(ThemeContext).toBeDefined();
  });

  it('provides theme context to children', async () => {
    const { DynamicThemeProvider, useTheme } = createDynamicThemeProvider({ schema });
    const resolver = createMockResolver();

    function TestComponent() {
      const { theme, isLoading, themeId } = useTheme();
      if (isLoading) return <div>Loading...</div>;
      return (
        <div>
          <span data-testid="theme">{themeId}</span>
          <span data-testid="primary">{theme?.brand.primary}</span>
        </div>
      );
    }

    render(
      <DynamicThemeProvider initialThemeId="acme" resolver={resolver}>
        <TestComponent />
      </DynamicThemeProvider>
    );

    // Initially loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for theme to load
    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent('acme');
    });

    expect(screen.getByTestId('primary')).toHaveTextContent('#ff0000');
    expect(resolver.resolve).toHaveBeenCalledWith({ themeId: 'acme' });
  });

  it('useThemeValue returns individual values', async () => {
    const { DynamicThemeProvider, useThemeValue } = createDynamicThemeProvider({ schema });
    const resolver = createMockResolver({ brand: { primary: '#123456', secondary: '#654321' } });

    function TestComponent() {
      const primary = useThemeValue('brand.primary');
      const spacing = useThemeValue('spacing.md');
      return (
        <div>
          <span data-testid="primary">{primary}</span>
          <span data-testid="spacing">{spacing}</span>
        </div>
      );
    }

    render(
      <DynamicThemeProvider initialThemeId="test" resolver={resolver}>
        <TestComponent />
      </DynamicThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('primary')).toHaveTextContent('#123456');
    });

    expect(screen.getByTestId('spacing')).toHaveTextContent('20px');
  });

  it('useThemeReady returns correct state', async () => {
    const { DynamicThemeProvider, useThemeReady } = createDynamicThemeProvider({ schema });
    const resolver = createMockResolver();

    const readyStates: boolean[] = [];

    function TestComponent() {
      const ready = useThemeReady();
      readyStates.push(ready);
      return <div data-testid="ready">{ready ? 'yes' : 'no'}</div>;
    }

    render(
      <DynamicThemeProvider initialThemeId="test" resolver={resolver}>
        <TestComponent />
      </DynamicThemeProvider>
    );

    // Initially not ready
    expect(screen.getByTestId('ready')).toHaveTextContent('no');

    // Wait for theme to load
    await waitFor(() => {
      expect(screen.getByTestId('ready')).toHaveTextContent('yes');
    });
  });

  it('throws when useTheme is used outside provider', () => {
    const { useTheme } = createDynamicThemeProvider({ schema });

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a DynamicThemeProvider');

    consoleSpy.mockRestore();
  });

  it('throws when useThemeValue is used outside provider', () => {
    const { useThemeValue } = createDynamicThemeProvider({ schema });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useThemeValue('brand.primary'));
    }).toThrow('useThemeValue must be used within a DynamicThemeProvider');

    consoleSpy.mockRestore();
  });

  it('throws when useThemeReady is used outside provider', () => {
    const { useThemeReady } = createDynamicThemeProvider({ schema });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useThemeReady());
    }).toThrow('useThemeReady must be used within a DynamicThemeProvider');

    consoleSpy.mockRestore();
  });

  it('handles initialTheme for SSR', async () => {
    const { DynamicThemeProvider, useTheme } = createDynamicThemeProvider({ schema });
    const resolver = createMockResolver();

    const initialTheme: TestTheme = {
      brand: { primary: '#ssr-color', secondary: '#ssr-secondary' },
      spacing: { md: '24px' },
    };

    function TestComponent() {
      const { theme, isLoading } = useTheme();
      return (
        <div>
          <span data-testid="loading">{isLoading ? 'yes' : 'no'}</span>
          <span data-testid="primary">{theme?.brand.primary}</span>
        </div>
      );
    }

    render(
      <DynamicThemeProvider initialThemeId="ssr-test" resolver={resolver} initialTheme={initialTheme}>
        <TestComponent />
      </DynamicThemeProvider>
    );

    // Should not be loading with initialTheme
    expect(screen.getByTestId('loading')).toHaveTextContent('no');
    expect(screen.getByTestId('primary')).toHaveTextContent('#ssr-color');
  });

  it('calls onError when resolution fails', async () => {
    const { DynamicThemeProvider, useTheme } = createDynamicThemeProvider({ schema });
    const onError = vi.fn();
    const error = new Error('Resolution failed');

    const resolver: ThemeResolver<typeof schema.definition> = {
      resolve: vi.fn().mockRejectedValue(error),
      invalidate: vi.fn(),
      clearCache: vi.fn(),
      get: vi.fn(),
    };

    function TestComponent() {
      const { error, isLoading } = useTheme();
      return (
        <div>
          <span data-testid="loading">{isLoading ? 'yes' : 'no'}</span>
          <span data-testid="error">{error?.message ?? 'none'}</span>
        </div>
      );
    }

    render(
      <DynamicThemeProvider initialThemeId="error-test" resolver={resolver} onError={onError}>
        <TestComponent />
      </DynamicThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Resolution failed');
    });

    expect(onError).toHaveBeenCalledWith(error);
  });

  it('shows fallback while loading', async () => {
    const { DynamicThemeProvider, useTheme } = createDynamicThemeProvider({ schema });

    // Create a resolver that resolves slowly
    let resolveTheme: (theme: TestTheme) => void;
    const resolver: ThemeResolver<typeof schema.definition> = {
      resolve: vi.fn().mockImplementation(
        () =>
          new Promise<TestTheme>((resolve) => {
            resolveTheme = resolve;
          })
      ),
      invalidate: vi.fn(),
      clearCache: vi.fn(),
      get: vi.fn(),
    };

    function TestComponent() {
      const { theme } = useTheme();
      return <div data-testid="content">Theme: {theme?.brand.primary}</div>;
    }

    render(
      <DynamicThemeProvider
        initialThemeId="fallback-test"
        resolver={resolver}
        fallback={<div data-testid="fallback">Loading...</div>}
      >
        <TestComponent />
      </DynamicThemeProvider>
    );

    // Should show fallback
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();

    // Resolve theme
    await act(async () => {
      resolveTheme!({
        brand: { primary: '#resolved', secondary: '#resolved2' },
        spacing: { md: '16px' },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('content')).toHaveTextContent('Theme: #resolved');
    });

    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  it('exposes state machine with discriminated union', async () => {
    const { DynamicThemeProvider, useTheme } = createDynamicThemeProvider({ schema });

    // Track all states observed during the test
    const observedStates: ThemeState<typeof schema.definition>[] = [];

    // Slow resolver to observe loading state
    let resolveTheme: (theme: TestTheme) => void;
    const resolver: ThemeResolver<typeof schema.definition> = {
      resolve: vi.fn().mockImplementation(
        () =>
          new Promise<TestTheme>((resolve) => {
            resolveTheme = resolve;
          })
      ),
      invalidate: vi.fn(),
      clearCache: vi.fn(),
      get: vi.fn(),
    };

    function TestComponent() {
      const ctx = useTheme();
      const { state, theme, error, isIdle, isLoading, isReady, isError } = ctx;

      // Record the state
      observedStates.push(state);

      // Verify exactly one status boolean is true
      const statusBooleans = [isIdle, isLoading, isReady, isError];
      expect(statusBooleans.filter(Boolean)).toHaveLength(1);

      // Verify convenience accessors match state
      expect(isIdle).toBe(state.status === 'idle');
      expect(isLoading).toBe(state.status === 'loading');
      expect(isReady).toBe(state.status === 'ready');
      expect(isError).toBe(state.status === 'error');

      // Verify theme and error are derived correctly
      if (state.status === 'ready') {
        expect(theme).toBe(state.theme);
        expect(error).toBe(null);
      } else if (state.status === 'error') {
        expect(theme).toBe(null);
        expect(error).toBe(state.error);
      } else {
        expect(theme).toBe(null);
        expect(error).toBe(null);
      }

      return <div data-testid="status">{state.status}</div>;
    }

    render(
      <DynamicThemeProvider initialThemeId="state-test" resolver={resolver}>
        <TestComponent />
      </DynamicThemeProvider>
    );

    // Should transition through states
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('loading');
    });

    // Resolve the theme
    await act(async () => {
      resolveTheme!({
        brand: { primary: '#test', secondary: '#test2' },
        spacing: { md: '16px' },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('ready');
    });

    // Verify we saw valid state transitions
    const statuses = observedStates.map((s) => s.status);

    // Should have seen: idle -> loading -> ready (or just loading -> ready)
    expect(statuses).toContain('loading');
    expect(statuses[statuses.length - 1]).toBe('ready');

    // Verify no invalid state combinations were ever possible
    // (This is enforced by TypeScript, but we verify runtime behavior)
    for (const state of observedStates) {
      if (state.status === 'ready') {
        expect(state).toHaveProperty('theme');
        expect(state).not.toHaveProperty('error');
      } else if (state.status === 'error') {
        expect(state).toHaveProperty('error');
        expect(state).not.toHaveProperty('theme');
      } else if (state.status === 'loading' || state.status === 'idle') {
        expect(state).not.toHaveProperty('theme');
        expect(state).not.toHaveProperty('error');
      }
    }
  });

  it('state transitions to error correctly', async () => {
    const { DynamicThemeProvider, useTheme } = createDynamicThemeProvider({ schema });
    const testError = new Error('Test error');

    const resolver: ThemeResolver<typeof schema.definition> = {
      resolve: vi.fn().mockRejectedValue(testError),
      invalidate: vi.fn(),
      clearCache: vi.fn(),
      get: vi.fn(),
    };

    function TestComponent() {
      const { state } = useTheme();

      if (state.status === 'error') {
        return <div data-testid="error-msg">{state.error.message}</div>;
      }

      return <div data-testid="status">{state.status}</div>;
    }

    render(
      <DynamicThemeProvider initialThemeId="error-state-test" resolver={resolver}>
        <TestComponent />
      </DynamicThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-msg')).toHaveTextContent('Test error');
    });
  });
});
