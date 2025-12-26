'use client';

import { Card } from './card';
import { CodeBlock } from './code-block';

const beforeCode = `<div className="
  bg-white dark:bg-slate-900
  text-slate-900 dark:text-white
">
  <button className="
    bg-blue-500 dark:bg-blue-400
    hover:bg-blue-600 dark:hover:bg-blue-500
  ">
    Click me
  </button>
</div>`;

const afterCode = `<div className="bg-background text-foreground">
  <button className="bg-primary hover:bg-primary-hover">
    Click me
  </button>
</div>`;

const problems = [
  'Duplicate styles for every theme variant',
  'Adding a third theme means editing every file',
  'Easy to miss a dark: variant somewhere',
  'No type safety — typos fail silently',
  'Hard to maintain consistency across components',
];

const benefits = [
  'Write styles once, works in every theme',
  'Add new themes without touching components',
  'Full TypeScript inference catches errors',
  'Runtime theme switching with no flash',
  'Scales from light/dark to multi-tenant',
  'Single source of truth for design tokens',
];

/**
 * BeforeAfterComparison Component
 * Grid layout with visible divider lines
 */
export function BeforeAfterComparison() {
  return (
    <section className="py-24">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-text mb-4">The Problem vs The Solution</h2>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Stop duplicating styles for every theme. Use semantic tokens that just work.
        </p>
      </div>

      {/* Grid with visible lines */}
      <Card className="p-0 border border-border rounded-xl overflow-hidden">
        {/* Top row: Without Livery */}
        <div className="grid md:grid-cols-2">
          {/* Left: Text content */}
          <div className="p-8 md:border-r border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-surface-hover dark:bg-surface flex items-center justify-center">
                <span className="text-text-muted text-sm">✗</span>
              </div>
              <h3 className="font-semibold text-text text-lg">Without Livery</h3>
            </div>
            <p className="text-text-muted mb-6">
              Every component needs explicit styles for each theme.
            </p>
            <ul className="space-y-2">
              {problems.map((problem, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                  <span className="text-text-muted mt-0.5">✗</span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Code */}
          <div className="p-8 border-t md:border-t-0 border-border overflow-hidden">
            <div className="rounded-xl overflow-hidden max-w-full">
              <CodeBlock code={beforeCode} language="tsx" />
            </div>
          </div>
        </div>

        {/* Horizontal divider */}
        <div className="border-t border-border" />

        {/* Bottom row: With Livery */}
        <div className="grid md:grid-cols-2">
          {/* Left: Text content */}
          <div className="p-8 md:border-r border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary dark:bg-white flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-white dark:text-text"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-text text-lg">With Livery</h3>
            </div>
            <p className="text-text-muted mb-6">
              Use semantic tokens that Livery resolves for you — at build time, on the server, or at
              runtime. Same markup works for any theme.
            </p>
            <ul className="space-y-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                  <svg
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Code */}
          <div className="p-8 border-t md:border-t-0 border-border overflow-hidden">
            <div className="rounded-xl overflow-hidden max-w-full">
              <CodeBlock code={afterCode} language="tsx" />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
