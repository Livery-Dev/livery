/**
 * External store for theme state management.
 * Compatible with React 18's useSyncExternalStore for concurrent-safe updates.
 */

import type { SchemaDefinition, InferTheme } from '@livery/core';
import type { ThemeStore, ThemeStoreState, ThemeState } from '../types/index.js';

/**
 * Options for creating a theme store
 */
export interface CreateThemeStoreOptions<T extends SchemaDefinition> {
  /** Initial theme (for SSR) */
  readonly initialTheme?: InferTheme<T>;
  /** Initial theme ID */
  readonly initialThemeId?: string;
  /** Initial CSS variables */
  readonly initialCssVariables?: Record<string, string>;
}

/**
 * Creates a theme store for use with useSyncExternalStore.
 * The store manages theme state and notifies subscribers on changes.
 */
export function createThemeStore<T extends SchemaDefinition>(
  options: CreateThemeStoreOptions<T> = {}
): ThemeStore<T> {
  const { initialTheme, initialThemeId, initialCssVariables } = options;

  // Initial state using state machine
  const initialInnerState: ThemeState<T> = initialTheme
    ? { status: 'ready', theme: initialTheme }
    : { status: 'idle' };

  const initialState: ThemeStoreState<T> = {
    state: initialInnerState,
    themeId: initialThemeId ?? null,
    cssVariables: initialCssVariables ?? {},
  };

  // Current state (mutable for internal updates)
  let state: ThemeStoreState<T> = initialState;

  // Subscribers set
  const subscribers = new Set<() => void>();

  // Notify all subscribers
  const notify = (): void => {
    for (const callback of subscribers) {
      callback();
    }
  };

  return {
    getSnapshot(): ThemeStoreState<T> {
      return state;
    },

    getServerSnapshot(): ThemeStoreState<T> {
      // For SSR, return the same state
      return state;
    },

    subscribe(callback: () => void): () => void {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },

    setReady(theme: InferTheme<T>, cssVariables: Record<string, string>): void {
      // Only update if actually changed
      if (
        state.state.status === 'ready' &&
        state.state.theme === theme &&
        state.cssVariables === cssVariables
      ) {
        return;
      }

      state = {
        ...state,
        state: { status: 'ready', theme },
        cssVariables,
      };
      notify();
    },

    setLoading(): void {
      if (state.state.status === 'loading') {
        return;
      }

      state = {
        ...state,
        state: { status: 'loading' },
      };
      notify();
    },

    setError(error: Error): void {
      if (state.state.status === 'error' && state.state.error === error) {
        return;
      }

      state = {
        ...state,
        state: { status: 'error', error },
      };
      notify();
    },

    setThemeId(themeId: string): void {
      if (state.themeId === themeId) {
        return;
      }

      state = {
        ...state,
        themeId,
      };
      notify();
    },

    reset(): void {
      state = initialState;
      notify();
    },
  };
}
