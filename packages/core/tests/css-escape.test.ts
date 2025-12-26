import { describe, it, expect } from 'vitest';
import { escapeCssValue, needsCssEscaping } from '../src/validation/css-escape';

describe('escapeCssValue', () => {
  it('returns empty string unchanged', () => {
    expect(escapeCssValue('')).toBe('');
  });

  it('returns safe values unchanged', () => {
    expect(escapeCssValue('#3b82f6')).toBe('#3b82f6');
    expect(escapeCssValue('16px')).toBe('16px');
    expect(escapeCssValue('Inter, sans-serif')).toBe('Inter, sans-serif');
    expect(escapeCssValue('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
  });

  it('escapes semicolons', () => {
    expect(escapeCssValue('red; background: evil')).toBe('red\\; background: evil');
  });

  it('escapes curly braces', () => {
    expect(escapeCssValue('} body { background: evil')).toBe('\\} body \\{ background: evil');
  });

  it('escapes quotes', () => {
    expect(escapeCssValue('"quoted"')).toBe('\\"quoted\\"');
    expect(escapeCssValue("'single'")).toBe("\\'single\\'");
  });

  it('escapes backslashes', () => {
    expect(escapeCssValue('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  it('escapes newlines', () => {
    expect(escapeCssValue('line1\nline2')).toBe('line1\\nline2');
    expect(escapeCssValue('line1\rline2')).toBe('line1\\rline2');
  });

  it('escapes complex injection attempts', () => {
    const malicious = 'red; } body { background: url(evil); } .x {';
    const escaped = escapeCssValue(malicious);
    expect(escaped).toBe('red\\; \\} body \\{ background: url(evil)\\; \\} .x \\{');
  });

  it('handles null-like values', () => {
    // @ts-expect-error - testing runtime behavior
    expect(escapeCssValue(null)).toBe(null);
    // @ts-expect-error - testing runtime behavior
    expect(escapeCssValue(undefined)).toBe(undefined);
  });
});

describe('needsCssEscaping', () => {
  it('returns false for safe values', () => {
    expect(needsCssEscaping('#3b82f6')).toBe(false);
    expect(needsCssEscaping('16px')).toBe(false);
    expect(needsCssEscaping('Inter, sans-serif')).toBe(false);
    expect(needsCssEscaping('rgb(255, 0, 0)')).toBe(false);
  });

  it('returns true for values with semicolons', () => {
    expect(needsCssEscaping('red; background: evil')).toBe(true);
  });

  it('returns true for values with braces', () => {
    expect(needsCssEscaping('} body {')).toBe(true);
  });

  it('returns true for values with quotes', () => {
    expect(needsCssEscaping('"quoted"')).toBe(true);
    expect(needsCssEscaping("'single'")).toBe(true);
  });

  it('returns true for values with backslashes', () => {
    expect(needsCssEscaping('path\\to\\file')).toBe(true);
  });

  it('returns true for values with newlines', () => {
    expect(needsCssEscaping('line1\nline2')).toBe(true);
    expect(needsCssEscaping('line1\rline2')).toBe(true);
  });
});
