/**
 * Custom Shiki theme for Livery documentation
 * Comprehensive neutral blue/gray color palette
 */
export const liveryLightTheme = {
  name: 'livery-light',
  type: 'light' as const,
  settings: [],
  colors: {
    'editor.background': '#fafafa',
    'editor.foreground': '#171717',
  },
  tokenColors: [
    // Comments - darker gray for better contrast
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#6b7280', fontStyle: 'italic' },
    },

    // ===== KEYWORDS =====
    // Storage keywords (const, let, var, function, class, etc.)
    {
      scope: [
        'storage',
        'storage.type',
        'storage.modifier',
        'keyword.control.export',
        'keyword.control.import',
        'keyword.control.from',
        'keyword.control.default',
      ],
      settings: { foreground: '#7c3aed' }, // violet-600
    },
    // Control flow keywords (if, else, return, etc.)
    {
      scope: [
        'keyword.control',
        'keyword.control.conditional',
        'keyword.control.loop',
        'keyword.control.flow',
        'keyword.control.trycatch',
      ],
      settings: { foreground: '#7c3aed' }, // violet-600
    },
    // Other keywords
    {
      scope: [
        'keyword',
        'keyword.operator.new',
        'keyword.operator.expression',
        'keyword.operator.logical',
        'keyword.operator.typeof',
        'keyword.operator.instanceof',
      ],
      settings: { foreground: '#7c3aed' }, // violet-600
    },
    // Async/await
    {
      scope: ['storage.modifier.async', 'keyword.control.flow.await'],
      settings: { foreground: '#7c3aed' }, // violet-600
    },

    // ===== TYPES =====
    // Type annotations and interfaces
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'support.type',
        'support.class',
        'meta.type.annotation',
        'entity.name.type.alias',
        'entity.name.type.interface',
        'entity.name.type.enum',
        'entity.name.type.module',
      ],
      settings: { foreground: '#0891b2' }, // cyan-600
    },
    // Built-in types (string, number, boolean, etc.)
    {
      scope: [
        'support.type.builtin',
        'support.type.primitive',
        'keyword.type',
      ],
      settings: { foreground: '#0891b2' }, // cyan-600
    },
    // Type parameters (generics)
    {
      scope: ['entity.name.type.parameter', 'meta.type.parameters'],
      settings: { foreground: '#0891b2' }, // cyan-600
    },

    // ===== FUNCTIONS =====
    {
      scope: [
        'entity.name.function',
        'support.function',
        'meta.function-call entity.name.function',
        'meta.method-call entity.name.function',
      ],
      settings: { foreground: '#2563eb' }, // blue-600
    },
    // Method names
    {
      scope: ['entity.name.function.member', 'meta.method.declaration entity.name.function'],
      settings: { foreground: '#2563eb' }, // blue-600
    },

    // ===== STRINGS =====
    {
      scope: ['string', 'string.quoted', 'string.template', 'string.quoted.single', 'string.quoted.double'],
      settings: { foreground: '#059669' }, // emerald-600
    },
    // Template literal expressions
    {
      scope: ['meta.template.expression', 'punctuation.definition.template-expression'],
      settings: { foreground: '#171717' },
    },

    // ===== NUMBERS & CONSTANTS =====
    {
      scope: ['constant.numeric', 'constant.language', 'constant.other'],
      settings: { foreground: '#d97706' }, // amber-600
    },
    // Boolean and null
    {
      scope: ['constant.language.boolean', 'constant.language.null', 'constant.language.undefined'],
      settings: { foreground: '#d97706' }, // amber-600
    },

    // ===== VARIABLES =====
    // Variable declarations
    {
      scope: ['variable.other.constant', 'variable.other.readwrite'],
      settings: { foreground: '#171717' },
    },
    // Parameters
    {
      scope: ['variable.parameter', 'meta.parameter'],
      settings: { foreground: '#525252' }, // neutral-600
    },
    // Object properties (keys)
    {
      scope: [
        'variable.other.property',
        'support.variable.property',
        'meta.object-literal.key',
        'entity.name.tag.yaml',
        'support.type.property-name',
      ],
      settings: { foreground: '#dc2626' }, // red-600
    },
    // Property access
    {
      scope: ['variable.other.object.property', 'meta.property.object'],
      settings: { foreground: '#171717' },
    },

    // ===== PUNCTUATION =====
    {
      scope: ['punctuation', 'meta.brace', 'meta.bracket'],
      settings: { foreground: '#737373' }, // neutral-500
    },
    // Operators
    {
      scope: ['keyword.operator', 'punctuation.accessor', 'keyword.operator.assignment'],
      settings: { foreground: '#525252' }, // neutral-600
    },
    // Arrow function
    {
      scope: ['storage.type.function.arrow', 'punctuation.definition.arrow'],
      settings: { foreground: '#7c3aed' }, // violet-600
    },

    // ===== JSX/TSX =====
    // Tags
    {
      scope: ['entity.name.tag', 'support.tag', 'punctuation.definition.tag'],
      settings: { foreground: '#dc2626' }, // red-600
    },
    // Component tags (capitalized)
    {
      scope: ['support.class.component', 'entity.name.tag support.class.component'],
      settings: { foreground: '#0891b2' }, // cyan-600
    },
    // Attributes
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#7c3aed' }, // violet-600
    },
    // Attribute values (strings in JSX)
    {
      scope: ['string.quoted.double.tsx', 'string.quoted.double.jsx'],
      settings: { foreground: '#059669' }, // emerald-600
    },

    // ===== CSS =====
    // At-rules (@theme, @import, @media, etc.)
    {
      scope: [
        'keyword.control.at-rule',
        'entity.name.tag.at-rule',
        'punctuation.definition.keyword',
        'keyword.control.at-rule.theme',
        'keyword.control.at-rule.import',
        'keyword.control.at-rule.media',
        'keyword.control.at-rule.tailwind',
      ],
      settings: { foreground: '#7c3aed' }, // violet-600
    },
    // CSS selectors
    {
      scope: ['entity.name.selector', 'entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css'],
      settings: { foreground: '#0891b2' }, // cyan-600
    },
    // CSS properties
    {
      scope: ['support.type.property-name.css', 'meta.property-name'],
      settings: { foreground: '#dc2626' }, // red-600
    },
    // CSS values
    {
      scope: ['support.constant.property-value.css', 'meta.property-value.css', 'support.constant.color'],
      settings: { foreground: '#059669' }, // emerald-600
    },
    // CSS variables
    {
      scope: ['variable.css', 'variable.argument.css', 'support.type.custom-property'],
      settings: { foreground: '#2563eb' }, // blue-600
    },
    // CSS functions (var, calc, etc.)
    {
      scope: ['support.function.misc.css', 'support.function.var'],
      settings: { foreground: '#2563eb' }, // blue-600
    },

    // ===== JSON =====
    {
      scope: ['support.type.property-name.json'],
      settings: { foreground: '#dc2626' }, // red-600
    },

    // ===== MARKDOWN =====
    {
      scope: ['markup.heading', 'entity.name.section'],
      settings: { foreground: '#171717', fontStyle: 'bold' },
    },
    {
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' },
    },
    {
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      scope: ['markup.inline.raw', 'markup.fenced_code'],
      settings: { foreground: '#059669' },
    },

    // ===== REGEX =====
    {
      scope: ['string.regexp'],
      settings: { foreground: '#d97706' }, // amber-600
    },

    // ===== IMPORTS =====
    {
      scope: ['meta.import variable.other.readwrite.alias', 'meta.import variable.other.readwrite'],
      settings: { foreground: '#171717' },
    },
  ],
};

export const liveryDarkTheme = {
  name: 'livery-dark',
  type: 'dark' as const,
  settings: [],
  colors: {
    'editor.background': '#171717',
    'editor.foreground': '#e5e5e5',
  },
  tokenColors: [
    // Comments - brighter gray for better contrast
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#9ca3af', fontStyle: 'italic' },
    },

    // ===== KEYWORDS =====
    // Storage keywords (const, let, var, function, class, etc.)
    {
      scope: [
        'storage',
        'storage.type',
        'storage.modifier',
        'keyword.control.export',
        'keyword.control.import',
        'keyword.control.from',
        'keyword.control.default',
      ],
      settings: { foreground: '#a78bfa' }, // violet-400
    },
    // Control flow keywords (if, else, return, etc.)
    {
      scope: [
        'keyword.control',
        'keyword.control.conditional',
        'keyword.control.loop',
        'keyword.control.flow',
        'keyword.control.trycatch',
      ],
      settings: { foreground: '#a78bfa' }, // violet-400
    },
    // Other keywords
    {
      scope: [
        'keyword',
        'keyword.operator.new',
        'keyword.operator.expression',
        'keyword.operator.logical',
        'keyword.operator.typeof',
        'keyword.operator.instanceof',
      ],
      settings: { foreground: '#a78bfa' }, // violet-400
    },
    // Async/await
    {
      scope: ['storage.modifier.async', 'keyword.control.flow.await'],
      settings: { foreground: '#a78bfa' }, // violet-400
    },

    // ===== TYPES =====
    // Type annotations and interfaces
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'support.type',
        'support.class',
        'meta.type.annotation',
        'entity.name.type.alias',
        'entity.name.type.interface',
        'entity.name.type.enum',
        'entity.name.type.module',
      ],
      settings: { foreground: '#22d3ee' }, // cyan-400
    },
    // Built-in types (string, number, boolean, etc.)
    {
      scope: [
        'support.type.builtin',
        'support.type.primitive',
        'keyword.type',
      ],
      settings: { foreground: '#22d3ee' }, // cyan-400
    },
    // Type parameters (generics)
    {
      scope: ['entity.name.type.parameter', 'meta.type.parameters'],
      settings: { foreground: '#22d3ee' }, // cyan-400
    },

    // ===== FUNCTIONS =====
    {
      scope: [
        'entity.name.function',
        'support.function',
        'meta.function-call entity.name.function',
        'meta.method-call entity.name.function',
      ],
      settings: { foreground: '#60a5fa' }, // blue-400
    },
    // Method names
    {
      scope: ['entity.name.function.member', 'meta.method.declaration entity.name.function'],
      settings: { foreground: '#60a5fa' }, // blue-400
    },

    // ===== STRINGS =====
    {
      scope: ['string', 'string.quoted', 'string.template', 'string.quoted.single', 'string.quoted.double'],
      settings: { foreground: '#34d399' }, // emerald-400
    },
    // Template literal expressions
    {
      scope: ['meta.template.expression', 'punctuation.definition.template-expression'],
      settings: { foreground: '#e5e5e5' },
    },

    // ===== NUMBERS & CONSTANTS =====
    {
      scope: ['constant.numeric', 'constant.language', 'constant.other'],
      settings: { foreground: '#fbbf24' }, // amber-400
    },
    // Boolean and null
    {
      scope: ['constant.language.boolean', 'constant.language.null', 'constant.language.undefined'],
      settings: { foreground: '#fbbf24' }, // amber-400
    },

    // ===== VARIABLES =====
    // Variable declarations
    {
      scope: ['variable.other.constant', 'variable.other.readwrite'],
      settings: { foreground: '#e5e5e5' },
    },
    // Parameters
    {
      scope: ['variable.parameter', 'meta.parameter'],
      settings: { foreground: '#d4d4d4' }, // neutral-300
    },
    // Object properties (keys)
    {
      scope: [
        'variable.other.property',
        'support.variable.property',
        'meta.object-literal.key',
        'entity.name.tag.yaml',
        'support.type.property-name',
      ],
      settings: { foreground: '#f87171' }, // red-400
    },
    // Property access
    {
      scope: ['variable.other.object.property', 'meta.property.object'],
      settings: { foreground: '#e5e5e5' },
    },

    // ===== PUNCTUATION =====
    {
      scope: ['punctuation', 'meta.brace', 'meta.bracket'],
      settings: { foreground: '#a3a3a3' }, // neutral-400
    },
    // Operators
    {
      scope: ['keyword.operator', 'punctuation.accessor', 'keyword.operator.assignment'],
      settings: { foreground: '#d4d4d4' }, // neutral-300
    },
    // Arrow function
    {
      scope: ['storage.type.function.arrow', 'punctuation.definition.arrow'],
      settings: { foreground: '#a78bfa' }, // violet-400
    },

    // ===== JSX/TSX =====
    // Tags
    {
      scope: ['entity.name.tag', 'support.tag', 'punctuation.definition.tag'],
      settings: { foreground: '#f87171' }, // red-400
    },
    // Component tags (capitalized)
    {
      scope: ['support.class.component', 'entity.name.tag support.class.component'],
      settings: { foreground: '#22d3ee' }, // cyan-400
    },
    // Attributes
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#a78bfa' }, // violet-400
    },
    // Attribute values (strings in JSX)
    {
      scope: ['string.quoted.double.tsx', 'string.quoted.double.jsx'],
      settings: { foreground: '#34d399' }, // emerald-400
    },

    // ===== CSS =====
    // At-rules (@theme, @import, @media, etc.)
    {
      scope: [
        'keyword.control.at-rule',
        'entity.name.tag.at-rule',
        'punctuation.definition.keyword',
        'keyword.control.at-rule.theme',
        'keyword.control.at-rule.import',
        'keyword.control.at-rule.media',
        'keyword.control.at-rule.tailwind',
      ],
      settings: { foreground: '#a78bfa' }, // violet-400
    },
    // CSS selectors
    {
      scope: ['entity.name.selector', 'entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css'],
      settings: { foreground: '#22d3ee' }, // cyan-400
    },
    // CSS properties
    {
      scope: ['support.type.property-name.css', 'meta.property-name'],
      settings: { foreground: '#f87171' }, // red-400
    },
    // CSS values
    {
      scope: ['support.constant.property-value.css', 'meta.property-value.css', 'support.constant.color'],
      settings: { foreground: '#34d399' }, // emerald-400
    },
    // CSS variables
    {
      scope: ['variable.css', 'variable.argument.css', 'support.type.custom-property'],
      settings: { foreground: '#60a5fa' }, // blue-400
    },
    // CSS functions (var, calc, etc.)
    {
      scope: ['support.function.misc.css', 'support.function.var'],
      settings: { foreground: '#60a5fa' }, // blue-400
    },

    // ===== JSON =====
    {
      scope: ['support.type.property-name.json'],
      settings: { foreground: '#f87171' }, // red-400
    },

    // ===== MARKDOWN =====
    {
      scope: ['markup.heading', 'entity.name.section'],
      settings: { foreground: '#e5e5e5', fontStyle: 'bold' },
    },
    {
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' },
    },
    {
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      scope: ['markup.inline.raw', 'markup.fenced_code'],
      settings: { foreground: '#34d399' },
    },

    // ===== REGEX =====
    {
      scope: ['string.regexp'],
      settings: { foreground: '#fbbf24' }, // amber-400
    },

    // ===== IMPORTS =====
    {
      scope: ['meta.import variable.other.readwrite.alias', 'meta.import variable.other.readwrite'],
      settings: { foreground: '#e5e5e5' },
    },
  ],
};
