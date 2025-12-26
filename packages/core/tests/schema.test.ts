import { describe, it, expect } from 'vitest';
import {
  createSchema,
  getTokenPaths,
  getTokenAtPath,
  isSchema,
  isTokenDefinition,
  isSchemaDefinition,
} from '../src/schema/index';
import { t } from '../src/schema/tokens';

describe('createSchema', () => {
  it('creates a schema from a simple definition', () => {
    const schema = createSchema({
      definition: {
        primary: t.color(),
      },
    });

    expect(isSchema(schema)).toBe(true);
    expect(schema.definition.primary.type).toBe('color');
  });

  it('creates a schema with nested groups', () => {
    const schema = createSchema({
      definition: {
        colors: {
          primary: t.color(),
          secondary: t.color(),
        },
        spacing: {
          sm: t.dimension(),
          md: t.dimension(),
          lg: t.dimension(),
        },
      },
    });

    expect(isSchema(schema)).toBe(true);
    expect(schema.definition.colors.primary.type).toBe('color');
    expect(schema.definition.spacing.md.type).toBe('dimension');
  });

  it('creates a schema with deeply nested groups', () => {
    const schema = createSchema({
      definition: {
        typography: {
          heading: {
            fontSize: t.dimension(),
            fontWeight: t.fontWeight(),
          },
          body: {
            fontSize: t.dimension(),
            lineHeight: t.number(),
          },
        },
      },
    });

    expect(isSchema(schema)).toBe(true);
    expect(schema.definition.typography.heading.fontSize.type).toBe('dimension');
    expect(schema.definition.typography.body.lineHeight.type).toBe('number');
  });

  it('preserves default values', () => {
    const schema = createSchema({
      definition: {
        colors: {
          primary: t.color().default('#3b82f6'),
          background: t.color().default('#ffffff'),
        },
      },
    });

    expect(schema.definition.colors.primary.defaultValue).toBe('#3b82f6');
    expect(schema.definition.colors.background.defaultValue).toBe('#ffffff');
  });

  it('preserves descriptions', () => {
    const schema = createSchema({
      definition: {
        colors: {
          primary: t.color().describe('Main brand color'),
        },
      },
    });

    expect(schema.definition.colors.primary.description).toBe('Main brand color');
  });

  it('creates a frozen schema object', () => {
    const schema = createSchema({
      definition: {
        color: t.color(),
      },
    });

    expect(Object.isFrozen(schema)).toBe(true);
  });

  it('throws for invalid definition structure', () => {
    expect(() => {
      createSchema({
        definition: {
          // @ts-expect-error - testing invalid input
          invalid: 'not a token',
        },
      });
    }).toThrow();
  });

  it('throws for null definition', () => {
    expect(() => {
      // @ts-expect-error - testing invalid input
      createSchema({ definition: null });
    }).toThrow();
  });
});

describe('getTokenPaths', () => {
  it('returns paths for flat schema', () => {
    const schema = createSchema({
      definition: {
        primary: t.color(),
        secondary: t.color(),
      },
    });

    const paths = getTokenPaths({ definition: schema.definition });
    expect(paths).toEqual(['primary', 'secondary']);
  });

  it('returns dot-notation paths for nested schema', () => {
    const schema = createSchema({
      definition: {
        colors: {
          primary: t.color(),
          secondary: t.color(),
        },
        spacing: {
          sm: t.dimension(),
        },
      },
    });

    const paths = getTokenPaths({ definition: schema.definition });
    expect(paths).toContain('colors.primary');
    expect(paths).toContain('colors.secondary');
    expect(paths).toContain('spacing.sm');
  });

  it('returns paths for deeply nested schema', () => {
    const schema = createSchema({
      definition: {
        typography: {
          heading: {
            h1: {
              fontSize: t.dimension(),
            },
          },
        },
      },
    });

    const paths = getTokenPaths({ definition: schema.definition });
    expect(paths).toContain('typography.heading.h1.fontSize');
  });

  it('returns empty array for empty schema', () => {
    const schema = createSchema({ definition: {} });
    const paths = getTokenPaths({ definition: schema.definition });
    expect(paths).toEqual([]);
  });
});

describe('getTokenAtPath', () => {
  const schema = createSchema({
    definition: {
      colors: {
        primary: t.color().default('#3b82f6'),
        secondary: t.color(),
      },
      spacing: {
        sm: t.dimension().default('4px'),
      },
    },
  });

  it('returns token at valid path', () => {
    const token = getTokenAtPath({ definition: schema.definition, path: 'colors.primary' });
    expect(token).toBeDefined();
    expect(token?.type).toBe('color');
    expect(token?.defaultValue).toBe('#3b82f6');
  });

  it('returns token at nested path', () => {
    const token = getTokenAtPath({ definition: schema.definition, path: 'spacing.sm' });
    expect(token).toBeDefined();
    expect(token?.type).toBe('dimension');
  });

  it('returns undefined for invalid path', () => {
    const token = getTokenAtPath({ definition: schema.definition, path: 'colors.invalid' });
    expect(token).toBeUndefined();
  });

  it('returns undefined for partial path (group)', () => {
    const token = getTokenAtPath({ definition: schema.definition, path: 'colors' });
    expect(token).toBeUndefined();
  });

  it('returns undefined for empty path', () => {
    const token = getTokenAtPath({ definition: schema.definition, path: '' });
    expect(token).toBeUndefined();
  });
});

describe('Type guards', () => {
  describe('isTokenDefinition', () => {
    it('returns true for color token', () => {
      expect(isTokenDefinition(t.color())).toBe(true);
    });

    it('returns true for dimension token', () => {
      expect(isTokenDefinition(t.dimension())).toBe(true);
    });

    it('returns true for number token', () => {
      expect(isTokenDefinition(t.number())).toBe(true);
    });

    it('returns true for string token', () => {
      expect(isTokenDefinition(t.string())).toBe(true);
    });

    it('returns true for boolean token', () => {
      expect(isTokenDefinition(t.boolean())).toBe(true);
    });

    it('returns true for fontFamily token', () => {
      expect(isTokenDefinition(t.fontFamily())).toBe(true);
    });

    it('returns true for fontWeight token', () => {
      expect(isTokenDefinition(t.fontWeight())).toBe(true);
    });

    it('returns true for shadow token', () => {
      expect(isTokenDefinition(t.shadow())).toBe(true);
    });

    it('returns true for url token', () => {
      expect(isTokenDefinition(t.url())).toBe(true);
    });

    it('returns false for plain object', () => {
      expect(isTokenDefinition({ foo: 'bar' })).toBe(false);
    });

    it('returns false for null', () => {
      expect(isTokenDefinition(null)).toBe(false);
    });

    it('returns false for string', () => {
      expect(isTokenDefinition('color')).toBe(false);
    });
  });

  describe('isSchemaDefinition', () => {
    it('returns true for nested group', () => {
      const group = { primary: t.color() };
      expect(isSchemaDefinition(group)).toBe(true);
    });

    it('returns false for token', () => {
      expect(isSchemaDefinition(t.color())).toBe(false);
    });

    it('returns false for null', () => {
      expect(isSchemaDefinition(null)).toBe(false);
    });

    it('returns false for primitive', () => {
      expect(isSchemaDefinition('test')).toBe(false);
    });
  });

  describe('isSchema', () => {
    it('returns true for created schema', () => {
      const schema = createSchema({ definition: { color: t.color() } });
      expect(isSchema(schema)).toBe(true);
    });

    it('returns false for plain object', () => {
      expect(isSchema({ definition: {} })).toBe(false);
    });

    it('returns false for null', () => {
      expect(isSchema(null)).toBe(false);
    });
  });
});
