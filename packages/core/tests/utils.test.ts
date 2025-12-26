import { describe, it, expect } from 'vitest';
import {
  deepClone,
  deepMerge,
  getAtPath,
  setAtPath,
  pathToKebabCase,
  isPlainObject,
  createLRUCache,
} from '../src/internal/utils';

describe('deepClone', () => {
  it('clones primitive values', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
  });

  it('clones arrays', () => {
    const arr = [1, 2, [3, 4]];
    const cloned = deepClone(arr);

    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[2]).not.toBe(arr[2]);
  });

  it('clones objects', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  it('clones deeply nested objects', () => {
    const obj = {
      level1: {
        level2: {
          level3: {
            value: 'deep',
          },
        },
      },
    };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned.level1.level2.level3).not.toBe(obj.level1.level2.level3);
  });
});

describe('deepMerge', () => {
  it('merges flat objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('merges nested objects', () => {
    const target = { a: { b: 1, c: 2 } };
    const source = { a: { c: 3, d: 4 } };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: { b: 1, c: 3, d: 4 } });
  });

  it('does not mutate original objects', () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } };
    deepMerge(target, source);

    expect(target).toEqual({ a: { b: 1 } });
    expect(source).toEqual({ a: { c: 2 } });
  });

  it('replaces arrays', () => {
    const target = { arr: [1, 2, 3] };
    const source = { arr: [4, 5] };
    const result = deepMerge(target, source);

    expect(result.arr).toEqual([4, 5]);
  });

  it('handles undefined in source', () => {
    const target = { a: 1, b: 2 };
    const source = { a: undefined };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 2 });
  });
});

describe('getAtPath', () => {
  const obj = {
    colors: {
      primary: '#fff',
      secondary: '#000',
    },
    spacing: {
      sm: '4px',
    },
  };

  it('gets value at simple path', () => {
    expect(getAtPath(obj, 'colors')).toEqual({ primary: '#fff', secondary: '#000' });
  });

  it('gets value at nested path', () => {
    expect(getAtPath(obj, 'colors.primary')).toBe('#fff');
    expect(getAtPath(obj, 'spacing.sm')).toBe('4px');
  });

  it('returns undefined for invalid path', () => {
    expect(getAtPath(obj, 'invalid')).toBeUndefined();
    expect(getAtPath(obj, 'colors.invalid')).toBeUndefined();
    expect(getAtPath(obj, 'colors.primary.invalid')).toBeUndefined();
  });

  it('handles null/undefined input', () => {
    expect(getAtPath(null, 'path')).toBeUndefined();
    expect(getAtPath(undefined, 'path')).toBeUndefined();
  });
});

describe('setAtPath', () => {
  it('sets value at simple path', () => {
    const obj = { a: 1 };
    const result = setAtPath(obj, 'a', 2);

    expect(result.a).toBe(2);
    expect(obj.a).toBe(1); // original unchanged
  });

  it('sets value at nested path', () => {
    const obj = { a: { b: 1 } };
    const result = setAtPath(obj, 'a.b', 2);

    expect(result.a.b).toBe(2);
    expect(obj.a.b).toBe(1); // original unchanged
  });

  it('creates intermediate objects', () => {
    const obj = { a: 1 };
    const result = setAtPath(obj, 'b.c.d', 'value');

    expect(result.b.c.d).toBe('value');
  });

  it('handles deeply nested paths', () => {
    const obj = {};
    const result = setAtPath(obj, 'a.b.c.d.e', 'deep');

    expect(result.a.b.c.d.e).toBe('deep');
  });
});

describe('pathToKebabCase', () => {
  it('converts dot paths to kebab-case', () => {
    expect(pathToKebabCase('colors.primary')).toBe('colors-primary');
  });

  it('converts camelCase to kebab-case', () => {
    expect(pathToKebabCase('fontSize')).toBe('font-size');
    expect(pathToKebabCase('borderTopColor')).toBe('border-top-color');
  });

  it('handles nested paths with camelCase', () => {
    expect(pathToKebabCase('typography.fontSize')).toBe('typography-font-size');
    expect(pathToKebabCase('layout.borderRadius')).toBe('layout-border-radius');
  });

  it('handles acronyms', () => {
    expect(pathToKebabCase('URLPath')).toBe('url-path');
    expect(pathToKebabCase('myHTMLElement')).toBe('my-html-element');
  });

  it('handles single segment', () => {
    expect(pathToKebabCase('primary')).toBe('primary');
    expect(pathToKebabCase('backgroundColor')).toBe('background-color');
  });
});

describe('isPlainObject', () => {
  it('returns true for plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('returns false for non-objects', () => {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject('string')).toBe(false);
    expect(isPlainObject(true)).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it('returns false for class instances', () => {
    class MyClass {}
    expect(isPlainObject(new MyClass())).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
  });
});

describe('createLRUCache', () => {
  it('stores and retrieves values', () => {
    const cache = createLRUCache<string, number>(5);

    cache.set('a', 1);
    cache.set('b', 2);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
  });

  it('returns undefined for missing keys', () => {
    const cache = createLRUCache<string, number>(5);
    expect(cache.get('missing')).toBeUndefined();
  });

  it('evicts oldest entry when full', () => {
    const cache = createLRUCache<string, number>(3);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4); // should evict 'a'

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
  });

  it('updates LRU order on get', () => {
    const cache = createLRUCache<string, number>(3);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    cache.get('a'); // move 'a' to most recent

    cache.set('d', 4); // should evict 'b' now, not 'a'

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
  });

  it('updates existing keys', () => {
    const cache = createLRUCache<string, number>(3);

    cache.set('a', 1);
    cache.set('a', 2);

    expect(cache.get('a')).toBe(2);
    expect(cache.size()).toBe(1);
  });

  it('deletes entries', () => {
    const cache = createLRUCache<string, number>(5);

    cache.set('a', 1);
    expect(cache.has('a')).toBe(true);

    cache.delete('a');
    expect(cache.has('a')).toBe(false);
    expect(cache.get('a')).toBeUndefined();
  });

  it('clears all entries', () => {
    const cache = createLRUCache<string, number>(5);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    cache.clear();

    expect(cache.size()).toBe(0);
    expect(cache.get('a')).toBeUndefined();
  });

  it('reports size correctly', () => {
    const cache = createLRUCache<string, number>(5);

    expect(cache.size()).toBe(0);

    cache.set('a', 1);
    expect(cache.size()).toBe(1);

    cache.set('b', 2);
    expect(cache.size()).toBe(2);

    cache.delete('a');
    expect(cache.size()).toBe(1);
  });
});
