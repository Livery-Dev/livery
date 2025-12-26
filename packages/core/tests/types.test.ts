import { describe, it, expectTypeOf } from 'vitest';
import { createSchema } from '../src/schema/index';
import { t } from '../src/schema/tokens';
import type { InferTheme, ThemePath, PathValue } from '../src/types/index';

/**
 * Type-level tests to ensure type inference works correctly
 */

describe('Type Inference', () => {
  describe('InferTheme', () => {
    it('infers correct types for flat schema', () => {
      const schema = createSchema({
        definition: {
          primary: t.color(),
          size: t.dimension(),
          count: t.number(),
          label: t.string(),
          enabled: t.boolean(),
        },
      });

      type Theme = InferTheme<typeof schema.definition>;

      expectTypeOf<Theme['primary']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['size']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['count']>().toEqualTypeOf<number>();
      expectTypeOf<Theme['label']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['enabled']>().toEqualTypeOf<boolean>();
    });

    it('infers correct types for nested schema', () => {
      const schema = createSchema({
        definition: {
          colors: {
            primary: t.color(),
            secondary: t.color(),
          },
          spacing: {
            sm: t.dimension(),
            md: t.dimension(),
          },
        },
      });

      type Theme = InferTheme<typeof schema.definition>;

      expectTypeOf<Theme['colors']>().toEqualTypeOf<{
        primary: string;
        secondary: string;
      }>();

      expectTypeOf<Theme['colors']['primary']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['spacing']['sm']>().toEqualTypeOf<string>();
    });

    it('infers correct types for deeply nested schema', () => {
      const schema = createSchema({
        definition: {
          typography: {
            heading: {
              h1: {
                fontSize: t.dimension(),
                fontWeight: t.fontWeight(),
              },
            },
          },
        },
      });

      type Theme = InferTheme<typeof schema.definition>;

      expectTypeOf<Theme['typography']['heading']['h1']['fontSize']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['typography']['heading']['h1']['fontWeight']>().toEqualTypeOf<
        string | number
      >();
    });

    it('infers all token types correctly', () => {
      const schema = createSchema({
        definition: {
          color: t.color(),
          dimension: t.dimension(),
          number: t.number(),
          string: t.string(),
          boolean: t.boolean(),
          fontFamily: t.fontFamily(),
          fontWeight: t.fontWeight(),
          shadow: t.shadow(),
          url: t.url(),
        },
      });

      type Theme = InferTheme<typeof schema.definition>;

      expectTypeOf<Theme['color']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['dimension']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['number']>().toEqualTypeOf<number>();
      expectTypeOf<Theme['string']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['boolean']>().toEqualTypeOf<boolean>();
      expectTypeOf<Theme['fontFamily']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['fontWeight']>().toEqualTypeOf<string | number>();
      expectTypeOf<Theme['shadow']>().toEqualTypeOf<string>();
      expectTypeOf<Theme['url']>().toEqualTypeOf<string>();
    });
  });

  describe('ThemePath', () => {
    it('generates correct paths for flat schema', () => {
      const schema = createSchema({
        definition: {
          primary: t.color(),
          secondary: t.color(),
        },
      });

      type Paths = ThemePath<typeof schema.definition>;

      expectTypeOf<'primary'>().toMatchTypeOf<Paths>();
      expectTypeOf<'secondary'>().toMatchTypeOf<Paths>();
    });

    it('generates dot-notation paths for nested schema', () => {
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

      type Paths = ThemePath<typeof schema.definition>;

      expectTypeOf<'colors.primary'>().toMatchTypeOf<Paths>();
      expectTypeOf<'colors.secondary'>().toMatchTypeOf<Paths>();
      expectTypeOf<'spacing.sm'>().toMatchTypeOf<Paths>();
    });

    it('generates deeply nested paths', () => {
      const schema = createSchema({
        definition: {
          brand: {
            colors: {
              light: {
                primary: t.color(),
              },
            },
          },
        },
      });

      type Paths = ThemePath<typeof schema.definition>;

      expectTypeOf<'brand.colors.light.primary'>().toMatchTypeOf<Paths>();
    });
  });

  describe('PathValue', () => {
    const schema = createSchema({
      definition: {
        colors: {
          primary: t.color(),
        },
        spacing: {
          sm: t.dimension(),
        },
        count: t.number(),
      },
    });

    it('extracts correct value type at path', () => {
      type PrimaryValue = PathValue<typeof schema.definition, 'colors.primary'>;
      type SpacingValue = PathValue<typeof schema.definition, 'spacing.sm'>;
      type CountValue = PathValue<typeof schema.definition, 'count'>;

      expectTypeOf<PrimaryValue>().toEqualTypeOf<string>();
      expectTypeOf<SpacingValue>().toEqualTypeOf<string>();
      expectTypeOf<CountValue>().toEqualTypeOf<number>();
    });

    it('extracts nested object type for group path', () => {
      type ColorsValue = PathValue<typeof schema.definition, 'colors'>;

      expectTypeOf<ColorsValue>().toEqualTypeOf<{ primary: string }>();
    });
  });

  describe('Schema type safety', () => {
    it('schema definition is correctly typed', () => {
      const schema = createSchema({
        definition: {
          colors: {
            primary: t.color().default('#fff'),
          },
        },
      });

      // The schema should preserve the structure
      expectTypeOf(schema.definition.colors.primary.type).toEqualTypeOf<'color'>();
    });

    it('default values are typed', () => {
      const schema = createSchema({
        definition: {
          count: t.number().default(0),
        },
      });

      expectTypeOf(schema.definition.count.defaultValue).toEqualTypeOf<number | undefined>();
    });
  });
});

describe('Runtime type tests', () => {
  it('theme object matches inferred type', () => {
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

    // This should compile without errors
    const theme: InferTheme<typeof schema.definition> = {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
      },
      spacing: {
        sm: '4px',
      },
    };

    expectTypeOf(theme.colors.primary).toEqualTypeOf<string>();
  });

  it('partial theme is correctly typed', () => {
    const schema = createSchema({
      definition: {
        colors: {
          primary: t.color(),
          secondary: t.color(),
        },
      },
    });

    const partial: Partial<InferTheme<typeof schema.definition>> = {
      colors: {
        primary: '#fff',
        secondary: '#000',
      },
    };

    expectTypeOf(partial.colors).toEqualTypeOf<
      { primary: string; secondary: string } | undefined
    >();
  });
});
