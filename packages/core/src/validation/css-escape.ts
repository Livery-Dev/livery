/**
 * CSS value escaping utilities for preventing CSS injection attacks
 *
 * @remarks
 * In multi-tenant theming scenarios, theme values may come from untrusted sources.
 * This module provides escaping functions to prevent CSS injection attacks where
 * malicious values could break out of CSS variable declarations.
 *
 * @example
 * ```typescript
 * import { escapeCssValue } from '@livery/core';
 *
 * // Safe: escapes dangerous characters
 * const safe = escapeCssValue('red; background: url(evil)');
 * // Result: 'red\\; background: url(evil)'
 * ```
 */

/**
 * Characters that must be escaped in CSS values to prevent injection
 *
 * @internal
 */
const CSS_ESCAPE_MAP: Record<string, string> = {
  '\\': '\\\\', // Backslash must be escaped first
  '"': '\\"',
  "'": "\\'",
  ';': '\\;',
  '{': '\\{',
  '}': '\\}',
  '\n': '\\n',
  '\r': '\\r',
};

/**
 * Regex to match characters that need escaping (with global flag for replace)
 *
 * @internal
 */
const CSS_ESCAPE_REGEX = /[\\"';{}\n\r]/g;

/**
 * Regex to test if a string contains characters that need escaping (without global flag)
 *
 * @internal
 */
const CSS_ESCAPE_TEST_REGEX = /[\\"';{}\n\r]/;

/**
 * Escapes a CSS value to prevent injection attacks
 *
 * @param value - The CSS value to escape
 * @returns The escaped CSS value safe for use in CSS declarations
 *
 * @remarks
 * This function escapes characters that could be used to break out of CSS
 * variable declarations or inject malicious CSS:
 * - Backslashes (\\) - could be used to escape other escapes
 * - Quotes (" and ') - could break out of quoted values
 * - Semicolons (;) - could end declarations and start new ones
 * - Braces ({ and }) - could end rules and start new ones
 * - Newlines (\\n and \\r) - could break parsing
 *
 * The function is idempotent and safe to call multiple times.
 *
 * @example
 * ```typescript
 * // Escaping a potentially malicious value
 * escapeCssValue('red; } body { background: url(evil); } .x {');
 * // Returns: 'red\\; \\} body \\{ background: url(evil)\\; \\} .x \\{'
 *
 * // Safe values pass through unchanged (except for the escaping of special chars)
 * escapeCssValue('#3b82f6');
 * // Returns: '#3b82f6'
 *
 * // Empty strings are handled safely
 * escapeCssValue('');
 * // Returns: ''
 * ```
 *
 * @public
 */
export function escapeCssValue(value: string): string {
  if (!value) {
    return value;
  }

  return value.replace(CSS_ESCAPE_REGEX, (char) => CSS_ESCAPE_MAP[char] || char);
}

/**
 * Checks if a CSS value contains potentially dangerous characters
 *
 * @param value - The CSS value to check
 * @returns True if the value contains characters that would be escaped
 *
 * @remarks
 * This is a fast check to determine if escaping is needed.
 * Useful for optimization when processing many values.
 *
 * @example
 * ```typescript
 * needsCssEscaping('red');           // false
 * needsCssEscaping('red; evil: x');  // true
 * ```
 *
 * @public
 */
export function needsCssEscaping(value: string): boolean {
  return CSS_ESCAPE_TEST_REGEX.test(value);
}
