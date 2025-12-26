import { describe, it, expect } from 'vitest';
import {
  validateColor,
  validateDimension,
  validateNumber,
  validateString,
  validateBoolean,
  validateFontFamily,
  validateFontWeight,
  validateShadow,
  validateUrl,
  validateValue,
  coerceValue,
} from '../src/validation/validators';

describe('validateColor', () => {
  describe('hex colors', () => {
    it('accepts 3-digit hex', () => {
      const result = validateColor('#fff');
      expect(result.valid).toBe(true);
      if (result.valid) expect(result.value).toBe('#fff');
    });

    it('accepts 6-digit hex', () => {
      const result = validateColor('#3b82f6');
      expect(result.valid).toBe(true);
      if (result.valid) expect(result.value).toBe('#3b82f6');
    });

    it('accepts 8-digit hex (with alpha)', () => {
      const result = validateColor('#3b82f680');
      expect(result.valid).toBe(true);
    });

    it('accepts uppercase hex', () => {
      const result = validateColor('#FFFFFF');
      expect(result.valid).toBe(true);
    });

    it('rejects invalid hex', () => {
      expect(validateColor('#gg0000').valid).toBe(false);
      expect(validateColor('#12345').valid).toBe(false);
      expect(validateColor('fff').valid).toBe(false);
    });
  });

  describe('rgb/rgba colors', () => {
    it('accepts rgb()', () => {
      const result = validateColor('rgb(255, 0, 128)');
      expect(result.valid).toBe(true);
    });

    it('accepts rgba()', () => {
      const result = validateColor('rgba(255, 0, 128, 0.5)');
      expect(result.valid).toBe(true);
    });

    it('accepts rgba with 1 alpha', () => {
      const result = validateColor('rgba(255, 0, 128, 1)');
      expect(result.valid).toBe(true);
    });

    it('accepts rgba with 0 alpha', () => {
      const result = validateColor('rgba(255, 0, 128, 0)');
      expect(result.valid).toBe(true);
    });
  });

  describe('hsl/hsla colors', () => {
    it('accepts hsl()', () => {
      const result = validateColor('hsl(240, 100%, 50%)');
      expect(result.valid).toBe(true);
    });

    it('accepts hsla()', () => {
      const result = validateColor('hsla(240, 100%, 50%, 0.5)');
      expect(result.valid).toBe(true);
    });
  });

  describe('named colors', () => {
    it('accepts CSS named colors', () => {
      expect(validateColor('red').valid).toBe(true);
      expect(validateColor('blue').valid).toBe(true);
      expect(validateColor('transparent').valid).toBe(true);
      expect(validateColor('currentcolor').valid).toBe(true);
    });

    it('accepts named colors case-insensitively', () => {
      expect(validateColor('RED').valid).toBe(true);
      expect(validateColor('Blue').valid).toBe(true);
      expect(validateColor('TRANSPARENT').valid).toBe(true);
    });

    it('rejects invalid color names', () => {
      expect(validateColor('notacolor').valid).toBe(false);
      expect(validateColor('reddish').valid).toBe(false);
    });
  });

  describe('invalid inputs', () => {
    it('rejects non-string', () => {
      expect(validateColor(123).valid).toBe(false);
      expect(validateColor(null).valid).toBe(false);
      expect(validateColor(undefined).valid).toBe(false);
    });

    it('rejects arbitrary text', () => {
      expect(validateColor('notacolor').valid).toBe(false);
      expect(validateColor('hello world').valid).toBe(false);
    });
  });
});

describe('validateDimension', () => {
  it('accepts px values', () => {
    expect(validateDimension('16px').valid).toBe(true);
    expect(validateDimension('0.5px').valid).toBe(true);
    expect(validateDimension('-10px').valid).toBe(true);
  });

  it('accepts rem values', () => {
    expect(validateDimension('1rem').valid).toBe(true);
    expect(validateDimension('1.5rem').valid).toBe(true);
  });

  it('accepts em values', () => {
    expect(validateDimension('2em').valid).toBe(true);
  });

  it('accepts percentage values', () => {
    expect(validateDimension('100%').valid).toBe(true);
    expect(validateDimension('50%').valid).toBe(true);
  });

  it('accepts viewport units', () => {
    expect(validateDimension('100vh').valid).toBe(true);
    expect(validateDimension('100vw').valid).toBe(true);
    expect(validateDimension('50vmin').valid).toBe(true);
    expect(validateDimension('50vmax').valid).toBe(true);
  });

  it('accepts new viewport units', () => {
    expect(validateDimension('100svh').valid).toBe(true);
    expect(validateDimension('100dvh').valid).toBe(true);
    expect(validateDimension('100lvh').valid).toBe(true);
  });

  it('accepts zero without unit', () => {
    const result = validateDimension('0');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe('0');
  });

  it('rejects number without unit', () => {
    expect(validateDimension('16').valid).toBe(false);
  });

  it('rejects non-string', () => {
    expect(validateDimension(16).valid).toBe(false);
  });
});

describe('validateNumber', () => {
  it('accepts integers', () => {
    expect(validateNumber(42).valid).toBe(true);
    expect(validateNumber(0).valid).toBe(true);
    expect(validateNumber(-10).valid).toBe(true);
  });

  it('accepts floats', () => {
    expect(validateNumber(3.14).valid).toBe(true);
    expect(validateNumber(0.5).valid).toBe(true);
  });

  it('rejects NaN', () => {
    expect(validateNumber(NaN).valid).toBe(false);
  });

  it('rejects string', () => {
    expect(validateNumber('42').valid).toBe(false);
  });

  it('rejects null/undefined', () => {
    expect(validateNumber(null).valid).toBe(false);
    expect(validateNumber(undefined).valid).toBe(false);
  });
});

describe('validateString', () => {
  it('accepts any string', () => {
    expect(validateString('hello').valid).toBe(true);
    expect(validateString('').valid).toBe(true);
    expect(validateString('123').valid).toBe(true);
  });

  it('rejects non-string', () => {
    expect(validateString(123).valid).toBe(false);
    expect(validateString(null).valid).toBe(false);
  });
});

describe('validateBoolean', () => {
  it('accepts true', () => {
    expect(validateBoolean(true).valid).toBe(true);
  });

  it('accepts false', () => {
    expect(validateBoolean(false).valid).toBe(true);
  });

  it('rejects truthy values', () => {
    expect(validateBoolean(1).valid).toBe(false);
    expect(validateBoolean('true').valid).toBe(false);
  });

  it('rejects falsy values', () => {
    expect(validateBoolean(0).valid).toBe(false);
    expect(validateBoolean('').valid).toBe(false);
    expect(validateBoolean(null).valid).toBe(false);
  });
});

describe('validateFontFamily', () => {
  it('accepts single font', () => {
    expect(validateFontFamily('Inter').valid).toBe(true);
  });

  it('accepts font stack', () => {
    expect(validateFontFamily('Inter, system-ui, sans-serif').valid).toBe(true);
  });

  it('accepts quoted fonts', () => {
    expect(validateFontFamily('"Helvetica Neue", Arial, sans-serif').valid).toBe(true);
  });

  it('rejects empty string', () => {
    expect(validateFontFamily('').valid).toBe(false);
    expect(validateFontFamily('   ').valid).toBe(false);
  });

  it('rejects non-string', () => {
    expect(validateFontFamily(123).valid).toBe(false);
  });
});

describe('validateFontWeight', () => {
  it('accepts numeric weights', () => {
    expect(validateFontWeight(100).valid).toBe(true);
    expect(validateFontWeight(400).valid).toBe(true);
    expect(validateFontWeight(700).valid).toBe(true);
    expect(validateFontWeight(900).valid).toBe(true);
  });

  it('accepts intermediate weights', () => {
    expect(validateFontWeight(550).valid).toBe(true);
  });

  it('accepts keyword weights', () => {
    expect(validateFontWeight('normal').valid).toBe(true);
    expect(validateFontWeight('bold').valid).toBe(true);
    expect(validateFontWeight('lighter').valid).toBe(true);
    expect(validateFontWeight('bolder').valid).toBe(true);
  });

  it('accepts numeric string weights', () => {
    const result = validateFontWeight('700');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe(700);
  });

  it('rejects out of range weights', () => {
    expect(validateFontWeight(0).valid).toBe(false);
    expect(validateFontWeight(1001).valid).toBe(false);
  });

  it('rejects invalid keywords', () => {
    expect(validateFontWeight('heavy').valid).toBe(false);
  });
});

describe('validateShadow', () => {
  it('accepts box-shadow values', () => {
    expect(validateShadow('0 4px 6px -1px rgba(0, 0, 0, 0.1)').valid).toBe(true);
    expect(validateShadow('0 1px 3px rgba(0,0,0,0.12)').valid).toBe(true);
  });

  it('accepts none', () => {
    const result = validateShadow('none');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe('none');
  });

  it('accepts inset shadows', () => {
    expect(validateShadow('inset 0 2px 4px rgba(0,0,0,0.1)').valid).toBe(true);
  });

  it('rejects empty string', () => {
    expect(validateShadow('').valid).toBe(false);
  });

  it('rejects non-string', () => {
    expect(validateShadow(123).valid).toBe(false);
  });
});

describe('validateUrl', () => {
  it('accepts https URLs', () => {
    expect(validateUrl('https://example.com/image.png').valid).toBe(true);
  });

  it('accepts http URLs', () => {
    expect(validateUrl('http://example.com/image.png').valid).toBe(true);
  });

  it('accepts absolute paths', () => {
    expect(validateUrl('/images/logo.png').valid).toBe(true);
  });

  it('accepts relative paths', () => {
    expect(validateUrl('./images/logo.png').valid).toBe(true);
    expect(validateUrl('../images/logo.png').valid).toBe(true);
  });

  it('accepts hash fragments', () => {
    expect(validateUrl('#section').valid).toBe(true);
    expect(validateUrl('#top').valid).toBe(true);
  });

  it('rejects invalid URLs', () => {
    expect(validateUrl('not-a-url').valid).toBe(false);
    expect(validateUrl('ftp://example.com').valid).toBe(false);
  });

  it('rejects non-string', () => {
    expect(validateUrl(123).valid).toBe(false);
  });

  describe('security', () => {
    it('blocks javascript: protocol (XSS prevention)', () => {
      expect(validateUrl('javascript:alert(1)').valid).toBe(false);
      expect(validateUrl('javascript:alert("xss")').valid).toBe(false);
      expect(validateUrl('JAVASCRIPT:alert(1)').valid).toBe(false);
    });

    it('blocks vbscript: protocol (IE XSS prevention)', () => {
      expect(validateUrl('vbscript:msgbox(1)').valid).toBe(false);
      expect(validateUrl('VBSCRIPT:msgbox(1)').valid).toBe(false);
    });

    it('blocks file: protocol (local file access prevention)', () => {
      expect(validateUrl('file:///etc/passwd').valid).toBe(false);
      expect(validateUrl('file:///C:/Windows/System32').valid).toBe(false);
    });

    it('blocks data:text/html (script execution prevention)', () => {
      expect(validateUrl('data:text/html,<script>alert(1)</script>').valid).toBe(false);
      expect(validateUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==').valid).toBe(false);
    });

    it('blocks data:application/javascript (script execution prevention)', () => {
      expect(validateUrl('data:application/javascript,alert(1)').valid).toBe(false);
      expect(validateUrl('data:application/x-javascript,alert(1)').valid).toBe(false);
    });

    it('allows safe data: URLs (images)', () => {
      expect(validateUrl('data:image/png;base64,iVBORw0KGgo=').valid).toBe(true);
      expect(validateUrl('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==').valid).toBe(true);
      expect(validateUrl('data:image/svg+xml,%3Csvg%3E%3C/svg%3E').valid).toBe(true);
    });

    it('provides helpful error messages for blocked protocols', () => {
      const jsResult = validateUrl('javascript:alert(1)');
      expect(jsResult.valid).toBe(false);
      if (!jsResult.valid) {
        expect(jsResult.message).toContain('unsafe URL protocol');
      }

      const dataHtmlResult = validateUrl('data:text/html,<script>');
      expect(dataHtmlResult.valid).toBe(false);
      if (!dataHtmlResult.valid) {
        expect(dataHtmlResult.message).toContain('dangerous data URL');
      }
    });
  });
});

describe('validateValue', () => {
  it('dispatches to correct validator', () => {
    expect(validateValue('#fff', 'color').valid).toBe(true);
    expect(validateValue('16px', 'dimension').valid).toBe(true);
    expect(validateValue(42, 'number').valid).toBe(true);
    expect(validateValue('hello', 'string').valid).toBe(true);
    expect(validateValue(true, 'boolean').valid).toBe(true);
    expect(validateValue('Inter', 'fontFamily').valid).toBe(true);
    expect(validateValue(700, 'fontWeight').valid).toBe(true);
    expect(validateValue('0 2px 4px #000', 'shadow').valid).toBe(true);
    expect(validateValue('https://example.com', 'url').valid).toBe(true);
  });
});

describe('coerceValue', () => {
  it('coerces string to number', () => {
    const result = coerceValue('42', 'number');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe(42);
  });

  it('coerces "true" to boolean', () => {
    const result = coerceValue('true', 'boolean');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe(true);
  });

  it('coerces "false" to boolean', () => {
    const result = coerceValue('false', 'boolean');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe(false);
  });

  it('coerces 1 to true', () => {
    const result = coerceValue(1, 'boolean');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe(true);
  });

  it('coerces 0 to false', () => {
    const result = coerceValue(0, 'boolean');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe(false);
  });

  it('coerces number to string', () => {
    const result = coerceValue(123, 'string');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe('123');
  });

  it('coerces number to dimension with px', () => {
    const result = coerceValue(16, 'dimension');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe('16px');
  });

  it('returns already valid values unchanged', () => {
    const result = coerceValue('#fff', 'color');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe('#fff');
  });

  it('returns error for non-coercible values', () => {
    expect(coerceValue('not-a-number', 'number').valid).toBe(false);
    expect(coerceValue('not-a-color', 'color').valid).toBe(false);
  });

  it('fails to coerce invalid boolean values', () => {
    // Values that are neither true/false, 1/0, nor already booleans
    expect(coerceValue('yes', 'boolean').valid).toBe(false);
    expect(coerceValue('no', 'boolean').valid).toBe(false);
    expect(coerceValue(2, 'boolean').valid).toBe(false);
    expect(coerceValue({}, 'boolean').valid).toBe(false);
  });

  it('fails to coerce null/undefined to string', () => {
    expect(coerceValue(null, 'string').valid).toBe(false);
    expect(coerceValue(undefined, 'string').valid).toBe(false);
  });

  it('fails to coerce non-number to dimension', () => {
    // String that is not a valid dimension and not a number
    expect(coerceValue('invalid', 'dimension').valid).toBe(false);
    expect(coerceValue({}, 'dimension').valid).toBe(false);
  });

  it('coerces boolean to string', () => {
    const result = coerceValue(true, 'string');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe('true');
  });

  it('coerces object to string', () => {
    const result = coerceValue({ foo: 'bar' }, 'string');
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value).toBe('[object Object]');
  });
});
