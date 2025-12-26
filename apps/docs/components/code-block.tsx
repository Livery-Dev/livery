'use client';

import { Highlight } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  language: 'typescript' | 'tsx' | 'css' | 'javascript' | 'jsx';
  className?: string;
}

/**
 * CodeBlock Component
 * Renders syntax-highlighted code using prism-react-renderer
 * Uses CSS variables from the Livery theme for dynamic syntax highlighting
 */
export function CodeBlock({ code, language, className = '' }: CodeBlockProps) {
  return (
    <Highlight theme={liveryTheme} code={code.trim()} language={language}>
      {({ className: preClassName, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${preClassName} ${className} p-4 text-sm overflow-x-auto`}
          style={{ backgroundColor: 'var(--syntax-background)', color: 'var(--syntax-text)' }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

/**
 * Dynamic syntax highlighting theme using CSS variables
 * Colors are controlled by the active Livery theme
 */
const liveryTheme = {
  plain: {
    color: 'var(--syntax-text)',
    backgroundColor: 'var(--syntax-background)',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: 'var(--syntax-comment)',
        fontStyle: 'italic' as const,
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['string', 'attr-value', 'template-string'],
      style: {
        color: 'var(--syntax-string)',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: 'var(--syntax-punctuation)',
      },
    },
    {
      types: [
        'entity',
        'url',
        'symbol',
        'number',
        'boolean',
        'variable',
        'constant',
        'regex',
        'inserted',
      ],
      style: {
        color: 'var(--syntax-value)',
      },
    },
    {
      types: ['atrule', 'keyword', 'attr-name'],
      style: {
        color: 'var(--syntax-keyword)',
      },
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: {
        color: 'var(--syntax-function)',
      },
    },
    {
      types: ['function-variable'],
      style: {
        color: 'var(--syntax-function)',
      },
    },
    {
      types: ['selector', 'class-name'],
      style: {
        color: 'var(--syntax-keyword)',
      },
    },
    {
      types: ['property'],
      style: {
        color: 'var(--syntax-property)',
      },
    },
    {
      types: ['builtin', 'char'],
      style: {
        color: 'var(--syntax-property)',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold' as const,
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic' as const,
      },
    },
  ],
};
