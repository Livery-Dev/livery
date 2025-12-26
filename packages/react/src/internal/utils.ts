/**
 * Internal utilities for @livery/react
 */

/**
 * Gets a value at a dot-notation path
 */
export function getAtPath<T>(obj: unknown, path: string): T | undefined {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current as T;
}
