import { describe, it, expect } from 'vitest';
import { getAtPath } from '../src/internal/utils';

describe('getAtPath', () => {
  it('gets value at simple path', () => {
    const obj = { foo: 'bar' };
    expect(getAtPath(obj, 'foo')).toBe('bar');
  });

  it('gets value at nested path', () => {
    const obj = { colors: { primary: '#ff0000' } };
    expect(getAtPath(obj, 'colors.primary')).toBe('#ff0000');
  });

  it('gets value at deeply nested path', () => {
    const obj = { a: { b: { c: { d: 'deep' } } } };
    expect(getAtPath(obj, 'a.b.c.d')).toBe('deep');
  });

  it('returns undefined for missing keys', () => {
    const obj = { foo: 'bar' };
    expect(getAtPath(obj, 'missing')).toBeUndefined();
  });

  it('returns undefined for missing nested keys', () => {
    const obj = { colors: { primary: '#ff0000' } };
    expect(getAtPath(obj, 'colors.missing')).toBeUndefined();
  });

  it('returns undefined when traversing non-object', () => {
    const obj = { colors: 'not-an-object' };
    expect(getAtPath(obj, 'colors.primary')).toBeUndefined();
  });

  it('returns undefined when traversing null', () => {
    const obj = { colors: null };
    expect(getAtPath(obj, 'colors.primary')).toBeUndefined();
  });

  it('returns undefined when object is null', () => {
    expect(getAtPath(null, 'foo')).toBeUndefined();
  });

  it('returns undefined when object is primitive', () => {
    expect(getAtPath('string', 'foo')).toBeUndefined();
    expect(getAtPath(123, 'foo')).toBeUndefined();
    expect(getAtPath(true, 'foo')).toBeUndefined();
  });

  it('handles arrays in path', () => {
    const obj = { items: ['a', 'b', 'c'] };
    expect(getAtPath(obj, 'items.1')).toBe('b');
  });

  it('returns object values', () => {
    const nested = { inner: 'value' };
    const obj = { foo: nested };
    expect(getAtPath(obj, 'foo')).toBe(nested);
  });
});
