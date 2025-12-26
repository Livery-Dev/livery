'use client';

import { useThemeSwitcher } from './providers';
import { themes, type ThemeName } from '../lib/livery';

/**
 * ThemeShowcase Component
 * Demonstrates live theme switching with Livery + Tailwind CSS.
 * Clicking theme buttons updates CSS variables which Tailwind classes reference.
 */

const themeList = Object.entries(themes) as [ThemeName, (typeof themes)[ThemeName]][];

export function ThemeShowcase() {
  const { currentTheme, setTheme } = useThemeSwitcher();
  const currentThemeData = themes[currentTheme];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium mb-6 bg-surface text-text-muted rounded-full border border-border">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            Live Demo
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl text-text font-display tracking-tight">
            See it in action
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-text-muted font-sans leading-relaxed">
            This entire page is themed with Livery. Click a theme below — fonts, borders, radii,
            shadows, everything changes.
          </p>
        </div>

        {/* Theme Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {themeList.map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full border font-sans ${
                currentTheme === key
                  ? 'bg-text text-text-inverse border-text shadow-sm'
                  : 'bg-surface text-text border-border hover:bg-surface-hover'
              }`}
            >
              {themeData.name}
            </button>
          ))}
        </div>

        {/* Mini App Preview */}
        <div className="max-w-4xl mx-auto">
          <MiniAppPreview themeName={currentTheme} />
        </div>

        {/* Theme Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted font-sans">
            Current theme: <span className="text-text font-semibold">{currentThemeData?.name}</span>{' '}
            — {currentThemeData?.description}
          </p>
        </div>
      </div>
    </section>
  );
}

interface MiniAppPreviewProps {
  themeName: ThemeName;
}

function MiniAppPreview({ themeName }: MiniAppPreviewProps) {
  const isForest = themeName === 'forest';
  const isOcean = themeName === 'ocean';
  const isSunset = themeName === 'sunset';

  return (
    <div className="overflow-hidden bg-background-alt rounded-xl border border-border shadow-lg">
      {/* App Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-surface border-b border-border">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 flex items-center justify-center font-bold text-sm bg-primary text-text-inverse rounded-md font-display">
            L
          </div>
          <span className="font-semibold text-text font-display tracking-tight">
            {isForest
              ? 'Livery Music'
              : isOcean
                ? 'livery/themes'
                : isSunset
                  ? 'Livery Notes'
                  : 'Livery App'}
          </span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm bg-transparent text-text-muted rounded-md font-sans font-medium">
            Settings
          </button>
          <button
            className={`px-3 py-1.5 text-sm bg-primary text-text-inverse font-sans font-medium ${isForest ? 'rounded-full' : 'rounded-md'}`}
          >
            {isForest ? 'Upgrade' : isOcean ? 'Star' : 'Sign up'}
          </button>
        </div>
      </header>

      {/* App Content */}
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-text font-display tracking-tight leading-tight">
            {isForest
              ? 'Good evening'
              : isOcean
                ? 'Popular repositories'
                : isSunset
                  ? 'Getting Started'
                  : 'Dashboard'}
          </h3>
          <p className="mt-2 text-text-muted font-sans">
            {isSunset
              ? 'Welcome to your workspace. Here you can organize your thoughts and ideas.'
              : 'Your personalized overview of recent activity and quick actions.'}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Card 1 */}
          <div className="p-4 transition-all bg-surface rounded-lg border border-border shadow-sm">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 flex items-center justify-center shrink-0 bg-primary/15 text-primary ${isForest ? 'rounded-full' : 'rounded-md'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-semibold text-text font-display tracking-tight">
                  Quick Actions
                </h4>
                <p className="mt-1 text-sm text-text-muted font-sans">
                  {isSunset
                    ? 'Create new pages, import files, or start from a template.'
                    : 'Access your most used features instantly.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 transition-all bg-surface rounded-lg border border-border shadow-sm">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 flex items-center justify-center shrink-0 bg-accent/15 text-accent ${isForest ? 'rounded-full' : 'rounded-md'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-semibold text-text font-display tracking-tight">
                  {isOcean ? 'Contribution Activity' : 'Analytics'}
                </h4>
                <p className="mt-1 text-sm text-text-muted font-sans">
                  {isOcean
                    ? '42 contributions in the last week.'
                    : 'Track your progress and growth metrics.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 text-sm bg-primary text-text-inverse font-sans font-semibold shadow-sm ${isForest ? 'rounded-full' : 'rounded-md'}`}
          >
            {isForest
              ? 'Play All'
              : isOcean
                ? 'New repository'
                : isSunset
                  ? 'New page'
                  : 'Create new'}
          </button>
          <button
            className={`px-4 py-2 text-sm bg-surface text-text border border-border font-sans font-medium ${isForest ? 'rounded-full' : 'rounded-md'}`}
          >
            {isForest ? 'Shuffle' : isOcean ? 'Import repository' : 'Import'}
          </button>
          <button
            className={`px-4 py-2 text-sm bg-transparent text-primary font-sans font-medium ${isForest ? 'rounded-full' : 'rounded-md'}`}
          >
            Learn more
          </button>
        </div>

        {/* Typography Showcase */}
        <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
          <p className="text-xs uppercase mb-2 text-text-muted font-sans tracking-wide font-medium">
            Typography Preview
          </p>
          <p className="text-xl font-bold text-text font-display tracking-tight mb-2">
            {isSunset ? 'The quick brown fox' : 'Display Heading'}
          </p>
          <p className="text-text-muted font-sans leading-relaxed">
            {isSunset
              ? 'jumps over the lazy dog. This serif font gives a warm, editorial feel.'
              : 'Body text uses the sans-serif font stack. Clean and readable.'}
          </p>
          <code className="mt-2 inline-block px-2 py-1 bg-background-alt text-text font-mono text-sm rounded-sm">
            const theme = &apos;{themeName}&apos;;
          </code>
        </div>
      </div>
    </div>
  );
}
