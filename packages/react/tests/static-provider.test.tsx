import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { createStaticThemeProvider } from '../src/static/create-static-provider';
import { getThemeInitScript } from '../src/static/get-theme-init-script';

describe('createStaticThemeProvider', () => {
  it('creates provider and hook', () => {
    const { StaticThemeProvider, useTheme, ThemeContext } = createStaticThemeProvider({
      themes: ['light', 'dark'] as const,
      defaultTheme: 'light',
    });

    expect(StaticThemeProvider).toBeDefined();
    expect(useTheme).toBeDefined();
    expect(ThemeContext).toBeDefined();
  });

  it('throws if themes array is empty', () => {
    expect(() =>
      createStaticThemeProvider({
        themes: [] as unknown as readonly ['light'],
        defaultTheme: 'light' as never,
      })
    ).toThrow('themes array is required and must not be empty');
  });

  it('throws if defaultTheme is not in themes', () => {
    expect(() =>
      createStaticThemeProvider({
        themes: ['light', 'dark'] as const,
        defaultTheme: 'other' as 'light',
      })
    ).toThrow('defaultTheme "other" is not in themes');
  });

  describe('StaticThemeProvider', () => {
    const themes = ['light', 'dark'] as const;

    beforeEach(() => {
      // Reset document for each test
      document.documentElement.removeAttribute('data-theme');
    });

    it('provides theme context to children', () => {
      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={() => setTheme('dark')}>Switch</button>
          </div>
        );
      }

      render(
        <StaticThemeProvider>
          <TestComponent />
        </StaticThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('reads theme from DOM attribute on mount', () => {
      document.documentElement.setAttribute('data-theme', 'dark');

      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { theme } = useTheme();
        return <span data-testid="theme">{theme}</span>;
      }

      render(
        <StaticThemeProvider>
          <TestComponent />
        </StaticThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('switches theme and updates DOM', () => {
      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button data-testid="switch" onClick={() => setTheme('dark')}>
              Switch
            </button>
          </div>
        );
      }

      render(
        <StaticThemeProvider>
          <TestComponent />
        </StaticThemeProvider>
      );

      fireEvent.click(screen.getByTestId('switch'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('persists theme to localStorage when persist is localStorage', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { setTheme } = useTheme();
        return (
          <button data-testid="switch" onClick={() => setTheme('dark')}>
            Switch
          </button>
        );
      }

      render(
        <StaticThemeProvider persist="localStorage">
          <TestComponent />
        </StaticThemeProvider>
      );

      fireEvent.click(screen.getByTestId('switch'));

      expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');

      setItemSpy.mockRestore();
    });

    it('uses custom storage key', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { setTheme } = useTheme();
        return (
          <button data-testid="switch" onClick={() => setTheme('dark')}>
            Switch
          </button>
        );
      }

      render(
        <StaticThemeProvider persist="localStorage" storageKey="my-app-theme">
          <TestComponent />
        </StaticThemeProvider>
      );

      fireEvent.click(screen.getByTestId('switch'));

      expect(setItemSpy).toHaveBeenCalledWith('my-app-theme', 'dark');

      setItemSpy.mockRestore();
    });

    it('persists theme to cookie when persist is cookie', () => {
      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { setTheme } = useTheme();
        return (
          <button data-testid="switch" onClick={() => setTheme('dark')}>
            Switch
          </button>
        );
      }

      render(
        <StaticThemeProvider persist="cookie" storageKey="my-theme">
          <TestComponent />
        </StaticThemeProvider>
      );

      fireEvent.click(screen.getByTestId('switch'));

      expect(document.cookie).toContain('my-theme=dark');
    });

    it('does not persist when persist is none', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { setTheme } = useTheme();
        return (
          <button data-testid="switch" onClick={() => setTheme('dark')}>
            Switch
          </button>
        );
      }

      render(
        <StaticThemeProvider persist="none">
          <TestComponent />
        </StaticThemeProvider>
      );

      fireEvent.click(screen.getByTestId('switch'));

      expect(setItemSpy).not.toHaveBeenCalled();
      setItemSpy.mockRestore();
    });

    it('warns when setting invalid theme', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button data-testid="switch" onClick={() => setTheme('invalid')}>
              Switch
            </button>
          </div>
        );
      }

      render(
        <StaticThemeProvider>
          <TestComponent />
        </StaticThemeProvider>
      );

      fireEvent.click(screen.getByTestId('switch'));

      // Theme should not change
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid theme "invalid"')
      );

      consoleSpy.mockRestore();
    });

    it('uses initialTheme prop when provided', () => {
      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { theme } = useTheme();
        return <span data-testid="theme">{theme}</span>;
      }

      render(
        <StaticThemeProvider initialTheme="dark">
          <TestComponent />
        </StaticThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('handles localStorage errors gracefully', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      const { StaticThemeProvider, useTheme } = createStaticThemeProvider({
        themes,
        defaultTheme: 'light',
      });

      function TestComponent() {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button data-testid="switch" onClick={() => setTheme('dark')}>
              Switch
            </button>
          </div>
        );
      }

      // Should not throw even if localStorage fails
      render(
        <StaticThemeProvider persist="localStorage">
          <TestComponent />
        </StaticThemeProvider>
      );

      fireEvent.click(screen.getByTestId('switch'));

      // Theme should still change in React state
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      setItemSpy.mockRestore();
    });
  });

  describe('useTheme', () => {
    it('throws when used outside provider', () => {
      const { useTheme } = createStaticThemeProvider({
        themes: ['light', 'dark'] as const,
        defaultTheme: 'light',
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a StaticThemeProvider');

      consoleSpy.mockRestore();
    });
  });
});

describe('getThemeInitScript', () => {
  it('generates initialization script', () => {
    const script = getThemeInitScript({
      themes: ['light', 'dark'],
      defaultTheme: 'light',
    });

    expect(script).toContain('light');
    expect(script).toContain('dark');
    expect(typeof script).toBe('string');
  });

  it('uses custom storage key', () => {
    const script = getThemeInitScript({
      themes: ['light', 'dark'],
      defaultTheme: 'light',
      storageKey: 'my-theme-key',
    });

    expect(script).toContain('my-theme-key');
  });

  it('uses custom attribute', () => {
    const script = getThemeInitScript({
      themes: ['light', 'dark'],
      defaultTheme: 'light',
      attribute: 'data-color-scheme',
    });

    expect(script).toContain('data-color-scheme');
  });

  it('throws when defaultTheme is not in themes', () => {
    expect(() =>
      getThemeInitScript({
        themes: ['light', 'dark'],
        defaultTheme: 'invalid' as 'light',
      })
    ).toThrow('[Livery] defaultTheme "invalid" is not in themes: light, dark');
  });
});
