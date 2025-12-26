'use client';

import { useState } from 'react';
import { Card } from './card';

type NodeId =
  | 'start'
  | 'light-dark'
  | 'brand-themes'
  | 'dynamic-themes'
  | 'result-not-needed'
  | 'result-core-static'
  | 'result-core-light-dark'
  | 'result-react'
  | 'result-next'
  | 'result-core-only';

interface TreeNode {
  id: NodeId;
  question?: string;
  options?: { label: string; next: NodeId }[];
  result?: {
    title: string;
    description: string;
    package: string;
    cta?: { label: string; href: string };
  };
}

const tree: Record<NodeId, TreeNode> = {
  start: {
    id: 'start',
    question: 'What kind of theming do you need?',
    options: [
      { label: 'Just light/dark mode', next: 'light-dark' },
      { label: 'Multiple brand themes (known at build time)', next: 'brand-themes' },
      { label: 'Dynamic themes (per-tenant, from API, user-configurable)', next: 'dynamic-themes' },
    ],
  },
  'light-dark': {
    id: 'light-dark',
    question: 'Do you need type-safe theme tokens with TypeScript inference?',
    options: [
      { label: 'Yes, I want full type safety', next: 'result-core-light-dark' },
      { label: 'No, just basic theme switching', next: 'result-not-needed' },
    ],
  },
  'brand-themes': {
    id: 'brand-themes',
    question: 'How many themes do you have?',
    options: [
      { label: '2-5 static themes', next: 'result-core-static' },
      { label: 'Many themes or might grow', next: 'result-react' },
    ],
  },
  'dynamic-themes': {
    id: 'dynamic-themes',
    question: "What's your framework?",
    options: [
      { label: 'Next.js (with middleware support)', next: 'result-next' },
      { label: 'React (Remix, Vite, Gatsby, etc.)', next: 'result-react' },
      { label: 'Vue, Svelte, or vanilla JS', next: 'result-core-only' },
    ],
  },
  'result-not-needed': {
    id: 'result-not-needed',
    result: {
      title: 'You might not need Livery',
      description:
        'For basic light/dark mode, simpler solutions may suffice. Try CSS prefers-color-scheme, next-themes, or Tailwind\'s dark: variant.',
      package: 'None required',
      cta: { label: 'Still curious? Read the docs', href: '/docs' },
    },
  },
  'result-core-light-dark': {
    id: 'result-core-light-dark',
    result: {
      title: 'Use @livery/core',
      description:
        'Define your light and dark themes with a type-safe schema. Use toCssStringAll() to generate CSS for both themes at build time. Toggle via CSS class or attribute.',
      package: '@livery/core',
      cta: { label: 'Get started with core', href: '/docs/core' },
    },
  },
  'result-core-static': {
    id: 'result-core-static',
    result: {
      title: 'Use @livery/core',
      description:
        'Define your themes with a type-safe schema. Bundle all themes and use toCssStringAll() to generate CSS with selectors. Switch themes by changing a data attribute.',
      package: '@livery/core',
      cta: { label: 'Get started with core', href: '/docs/core' },
    },
  },
  'result-react': {
    id: 'result-react',
    result: {
      title: 'Use @livery/react',
      description:
        'Full React integration with DynamicThemeProvider, hooks, and automatic CSS injection. Create a resolver to fetch themes from your API or database. Includes caching and validation.',
      package: '@livery/react',
      cta: { label: 'Get started with React', href: '/docs/react' },
    },
  },
  'result-next': {
    id: 'result-next',
    result: {
      title: 'Use @livery/next',
      description:
        'Next.js integration with middleware for tenant detection, server-side theme resolution, and hydration-safe rendering. Prevents flash of wrong theme on page load.',
      package: '@livery/next',
      cta: { label: 'Get started with Next.js', href: '/docs/next' },
    },
  },
  'result-core-only': {
    id: 'result-core-only',
    result: {
      title: 'Use @livery/core',
      description:
        'Framework-agnostic core with zero dependencies. Use createResolver() for fetching/caching and toCssString() for CSS generation. Build your own provider or inject CSS directly.',
      package: '@livery/core',
      cta: { label: 'Get started with core', href: '/docs/core' },
    },
  },
};

export function DecisionTree() {
  const [currentNode, setCurrentNode] = useState<NodeId>('start');
  const [history, setHistory] = useState<NodeId[]>([]);

  const node = tree[currentNode];

  const handleSelect = (next: NodeId) => {
    setHistory([...history, currentNode]);
    setCurrentNode(next);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const previous = newHistory.pop()!;
      setHistory(newHistory);
      setCurrentNode(previous);
    }
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentNode('start');
  };

  return (
    <section className="py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-text mb-4">Which package do you need?</h2>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Answer a few questions to find the right integration for your use case.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          {node.question && (
            <>
              <h3 className="text-xl font-medium text-text mb-6">{node.question}</h3>
              <div className="space-y-3">
                {node.options?.map((option) => (
                  <button
                    key={option.next}
                    onClick={() => handleSelect(option.next)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-border hover:border-border-hover dark:hover:border-border-hover hover:bg-surface transition-colors text-text"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {node.result && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary dark:bg-white mb-4">
                <svg
                  className="h-6 w-6 text-white dark:text-text"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">{node.result.title}</h3>
              <p className="text-text-muted mb-4">{node.result.description}</p>
              {node.result.package !== 'None required' && (
                <code className="inline-block px-3 py-1 rounded bg-surface-hover dark:bg-surface text-sm text-text mb-6">
                  npm install {node.result.package}
                </code>
              )}
              {node.result.cta && (
                <div className="mt-4">
                  <a
                    href={node.result.cta.href}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary dark:bg-white text-white dark:text-text font-medium hover:opacity-90 transition-opacity"
                  >
                    {node.result.cta.label}
                  </a>
                </div>
              )}
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <button
                onClick={handleBack}
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleReset}
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                Start over
              </button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
