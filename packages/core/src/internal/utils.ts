/**
 * Internal utilities
 *
 * These are not part of the public API and may change without notice.
 */

/**
 * Deep clones a plain object
 *
 * @typeParam T - The type of the object to clone
 * @param obj - The object to clone
 * @returns A deep copy of the object
 *
 * @remarks
 * Handles plain objects and arrays recursively. Does not clone special objects like Date, RegExp, etc.
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone) as T;
  }

  const cloned: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
  }
  return cloned as T;
}

/**
 * Deep merges two objects, with source taking precedence
 *
 * @typeParam T - The type of the objects to merge
 * @param target - The base object
 * @param source - The object to merge in (takes precedence)
 * @returns A new merged object
 *
 * @remarks
 * Creates a new object; does not mutate inputs. Recursively merges nested objects.
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = deepClone(target);

  for (const key of Object.keys(source)) {
    const sourceValue = source[key as keyof typeof source];
    const targetValue = result[key as keyof T];

    if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else if (sourceValue !== undefined) {
      (result as Record<string, unknown>)[key] = deepClone(sourceValue);
    }
  }

  return result;
}

/**
 * Gets a value at a dot-notation path
 *
 * @typeParam T - The expected type of the value at the path
 * @param obj - The object to navigate
 * @param path - Dot-notation path (e.g., "colors.primary")
 * @returns The value at the path, or undefined if not found
 *
 * @example
 * ```ts
 * const obj = { colors: { primary: '#3b82f6' } };
 * getAtPath(obj, 'colors.primary'); // '#3b82f6'
 * ```
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

/**
 * Sets a value at a dot-notation path (immutably)
 *
 * @typeParam T - The type of the object
 * @param obj - The object to update
 * @param path - Dot-notation path (e.g., "colors.primary")
 * @param value - The value to set
 * @returns A new object with the value set at the path
 *
 * @remarks
 * Creates a new object; does not mutate the input. Creates intermediate objects as needed.
 *
 * @example
 * ```ts
 * const obj = { colors: {} };
 * setAtPath(obj, 'colors.primary', '#3b82f6');
 * // { colors: { primary: '#3b82f6' } }
 * ```
 */
export function setAtPath<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown
): T {
  const parts = path.split('.');
  const result = deepClone(obj);

  let current: Record<string, unknown> = result;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]!;
    if (typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  const lastPart = parts[parts.length - 1];
  if (lastPart !== undefined) {
    current[lastPart] = value;
  }

  return result;
}

/**
 * Converts a path to kebab-case CSS variable format
 *
 * @param path - Dot-notation path (e.g., "colors.primaryColor")
 * @returns Kebab-case string (e.g., "colors-primary-color")
 *
 * @remarks
 * Converts camelCase to kebab-case and joins path segments with hyphens.
 * Optimized to use single regex pass per segment.
 *
 * @example
 * ```ts
 * pathToKebabCase('colors.primaryColor'); // 'colors-primary-color'
 * pathToKebabCase('fontSize.md'); // 'font-size-md'
 * ```
 */
export function pathToKebabCase(path: string): string {
  return path
    .split('.')
    .map((part) =>
      part
        .replace(/([a-z])([A-Z])|([A-Z])([A-Z][a-z])/g, (_, p1, p2, p3, p4) =>
          p1 ? `${p1}-${p2}` : `${p3}-${p4}`
        )
        .toLowerCase()
    )
    .join('-');
}

/**
 * Checks if a value is a plain object
 *
 * @param value - The value to check
 * @returns True if the value is a plain object (not an array, Date, etc.)
 *
 * @remarks
 * Returns true only for objects created by Object constructor or with null prototype
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Creates a simple LRU (Least Recently Used) cache
 *
 * @typeParam K - The type of the cache keys
 * @typeParam V - The type of the cache values
 * @param maxSize - Maximum number of entries to keep in cache
 * @returns An LRU cache instance with get, set, delete, clear, has, and size methods
 *
 * @remarks
 * When cache is full, the least recently used entry is evicted on new insertions.
 * Accessing an entry moves it to the end (marks as recently used).
 *
 * @example
 * ```ts
 * const cache = createLRUCache<string, number>(2);
 * cache.set('a', 1);
 * cache.set('b', 2);
 * cache.set('c', 3); // 'a' is evicted
 * cache.get('a'); // undefined
 * ```
 */
export function createLRUCache<K, V>(
  maxSize: number
): {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  delete(key: K): boolean;
  clear(): void;
  has(key: K): boolean;
  size(): number;
} {
  const cache = new Map<K, V>();

  return {
    get(key: K): V | undefined {
      const value = cache.get(key);
      if (value !== undefined) {
        // Move to end (most recently used)
        cache.delete(key);
        cache.set(key, value);
      }
      return value;
    },

    set(key: K, value: V): void {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= maxSize) {
        // Remove oldest (first) entry
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) {
          cache.delete(firstKey);
        }
      }
      cache.set(key, value);
    },

    delete(key: K): boolean {
      return cache.delete(key);
    },

    clear(): void {
      cache.clear();
    },

    has(key: K): boolean {
      return cache.has(key);
    },

    size(): number {
      return cache.size;
    },
  };
}
