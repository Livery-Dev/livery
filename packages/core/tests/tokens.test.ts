import { describe, it, expect } from 'vitest';
import { t } from '../src/schema/tokens';

describe('Token Builders', () => {
  describe('t.color()', () => {
    it('creates a color token', () => {
      const token = t.color();
      expect(token.type).toBe('color');
      expect(token.defaultValue).toBeUndefined();
      expect(token.description).toBeUndefined();
    });

    it('supports default value', () => {
      const token = t.color().default('#3b82f6');
      expect(token.type).toBe('color');
      expect(token.defaultValue).toBe('#3b82f6');
    });

    it('supports description', () => {
      const token = t.color().describe('Primary brand color');
      expect(token.type).toBe('color');
      expect(token.description).toBe('Primary brand color');
    });

    it('supports chaining default and describe', () => {
      const token = t.color().default('#3b82f6').describe('Primary brand color');
      expect(token.type).toBe('color');
      expect(token.defaultValue).toBe('#3b82f6');
      expect(token.description).toBe('Primary brand color');
    });

    it('supports chaining describe and default', () => {
      const token = t.color().describe('Primary brand color').default('#3b82f6');
      expect(token.type).toBe('color');
      expect(token.defaultValue).toBe('#3b82f6');
      expect(token.description).toBe('Primary brand color');
    });
  });

  describe('t.dimension()', () => {
    it('creates a dimension token', () => {
      const token = t.dimension();
      expect(token.type).toBe('dimension');
      expect(token.defaultValue).toBeUndefined();
    });

    it('supports default value with px', () => {
      const token = t.dimension().default('16px');
      expect(token.defaultValue).toBe('16px');
    });

    it('supports default value with rem', () => {
      const token = t.dimension().default('1rem');
      expect(token.defaultValue).toBe('1rem');
    });

    it('supports default value with percent', () => {
      const token = t.dimension().default('100%');
      expect(token.defaultValue).toBe('100%');
    });
  });

  describe('t.number()', () => {
    it('creates a number token', () => {
      const token = t.number();
      expect(token.type).toBe('number');
      expect(token.defaultValue).toBeUndefined();
    });

    it('supports integer default', () => {
      const token = t.number().default(42);
      expect(token.defaultValue).toBe(42);
    });

    it('supports float default', () => {
      const token = t.number().default(3.14);
      expect(token.defaultValue).toBe(3.14);
    });

    it('supports zero default', () => {
      const token = t.number().default(0);
      expect(token.defaultValue).toBe(0);
    });

    it('supports negative default', () => {
      const token = t.number().default(-10);
      expect(token.defaultValue).toBe(-10);
    });
  });

  describe('t.string()', () => {
    it('creates a string token', () => {
      const token = t.string();
      expect(token.type).toBe('string');
      expect(token.defaultValue).toBeUndefined();
    });

    it('supports default value', () => {
      const token = t.string().default('hello world');
      expect(token.defaultValue).toBe('hello world');
    });

    it('supports empty string default', () => {
      const token = t.string().default('');
      expect(token.defaultValue).toBe('');
    });
  });

  describe('t.boolean()', () => {
    it('creates a boolean token', () => {
      const token = t.boolean();
      expect(token.type).toBe('boolean');
      expect(token.defaultValue).toBeUndefined();
    });

    it('supports true default', () => {
      const token = t.boolean().default(true);
      expect(token.defaultValue).toBe(true);
    });

    it('supports false default', () => {
      const token = t.boolean().default(false);
      expect(token.defaultValue).toBe(false);
    });
  });

  describe('t.fontFamily()', () => {
    it('creates a fontFamily token', () => {
      const token = t.fontFamily();
      expect(token.type).toBe('fontFamily');
      expect(token.defaultValue).toBeUndefined();
    });

    it('supports font stack default', () => {
      const token = t.fontFamily().default('Inter, system-ui, sans-serif');
      expect(token.defaultValue).toBe('Inter, system-ui, sans-serif');
    });
  });

  describe('t.fontWeight()', () => {
    it('creates a fontWeight token', () => {
      const token = t.fontWeight();
      expect(token.type).toBe('fontWeight');
      expect(token.defaultValue).toBeUndefined();
    });

    it('supports numeric weight default', () => {
      const token = t.fontWeight().default(700);
      expect(token.defaultValue).toBe(700);
    });

    it('supports keyword weight default', () => {
      const token = t.fontWeight().default('bold');
      expect(token.defaultValue).toBe('bold');
    });
  });

  describe('t.shadow()', () => {
    it('creates a shadow token', () => {
      const token = t.shadow();
      expect(token.type).toBe('shadow');
      expect(token.defaultValue).toBeUndefined();
    });

    it('supports box-shadow default', () => {
      const token = t.shadow().default('0 4px 6px -1px rgba(0, 0, 0, 0.1)');
      expect(token.defaultValue).toBe('0 4px 6px -1px rgba(0, 0, 0, 0.1)');
    });

    it('supports none default', () => {
      const token = t.shadow().default('none');
      expect(token.defaultValue).toBe('none');
    });
  });

  describe('t.url()', () => {
    it('creates a url token', () => {
      const token = t.url();
      expect(token.type).toBe('url');
      expect(token.defaultValue).toBeUndefined();
    });

    it('supports https URL default', () => {
      const token = t.url().default('https://example.com/image.png');
      expect(token.defaultValue).toBe('https://example.com/image.png');
    });

    it('supports relative URL default', () => {
      const token = t.url().default('/images/logo.png');
      expect(token.defaultValue).toBe('/images/logo.png');
    });
  });

  describe('Immutability', () => {
    it('chaining creates new instances', () => {
      const base = t.color();
      const withDefault = base.default('#fff');
      const withDescription = base.describe('test');

      expect(base.defaultValue).toBeUndefined();
      expect(base.description).toBeUndefined();
      expect(withDefault.defaultValue).toBe('#fff');
      expect(withDefault.description).toBeUndefined();
      expect(withDescription.defaultValue).toBeUndefined();
      expect(withDescription.description).toBe('test');
    });
  });
});
