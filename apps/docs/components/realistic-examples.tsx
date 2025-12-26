'use client';

import Link from 'next/link';
import { CodeBlock } from './code-block';
import { Card } from './card';

type Language = 'typescript' | 'tsx' | 'css' | 'javascript' | 'jsx';

interface Step {
  step: number;
  title: string;
  description: string;
  code: string;
  language: Language;
}

const steps: Step[] = [
  {
    step: 1,
    title: 'Define Schema',
    description:
      'Describe your theme shape with TypeScript. Livery infers types from your schema automatically.',
    code: `import { createSchema, t, InferTheme } from '@livery/core';

export const schema = createSchema({
  colors: {
    primary: t.color(),
    background: t.color(),
  },
});

type Theme = InferTheme<typeof schema.definition>;`,
    language: 'typescript',
  },
  {
    step: 2,
    title: 'Create Themes',
    description:
      'Define theme objects that match your schema. TypeScript ensures every theme has the right shape.',
    code: `const light: Theme = {
  colors: { primary: '#171717', background: '#FFFFFF' },
};

const dark: Theme = {
  colors: { primary: '#FFFFFF', background: '#0A0A0A' },
};`,
    language: 'typescript',
  },
  {
    step: 3,
    title: 'Map to Tailwind',
    description:
      'Reference Livery CSS variables in your Tailwind config. Works with any CSS framework.',
    code: `@theme {
  --color-primary: var(--colors-primary);
  --color-bg: var(--colors-background);
}`,
    language: 'css',
  },
  {
    step: 4,
    title: 'Use in Components',
    description:
      'Write your styles once using semantic tokens. They work automatically in every theme.',
    code: `<button className="bg-primary text-white">
  Click me
</button>`,
    language: 'tsx',
  },
];

/**
 * RealisticExamples Component
 * Grid layout with visible divider lines
 */
export function RealisticExamples() {
  return (
    <section className="py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-text mb-4">
          How You&apos;ll Actually Use Livery
        </h2>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Four steps to type-safe, dynamic theming.
        </p>
      </div>

      {/* Grid with visible lines */}
      <Card className="p-0 border border-border rounded-xl overflow-hidden">
        {steps.map((step, index) => (
          <div key={step.step}>
            {/* Row */}
            <div className="grid md:grid-cols-2">
              {/* Left: Text content */}
              <div className="p-8 md:border-r border-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-white text-white dark:text-text text-sm font-bold shrink-0">
                    {step.step}
                  </span>
                  <h3 className="font-semibold text-text text-lg">{step.title}</h3>
                </div>
                <p className="text-text-muted">{step.description}</p>
              </div>

              {/* Right: Code block */}
              <div className="p-8 border-t md:border-t-0 border-border overflow-hidden">
                <div className="rounded-xl overflow-hidden max-w-full">
                  <CodeBlock code={step.code} language={step.language} />
                </div>
              </div>
            </div>

            {/* Horizontal divider (except after last step) */}
            {index < steps.length - 1 && <div className="border-t border-border" />}
          </div>
        ))}

        {/* Bottom CTA row */}
        <div className="border-t border-border p-8">
          <p className="text-center text-base text-text-muted">
            Livery generates CSS variables from your schema — at build time, on the server, or
            dynamically at runtime. Switch themes instantly with no flash.
          </p>
          <div className="text-center mt-4">
            <Link
              href="/docs/integrations"
              className="inline-flex items-center gap-2 text-text hover:underline font-medium"
            >
              See full integration guides →
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
