import { describe, it, expect, vi } from 'vitest';
import { createThemeStore } from '../src/store/theme-store';
import type { SchemaDefinition } from '@livery/core';

// Test schema type
type TestSchema = {
  colors: { primary: { $type: 'color' } };
};

type TestTheme = { colors: { primary: string } };

describe('createThemeStore', () => {
  describe('initialization', () => {
    it('creates store with idle state by default', () => {
      const store = createThemeStore<TestSchema>();
      const snapshot = store.getSnapshot();

      expect(snapshot.state.status).toBe('idle');
      expect(snapshot.themeId).toBe(null);
      expect(snapshot.cssVariables).toEqual({});
    });

    it('creates store with initial theme in ready state', () => {
      const initialTheme: TestTheme = { colors: { primary: '#ff0000' } };
      const store = createThemeStore<TestSchema>({
        initialTheme,
        initialThemeId: 'test',
        initialCssVariables: { '--colors-primary': '#ff0000' },
      });

      const snapshot = store.getSnapshot();

      expect(snapshot.state.status).toBe('ready');
      if (snapshot.state.status === 'ready') {
        expect(snapshot.state.theme).toBe(initialTheme);
      }
      expect(snapshot.themeId).toBe('test');
      expect(snapshot.cssVariables).toEqual({ '--colors-primary': '#ff0000' });
    });
  });

  describe('getServerSnapshot', () => {
    it('returns same state as getSnapshot for SSR', () => {
      const store = createThemeStore<TestSchema>();

      expect(store.getServerSnapshot()).toBe(store.getSnapshot());
    });
  });

  describe('subscribe', () => {
    it('adds subscriber and calls it on state changes', () => {
      const store = createThemeStore<TestSchema>();
      const subscriber = vi.fn();

      store.subscribe(subscriber);
      store.setLoading();

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('returns unsubscribe function', () => {
      const store = createThemeStore<TestSchema>();
      const subscriber = vi.fn();

      const unsubscribe = store.subscribe(subscriber);
      unsubscribe();
      store.setLoading();

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('notifies all subscribers', () => {
      const store = createThemeStore<TestSchema>();
      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();

      store.subscribe(subscriber1);
      store.subscribe(subscriber2);
      store.setLoading();

      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);
    });
  });

  describe('setReady', () => {
    it('updates state to ready with theme and CSS variables', () => {
      const store = createThemeStore<TestSchema>();
      const theme: TestTheme = { colors: { primary: '#00ff00' } };
      const cssVariables = { '--colors-primary': '#00ff00' };

      store.setReady(theme, cssVariables);
      const snapshot = store.getSnapshot();

      expect(snapshot.state.status).toBe('ready');
      if (snapshot.state.status === 'ready') {
        expect(snapshot.state.theme).toBe(theme);
      }
      expect(snapshot.cssVariables).toBe(cssVariables);
    });

    it('does not notify if theme and variables unchanged', () => {
      const theme: TestTheme = { colors: { primary: '#00ff00' } };
      const cssVariables = { '--colors-primary': '#00ff00' };
      const store = createThemeStore<TestSchema>();

      store.setReady(theme, cssVariables);

      const subscriber = vi.fn();
      store.subscribe(subscriber);

      // Call again with same values
      store.setReady(theme, cssVariables);

      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('setLoading', () => {
    it('updates state to loading', () => {
      const store = createThemeStore<TestSchema>();

      store.setLoading();
      const snapshot = store.getSnapshot();

      expect(snapshot.state.status).toBe('loading');
    });

    it('does not notify if already loading', () => {
      const store = createThemeStore<TestSchema>();
      store.setLoading();

      const subscriber = vi.fn();
      store.subscribe(subscriber);

      store.setLoading();

      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('setError', () => {
    it('updates state to error with error object', () => {
      const store = createThemeStore<TestSchema>();
      const error = new Error('Test error');

      store.setError(error);
      const snapshot = store.getSnapshot();

      expect(snapshot.state.status).toBe('error');
      if (snapshot.state.status === 'error') {
        expect(snapshot.state.error).toBe(error);
      }
    });

    it('does not notify if same error', () => {
      const store = createThemeStore<TestSchema>();
      const error = new Error('Test error');

      store.setError(error);

      const subscriber = vi.fn();
      store.subscribe(subscriber);

      store.setError(error);

      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('setThemeId', () => {
    it('updates theme ID', () => {
      const store = createThemeStore<TestSchema>();

      store.setThemeId('new-theme');
      const snapshot = store.getSnapshot();

      expect(snapshot.themeId).toBe('new-theme');
    });

    it('does not notify if theme ID unchanged', () => {
      const store = createThemeStore<TestSchema>({ initialThemeId: 'test' });

      const subscriber = vi.fn();
      store.subscribe(subscriber);

      store.setThemeId('test');

      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('resets to initial state', () => {
      const initialTheme: TestTheme = { colors: { primary: '#ff0000' } };
      const store = createThemeStore<TestSchema>({
        initialTheme,
        initialThemeId: 'initial',
        initialCssVariables: { '--colors-primary': '#ff0000' },
      });

      // Modify state
      store.setThemeId('modified');
      store.setLoading();

      // Reset
      store.reset();
      const snapshot = store.getSnapshot();

      expect(snapshot.themeId).toBe('initial');
      expect(snapshot.state.status).toBe('ready');
      expect(snapshot.cssVariables).toEqual({ '--colors-primary': '#ff0000' });
    });

    it('notifies subscribers on reset', () => {
      const store = createThemeStore<TestSchema>();

      const subscriber = vi.fn();
      store.subscribe(subscriber);

      store.reset();

      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });
});
