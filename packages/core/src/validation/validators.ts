/**
 * Token value validators
 *
 * Each validator checks if a value matches the expected token type
 * and optionally coerces the value to the correct type.
 */

import type { TokenType } from '../types/index.js';

/**
 * Validation result for a single value
 *
 * @typeParam T - The expected type of the validated value
 */
export type ValueValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; message: string };

/**
 * Color validation regex patterns
 */
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
const RGB_COLOR_REGEX =
  /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+))?\s*\)$/;
const HSL_COLOR_REGEX =
  /^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*(0|1|0?\.\d+))?\s*\)$/;

/**
 * Dimension validation regex
 */
const DIMENSION_REGEX =
  /^-?(\d+\.?\d*|\.\d+)(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|svh|svw|dvh|dvw|lvh|lvw)$/;

/**
 * Valid font weight keywords (using Set for O(1) lookup)
 */
const FONT_WEIGHT_KEYWORDS = new Set(['normal', 'bold', 'bolder', 'lighter', 'inherit', 'initial', 'unset']);

/**
 * CSS named colors (140+ colors from CSS Color Module Level 4)
 * Plus special keywords: transparent, currentcolor, inherit, initial, unset
 *
 * @internal
 */
const CSS_NAMED_COLORS = new Set([
  // Special keywords
  'transparent',
  'currentcolor',
  'inherit',
  'initial',
  'unset',
  // CSS Color Level 4 named colors (alphabetical)
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'rebeccapurple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
]);

/**
 * Validates a color value
 *
 * @param value - The value to validate
 * @returns Validation result with the color string or error message
 *
 * @remarks
 * Accepts:
 * - CSS named colors (red, blue, transparent, currentcolor, etc.)
 * - Hex colors (#RGB, #RRGGBB, #RRGGBBAA)
 * - RGB/RGBA: rgb(255, 0, 0), rgba(255, 0, 0, 0.5)
 * - HSL/HSLA: hsl(0, 100%, 50%), hsla(0, 100%, 50%, 0.5)
 *
 * @example
 * ```typescript
 * validateColor('#3b82f6');        // { valid: true, value: '#3b82f6' }
 * validateColor('red');            // { valid: true, value: 'red' }
 * validateColor('transparent');    // { valid: true, value: 'transparent' }
 * validateColor('rgb(255, 0, 0)'); // { valid: true, value: 'rgb(255, 0, 0)' }
 * validateColor('notacolor');      // { valid: false, message: '...' }
 * ```
 *
 * @public
 */
export function validateColor(value: unknown): ValueValidationResult<string> {
  if (typeof value !== 'string') {
    return { valid: false, message: 'expected string' };
  }

  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();

  // Check for CSS named colors first (O(1) lookup)
  if (CSS_NAMED_COLORS.has(lower)) {
    return { valid: true, value: lower };
  }

  // Check hex, rgb, hsl formats
  if (
    HEX_COLOR_REGEX.test(trimmed) ||
    RGB_COLOR_REGEX.test(trimmed) ||
    HSL_COLOR_REGEX.test(trimmed)
  ) {
    return { valid: true, value: trimmed };
  }

  return {
    valid: false,
    message: 'invalid color format (expected hex, rgb, rgba, hsl, hsla, or CSS named color)',
  };
}

/**
 * Validates a dimension value
 *
 * @param value - The value to validate
 * @returns Validation result with the dimension string or error message
 *
 * @remarks
 * Accepts values with units: px, rem, em, %, vh, vw, vmin, vmax, ch, ex, cm, mm, in, pt, pc, svh, svw, dvh, dvw, lvh, lvw
 * Also accepts '0' without units.
 *
 * @example
 * ```typescript
 * validateDimension('16px');   // { valid: true, value: '16px' }
 * validateDimension('1.5rem'); // { valid: true, value: '1.5rem' }
 * validateDimension('100%');   // { valid: true, value: '100%' }
 * validateDimension('0');      // { valid: true, value: '0' }
 * validateDimension('16');     // { valid: false, message: '...' }
 * ```
 *
 * @public
 */
export function validateDimension(value: unknown): ValueValidationResult<string> {
  if (typeof value !== 'string') {
    return { valid: false, message: 'expected string' };
  }

  const trimmed = value.trim();

  // Allow 0 without units
  if (trimmed === '0') {
    return { valid: true, value: '0' };
  }

  if (DIMENSION_REGEX.test(trimmed)) {
    return { valid: true, value: trimmed };
  }

  return {
    valid: false,
    message: 'invalid dimension format (expected number with unit like px, rem, em, %, etc.)',
  };
}

/**
 * Validates a number value
 *
 * @param value - The value to validate
 * @returns Validation result with the number or error message
 *
 * @remarks
 * Only accepts actual JavaScript numbers that are not NaN.
 * String numbers like "42" are rejected - use {@link coerceValue} for conversion.
 *
 * @example
 * ```typescript
 * validateNumber(42);    // { valid: true, value: 42 }
 * validateNumber(3.14);  // { valid: true, value: 3.14 }
 * validateNumber('42');  // { valid: false, message: '...' }
 * validateNumber(NaN);   // { valid: false, message: '...' }
 * ```
 *
 * @public
 */
export function validateNumber(value: unknown): ValueValidationResult<number> {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return { valid: true, value };
  }

  return { valid: false, message: 'expected number' };
}

/**
 * Validates a string value
 *
 * @param value - The value to validate
 * @returns Validation result with the string or error message
 *
 * @remarks
 * Accepts any string value including empty strings.
 * Non-string values are rejected.
 *
 * @example
 * ```typescript
 * validateString('hello');  // { valid: true, value: 'hello' }
 * validateString('');       // { valid: true, value: '' }
 * validateString(123);      // { valid: false, message: '...' }
 * ```
 *
 * @public
 */
export function validateString(value: unknown): ValueValidationResult<string> {
  if (typeof value === 'string') {
    return { valid: true, value };
  }

  return { valid: false, message: 'expected string' };
}

/**
 * Validates a boolean value
 *
 * @param value - The value to validate
 * @returns Validation result with the boolean or error message
 *
 * @remarks
 * Only accepts actual JavaScript booleans (true/false).
 * Truthy/falsy values like 1, 0, "true" are rejected - use {@link coerceValue} for conversion.
 *
 * @example
 * ```typescript
 * validateBoolean(true);    // { valid: true, value: true }
 * validateBoolean(false);   // { valid: true, value: false }
 * validateBoolean('true');  // { valid: false, message: '...' }
 * validateBoolean(1);       // { valid: false, message: '...' }
 * ```
 *
 * @public
 */
export function validateBoolean(value: unknown): ValueValidationResult<boolean> {
  if (typeof value === 'boolean') {
    return { valid: true, value };
  }

  return { valid: false, message: 'expected boolean' };
}

/**
 * Validates a font family value
 *
 * @param value - The value to validate
 * @returns Validation result with the font family string or error message
 *
 * @remarks
 * Accepts font family stacks (e.g., "Inter, sans-serif").
 * Empty strings are rejected.
 *
 * @example
 * ```typescript
 * validateFontFamily('Inter');                          // { valid: true, value: 'Inter' }
 * validateFontFamily('Inter, system-ui, sans-serif');   // { valid: true, value: '...' }
 * validateFontFamily('"Helvetica Neue", Arial');        // { valid: true, value: '...' }
 * validateFontFamily('');                               // { valid: false, message: '...' }
 * ```
 *
 * @public
 */
export function validateFontFamily(value: unknown): ValueValidationResult<string> {
  if (typeof value !== 'string') {
    return { valid: false, message: 'expected string' };
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'font family cannot be empty' };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validates a font weight value
 *
 * @param value - The value to validate
 * @returns Validation result with the font weight (string or number) or error message
 *
 * @remarks
 * Accepts numeric weights (1-1000) or keywords (normal, bold, bolder, lighter, inherit, initial, unset).
 * String numbers like "700" are converted to numbers.
 *
 * @example
 * ```typescript
 * validateFontWeight(400);      // { valid: true, value: 400 }
 * validateFontWeight(700);      // { valid: true, value: 700 }
 * validateFontWeight('bold');   // { valid: true, value: 'bold' }
 * validateFontWeight('normal'); // { valid: true, value: 'normal' }
 * validateFontWeight('700');    // { valid: true, value: 700 }
 * validateFontWeight(1500);     // { valid: false, message: '...' }
 * ```
 *
 * @public
 */
export function validateFontWeight(value: unknown): ValueValidationResult<string | number> {
  if (typeof value === 'number') {
    if (value >= 1 && value <= 1000) {
      return { valid: true, value };
    }
    return { valid: false, message: 'font weight number must be between 1 and 1000' };
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();

    // Check for keyword
    if (FONT_WEIGHT_KEYWORDS.has(lower)) {
      return { valid: true, value: lower };
    }

    // Check for numeric string (parse original trimmed, not lowercased)
    const num = Number(trimmed);
    if (!Number.isNaN(num) && num >= 1 && num <= 1000) {
      return { valid: true, value: num };
    }
  }

  return {
    valid: false,
    message: 'invalid font weight (expected number 1-1000 or keyword)',
  };
}

/**
 * Shadow dimension regex - matches CSS dimension values at the start of a string
 * Allows negative values for spread-radius
 *
 * @internal
 */
const SHADOW_DIMENSION_PATTERN = /-?(\d+\.?\d*|\.\d+)(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)?/;

/**
 * Validates a single shadow value (not comma-separated)
 *
 * Shadow syntax: [inset] offset-x offset-y [blur-radius] [spread-radius] [color]
 * Requires at least offset-x and offset-y (two dimension values)
 *
 * @internal
 */
function validateSingleShadow(shadow: string): boolean {
  let workingStr = shadow.trim();
  if (!workingStr) return false;

  // Remove optional 'inset' keyword from start
  workingStr = workingStr.replace(/^inset\s+/i, '').trim();
  if (!workingStr) return false;

  // A valid shadow must start with at least 2 dimension values
  // Pattern: dimension dimension [dimension] [dimension] [color]
  // We check that it starts with valid dimensions

  // Match first dimension (offset-x)
  const firstMatch = workingStr.match(new RegExp(`^${SHADOW_DIMENSION_PATTERN.source}`));
  if (!firstMatch) return false;

  // Remove first dimension and continue
  workingStr = workingStr.slice(firstMatch[0].length).trim();
  if (!workingStr) return false;

  // Match second dimension (offset-y)
  const secondMatch = workingStr.match(new RegExp(`^${SHADOW_DIMENSION_PATTERN.source}`));
  if (!secondMatch) return false;

  // Successfully found at least 2 dimensions - this is a valid shadow structure
  // The rest can be optional blur, spread, and color which we don't strictly validate
  return true;
}

/**
 * Splits a shadow string by commas, but ignores commas inside parentheses
 * (e.g., inside rgba() or hsla() color functions)
 *
 * @internal
 */
function splitShadows(shadowStr: string): string[] {
  const shadows: string[] = [];
  let current = '';
  let parenDepth = 0;

  for (const char of shadowStr) {
    if (char === '(') {
      parenDepth++;
      current += char;
    } else if (char === ')') {
      parenDepth--;
      current += char;
    } else if (char === ',' && parenDepth === 0) {
      shadows.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    shadows.push(current.trim());
  }

  return shadows;
}

/**
 * Validates a shadow value
 *
 * @param value - The value to validate
 * @returns Validation result with the shadow string or error message
 *
 * @remarks
 * Accepts CSS box-shadow or text-shadow values:
 * - 'none' keyword
 * - Single shadow: `[inset] offset-x offset-y [blur] [spread] [color]`
 * - Multiple shadows: comma-separated shadow values
 *
 * @example
 * ```typescript
 * validateShadow('0 1px 3px rgba(0,0,0,0.1)'); // valid
 * validateShadow('inset 0 2px 4px #000');      // valid
 * validateShadow('none');                       // valid
 * validateShadow('not a shadow');               // invalid
 * ```
 *
 * @public
 */
export function validateShadow(value: unknown): ValueValidationResult<string> {
  if (typeof value !== 'string') {
    return { valid: false, message: 'expected string' };
  }

  const trimmed = value.trim();

  // Allow 'none' and 'inherit', 'initial', 'unset'
  const lower = trimmed.toLowerCase();
  if (lower === 'none' || lower === 'inherit' || lower === 'initial' || lower === 'unset') {
    return { valid: true, value: lower };
  }

  // Check for empty
  if (trimmed.length === 0) {
    return { valid: false, message: 'shadow cannot be empty' };
  }

  // Split by comma for multiple shadows (but not inside color functions like rgba())
  const shadows = splitShadows(trimmed);

  for (const shadow of shadows) {
    if (!validateSingleShadow(shadow)) {
      return {
        valid: false,
        message: 'invalid shadow syntax (expected: [inset] offset-x offset-y [blur] [spread] [color])',
      };
    }
  }

  return { valid: true, value: trimmed };
}

/**
 * Allowed URL protocols for security
 *
 * @internal
 */
const ALLOWED_URL_PROTOCOLS = new Set(['http:', 'https:', 'data:']);

/**
 * Dangerous data URL MIME types that could execute scripts
 *
 * @internal
 */
const DANGEROUS_DATA_MIMES = ['text/html', 'application/javascript', 'application/x-javascript'];

/**
 * Validates a URL value with security checks
 *
 * @param value - The value to validate
 * @returns Validation result with the URL string or error message
 *
 * @remarks
 * Accepts:
 * - HTTP/HTTPS URLs
 * - Data URLs (except text/html and javascript MIME types)
 * - Relative paths (/, ./, ../)
 * - Hash fragments (#)
 *
 * Rejects:
 * - javascript: protocol (XSS vector)
 * - file: protocol (local file access)
 * - vbscript: protocol (IE XSS vector)
 * - data:text/html (XSS vector)
 *
 * @example
 * ```typescript
 * validateUrl('https://example.com/logo.png'); // valid
 * validateUrl('/images/logo.png');              // valid
 * validateUrl('data:image/png;base64,...');     // valid
 * validateUrl('javascript:alert(1)');           // invalid - unsafe protocol
 * validateUrl('data:text/html,...');            // invalid - dangerous MIME
 * ```
 *
 * @public
 */
export function validateUrl(value: unknown): ValueValidationResult<string> {
  if (typeof value !== 'string') {
    return { valid: false, message: 'expected string' };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { valid: false, message: 'URL cannot be empty' };
  }

  // Allow relative paths and hash fragments
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../') || trimmed.startsWith('#')) {
    return { valid: true, value: trimmed };
  }

  // Try to parse as URL to validate and check protocol
  try {
    const url = new URL(trimmed);

    // Check for allowed protocols
    if (!ALLOWED_URL_PROTOCOLS.has(url.protocol)) {
      return {
        valid: false,
        message: `unsafe URL protocol '${url.protocol}' (allowed: http, https, data)`,
      };
    }

    // Special check for data URLs - block dangerous MIME types
    if (url.protocol === 'data:') {
      const dataContent = trimmed.slice(5); // Remove 'data:'
      const mimeMatch = dataContent.match(/^([^;,]+)/);
      if (mimeMatch) {
        const mime = mimeMatch[1]!.toLowerCase();
        if (DANGEROUS_DATA_MIMES.some((dangerous) => mime.includes(dangerous))) {
          return {
            valid: false,
            message: `dangerous data URL MIME type '${mime}' is not allowed`,
          };
        }
      }
    }

    return { valid: true, value: trimmed };
  } catch {
    // URL parsing failed - not a valid absolute URL
    return {
      valid: false,
      message: 'invalid URL format',
    };
  }
}

/**
 * Validates a value against a token type
 *
 * @param value - The value to validate
 * @param tokenType - The expected token type
 * @returns Validation result with the validated value or error message
 *
 * @remarks
 * Dispatches to the appropriate validator based on token type.
 *
 * @example
 * ```typescript
 * validateValue('#3b82f6', 'color');   // { valid: true, value: '#3b82f6' }
 * validateValue('16px', 'dimension');  // { valid: true, value: '16px' }
 * validateValue(42, 'number');         // { valid: true, value: 42 }
 * validateValue('hello', 'number');    // { valid: false, message: '...' }
 * ```
 *
 * @public
 */
export function validateValue(
  value: unknown,
  tokenType: TokenType
): ValueValidationResult<unknown> {
  switch (tokenType) {
    case 'color':
      return validateColor(value);
    case 'dimension':
      return validateDimension(value);
    case 'number':
      return validateNumber(value);
    case 'string':
      return validateString(value);
    case 'boolean':
      return validateBoolean(value);
    case 'fontFamily':
      return validateFontFamily(value);
    case 'fontWeight':
      return validateFontWeight(value);
    case 'shadow':
      return validateShadow(value);
    case 'url':
      return validateUrl(value);
    default: {
      const _exhaustive: never = tokenType;
      return { valid: false, message: `unknown token type: ${_exhaustive}` };
    }
  }
}

/**
 * Coerces a value to match a token type if possible
 *
 * @param value - The value to coerce
 * @param tokenType - The target token type
 * @returns Validation result with the coerced value or error message
 *
 * @remarks
 * Attempts type conversion when possible:
 * - Strings to numbers ("123" -> 123)
 * - Strings/numbers to booleans ("true"/1 -> true, "false"/0 -> false)
 * - Numbers to dimensions (16 -> "16px")
 * - Any to string (via String())
 *
 * @example
 * ```typescript
 * coerceValue('42', 'number');    // { valid: true, value: 42 }
 * coerceValue('true', 'boolean'); // { valid: true, value: true }
 * coerceValue(16, 'dimension');   // { valid: true, value: '16px' }
 * coerceValue(123, 'string');     // { valid: true, value: '123' }
 * ```
 *
 * @public
 */
export function coerceValue(value: unknown, tokenType: TokenType): ValueValidationResult<unknown> {
  // First try direct validation
  const directResult = validateValue(value, tokenType);
  if (directResult.valid) {
    return directResult;
  }

  // Try coercion based on type
  switch (tokenType) {
    case 'number':
      if (typeof value === 'string') {
        const num = Number(value);
        if (!Number.isNaN(num)) {
          return { valid: true, value: num };
        }
      }
      break;

    case 'boolean':
      if (value === 'true' || value === 1) {
        return { valid: true, value: true };
      }
      if (value === 'false' || value === 0) {
        return { valid: true, value: false };
      }
      break;

    case 'string':
      if (value !== null && value !== undefined) {
        return { valid: true, value: String(value) };
      }
      break;

    case 'dimension':
      // Try to add 'px' if it's a plain number
      if (typeof value === 'number') {
        return { valid: true, value: `${value}px` };
      }
      break;
  }

  return directResult;
}
