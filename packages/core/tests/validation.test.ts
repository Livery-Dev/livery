import { describe, it, expect } from 'vitest';
import { createSchema } from '../src/schema/index';
import { t } from '../src/schema/tokens';
import { validate, validatePartial, coerce } from '../src/validation/index';

describe('validate (strict mode)', () => {
  const schema = createSchema({
    definition: {
      colors: {
        primary: t.color(),
        secondary: t.color().default('#666666'),
      },
      spacing: {
        sm: t.dimension(),
      },
      opacity: t.number(),
    },
  });

  it('validates correct data', () => {
    const result = validate({
      schema,
      data: {
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
        },
        spacing: {
          sm: '4px',
        },
        opacity: 0.5,
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.colors.primary).toBe('#3b82f6');
      expect(result.data.spacing.sm).toBe('4px');
      expect(result.data.opacity).toBe(0.5);
    }
  });

  it('uses default values for missing optional fields', () => {
    const result = validate({
      schema,
      data: {
        colors: {
          primary: '#3b82f6',
          // secondary has default
        },
        spacing: {
          sm: '4px',
        },
        opacity: 1,
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.colors.secondary).toBe('#666666');
    }
  });

  it('returns errors for missing required fields', () => {
    const result = validate({
      schema,
      data: {
        colors: {
          // primary is missing (no default)
          secondary: '#666666',
        },
        spacing: {
          sm: '4px',
        },
        opacity: 1,
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.path === 'colors.primary')).toBe(true);
    }
  });

  it('returns errors for invalid values', () => {
    const result = validate({
      schema,
      data: {
        colors: {
          primary: 'not-a-color',
          secondary: '#666666',
        },
        spacing: {
          sm: '4px',
        },
        opacity: 1,
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.path === 'colors.primary')).toBe(true);
    }
  });

  it('returns errors for wrong types', () => {
    const result = validate({
      schema,
      data: {
        colors: {
          primary: '#3b82f6',
          secondary: '#666666',
        },
        spacing: {
          sm: '4px',
        },
        opacity: 'not a number',
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.path === 'opacity')).toBe(true);
    }
  });

  it('returns multiple errors', () => {
    const result = validate({
      schema,
      data: {
        colors: {
          primary: 'invalid',
          secondary: 123, // wrong type
        },
        spacing: {
          sm: 'invalid',
        },
        opacity: 'invalid',
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('handles null data', () => {
    const result = validate({ schema, data: null });
    expect(result.success).toBe(false);
  });

  it('handles undefined nested groups', () => {
    const result = validate({
      schema,
      data: {
        // colors is missing entirely
        spacing: {
          sm: '4px',
        },
        opacity: 1,
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.path === 'colors.primary')).toBe(true);
    }
  });

  it('rejects non-object values for nested groups', () => {
    const result = validate({
      schema,
      data: {
        colors: 'not-an-object', // should be an object
        spacing: {
          sm: '4px',
        },
        opacity: 1,
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.path === 'colors')).toBe(true);
      expect(result.errors.some((e) => e.message === 'expected object for nested group')).toBe(true);
    }
  });

  it('rejects null values for nested groups', () => {
    const result = validate({
      schema,
      data: {
        colors: null, // should be an object
        spacing: {
          sm: '4px',
        },
        opacity: 1,
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.path === 'colors')).toBe(true);
    }
  });
});

describe('validatePartial', () => {
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

  it('allows missing fields', () => {
    const result = validatePartial({
      schema,
      data: {
        colors: {
          primary: '#3b82f6',
          // secondary is missing but OK in partial mode
        },
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.colors?.primary).toBe('#3b82f6');
    }
  });

  it('allows empty object', () => {
    const result = validatePartial({ schema, data: {} });
    expect(result.success).toBe(true);
  });

  it('still validates present values', () => {
    const result = validatePartial({
      schema,
      data: {
        colors: {
          primary: 'not-a-color',
        },
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.path === 'colors.primary')).toBe(true);
    }
  });

  it('validates only provided nested groups', () => {
    const result = validatePartial({
      schema,
      data: {
        spacing: {
          sm: '4px',
        },
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.spacing?.sm).toBe('4px');
      expect(result.data.colors).toBeUndefined();
    }
  });
});

describe('coerce', () => {
  const schema = createSchema({
    definition: {
      count: t.number(),
      enabled: t.boolean(),
      label: t.string(),
      size: t.dimension(),
    },
  });

  it('coerces string to number', () => {
    const result = coerce({
      schema,
      data: {
        count: '42',
        enabled: true,
        label: 'test',
        size: '16px',
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.count).toBe(42);
    }
  });

  it('coerces string to boolean', () => {
    const result = coerce({
      schema,
      data: {
        count: 1,
        enabled: 'true',
        label: 'test',
        size: '16px',
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.enabled).toBe(true);
    }
  });

  it('coerces number to dimension', () => {
    const result = coerce({
      schema,
      data: {
        count: 1,
        enabled: true,
        label: 'test',
        size: 16, // should become '16px'
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.size).toBe('16px');
    }
  });

  it('coerces number to string', () => {
    const result = coerce({
      schema,
      data: {
        count: 1,
        enabled: true,
        label: 123, // should become '123'
        size: '16px',
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.label).toBe('123');
    }
  });

  it('still rejects non-coercible values', () => {
    const result = coerce({
      schema,
      data: {
        count: 'not-a-number',
        enabled: true,
        label: 'test',
        size: '16px',
      },
    });

    expect(result.success).toBe(false);
  });

  it('uses defaults when values are missing', () => {
    const schemaWithDefaults = createSchema({
      definition: {
        count: t.number().default(0),
      },
    });

    const result = coerce({ schema: schemaWithDefaults, data: {} });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.count).toBe(0);
    }
  });
});

describe('Complex schemas', () => {
  const complexSchema = createSchema({
    definition: {
      brand: {
        colors: {
          primary: t.color(),
          secondary: t.color().default('#666'),
          accent: t.color().default('#f00'),
        },
        typography: {
          fontFamily: t.fontFamily().default('Inter'),
          weights: {
            normal: t.fontWeight().default(400),
            bold: t.fontWeight().default(700),
          },
        },
      },
      layout: {
        spacing: {
          xs: t.dimension().default('4px'),
          sm: t.dimension().default('8px'),
          md: t.dimension().default('16px'),
        },
        borderRadius: t.dimension().default('4px'),
      },
      features: {
        darkMode: t.boolean().default(false),
        animations: t.boolean().default(true),
      },
    },
  });

  it('validates complex nested structure', () => {
    const result = validate({
      schema: complexSchema,
      data: {
        brand: {
          colors: {
            primary: '#3b82f6',
          },
          typography: {
            fontFamily: 'Roboto, sans-serif',
            weights: {
              normal: 400,
              bold: 700,
            },
          },
        },
        layout: {
          spacing: {
            xs: '2px',
            sm: '4px',
            md: '8px',
          },
          borderRadius: '8px',
        },
        features: {
          darkMode: true,
          animations: true,
        },
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.brand.colors.primary).toBe('#3b82f6');
      expect(result.data.brand.colors.secondary).toBe('#666');
      expect(result.data.brand.typography.fontFamily).toBe('Roboto, sans-serif');
    }
  });

  it('applies defaults at all levels', () => {
    const result = validate({
      schema: complexSchema,
      data: {
        brand: {
          colors: {
            primary: '#3b82f6',
          },
          typography: {},
        },
        layout: {},
        features: {},
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.brand.colors.secondary).toBe('#666');
      expect(result.data.brand.colors.accent).toBe('#f00');
      expect(result.data.brand.typography.fontFamily).toBe('Inter');
      expect(result.data.brand.typography.weights.normal).toBe(400);
      expect(result.data.layout.spacing.xs).toBe('4px');
      expect(result.data.layout.borderRadius).toBe('4px');
      expect(result.data.features.darkMode).toBe(false);
      expect(result.data.features.animations).toBe(true);
    }
  });
});
