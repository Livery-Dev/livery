'use client';

import { Card } from './card';
import { CodeBlock } from './code-block';

const resolverCode = `import { createResolver } from '@livery/core';

const resolver = createResolver({
  fetcher: async ({ themeId }) => {
    const res = await fetch(\`/api/themes/\${themeId}\`);
    return res.json();
  },
  cache: { ttl: 60_000 }, // 1 minute
});

const theme = await resolver.resolve({ themeId: 'acme-corp' });`;

const useCases = [
  {
    title: 'Multi-Tenant SaaS',
    description: 'Each customer gets their own brand colors, loaded from your database at runtime.',
    icon: BuildingIcon,
  },
  {
    title: 'User Preferences',
    description: 'Let users customize their experience with validated, type-safe theme options.',
    icon: UserIcon,
  },
  {
    title: 'A/B Testing',
    description: 'Test different visual treatments. Each variant is just a theme object.',
    icon: BeakerIcon,
  },
  {
    title: 'White-Label Products',
    description: "Ship one codebase that adapts to each customer's brand automatically.",
    icon: PaletteIcon,
  },
];

/**
 * BeyondLightDark Component
 * Cal.com-inspired 2x2 feature grid
 */
export function BeyondLightDark() {
  return (
    <section className="py-24">
      {/* Section Header */}
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-text-muted mb-3">Scales With You</p>
        <h2 className="text-3xl font-semibold text-text mb-4">And When You Need More</h2>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Start with light/dark mode. The same schema and type safety scales to multi-tenant,
          white-label, and beyond.
        </p>
      </div>

      {/* 2x2 Feature Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {useCases.map((useCase) => (
          <Card key={useCase.title}>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-surface-hover dark:bg-surface flex items-center justify-center shrink-0">
                <useCase.icon />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-1">{useCase.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{useCase.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Resolver code example */}
      <Card className="p-0 mt-12 border border-border rounded-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left: Text content */}
          <div className="p-8 md:border-r border-border flex flex-col justify-center">
            <h3 className="font-semibold text-text text-lg mb-3">
              Resolvers handle fetching and caching
            </h3>
            <p className="text-text-muted">
              Create a resolver to fetch themes from your API or database. Built-in caching keeps
              things fast, and TypeScript ensures the response matches your schema.
            </p>
          </div>

          {/* Right: Code block */}
          <div className="p-8 border-t md:border-t-0 border-border overflow-hidden">
            <div className="rounded-xl overflow-hidden max-w-full">
              <CodeBlock code={resolverCode} language="typescript" />
            </div>
          </div>
        </div>
      </Card>

      {/* Bottom tagline */}
      <p className="text-center text-sm text-text-muted mt-12">
        Same schema. Same components. Any data source.
      </p>
    </section>
  );
}

// Icons
function BuildingIcon() {
  return (
    <svg
      className="h-5 w-5 text-text-muted dark:text-text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-5 w-5 text-text-muted dark:text-text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function BeakerIcon() {
  return (
    <svg
      className="h-5 w-5 text-text-muted dark:text-text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.628.105a9.065 9.065 0 01-7.014 0l-.628-.105c-1.717-.293-2.3-2.379-1.067-3.61L5 14.5"
      />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg
      className="h-5 w-5 text-text-muted dark:text-text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
      />
    </svg>
  );
}
