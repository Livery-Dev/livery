/**
 * Tailwind + Livery example demonstrating CSS variable integration
 */

import {
  DynamicThemeProvider,
  useTheme,
  useThemeValue,
  resolver,
  THEMES,
} from './livery';

function Header() {
  const { themeId } = useTheme();

  return (
    <header className="bg-brand-primary text-white p-livery-md shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold font-livery-heading">Livery + Tailwind</h1>
        <span className="px-3 py-1 bg-white/20 rounded-livery-md text-sm">{themeId}</span>
      </div>
    </header>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white shadow-md rounded-livery-lg p-livery-lg ${className}`}>
      {children}
    </div>
  );
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-livery-md shadow-inner border border-gray-200"
        style={{ backgroundColor: color }}
      />
      <div>
        <div className="font-medium">{label}</div>
        <code className="text-sm text-gray-500">{color}</code>
      </div>
    </div>
  );
}

function ThemePreview() {
  const primary = useThemeValue('brand.primary');
  const secondary = useThemeValue('brand.secondary');
  const { cssVariables } = useTheme();

  return (
    <Card>
      <h2 className="text-xl font-bold mb-livery-md font-livery-heading">Current Theme</h2>
      <div className="grid grid-cols-2 gap-livery-md mb-livery-lg">
        <ColorSwatch label="Primary" color={primary} />
        <ColorSwatch label="Secondary" color={secondary} />
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
          View all CSS variables
        </summary>
        <pre className="mt-2 p-3 bg-gray-100 rounded-livery-sm text-xs overflow-auto max-h-48">
          {JSON.stringify(cssVariables, null, 2)}
        </pre>
      </details>
    </Card>
  );
}

function ButtonDemo() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-livery-md font-livery-heading">Button Variants</h2>
      <p className="text-gray-600 mb-livery-md">
        These buttons use Tailwind classes that reference Livery CSS variables.
      </p>
      <div className="flex flex-wrap gap-livery-sm">
        <button className="px-4 py-2 bg-brand-primary text-white rounded-livery-md hover:opacity-90 transition-opacity">
          Primary
        </button>
        <button className="px-4 py-2 bg-brand-secondary text-white rounded-livery-md hover:opacity-90 transition-opacity">
          Secondary
        </button>
        <button className="px-4 py-2 border-2 border-brand-primary text-brand-primary rounded-livery-md hover:bg-brand-primary hover:text-white transition-colors">
          Outline
        </button>
      </div>
    </Card>
  );
}

function SpacingDemo() {
  const sm = useThemeValue('spacing.sm');
  const md = useThemeValue('spacing.md');
  const lg = useThemeValue('spacing.lg');

  return (
    <Card>
      <h2 className="text-xl font-bold mb-livery-md font-livery-heading">Spacing Scale</h2>
      <div className="space-y-3">
        {[
          { label: 'Small', value: sm, class: 'p-livery-sm' },
          { label: 'Medium', value: md, class: 'p-livery-md' },
          { label: 'Large', value: lg, class: 'p-livery-lg' },
        ].map(({ label, value, class: cls }) => (
          <div key={label} className="flex items-center gap-4">
            <div className={`bg-brand-primary/20 ${cls} rounded`}>
              <div className="w-8 h-8 bg-brand-primary rounded" />
            </div>
            <div>
              <span className="font-medium">{label}</span>
              <code className="ml-2 text-sm text-gray-500">{value}</code>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BorderRadiusDemo() {
  const sm = useThemeValue('border.radius.sm');
  const md = useThemeValue('border.radius.md');
  const lg = useThemeValue('border.radius.lg');

  return (
    <Card>
      <h2 className="text-xl font-bold mb-livery-md font-livery-heading">Border Radius</h2>
      <div className="flex gap-livery-md">
        {[
          { label: 'SM', value: sm, class: 'rounded-livery-sm' },
          { label: 'MD', value: md, class: 'rounded-livery-md' },
          { label: 'LG', value: lg, class: 'rounded-livery-lg' },
        ].map(({ label, value, class: cls }) => (
          <div key={label} className="text-center">
            <div className={`w-16 h-16 bg-brand-primary ${cls} mb-2`} />
            <div className="text-sm font-medium">{label}</div>
            <code className="text-xs text-gray-500">{value}</code>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ThemeSelector() {
  const { themeId, setThemeId } = useTheme();

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600">Select theme:</span>
        <div className="flex gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => setThemeId(theme)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === themeId
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4 mx-auto" />
        <p className="text-gray-600">Loading theme...</p>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <main className="max-w-4xl mx-auto p-livery-lg">
      <div className="grid gap-livery-lg">
        <ThemePreview />
        <ButtonDemo />
        <div className="grid md:grid-cols-2 gap-livery-lg">
          <SpacingDemo />
          <BorderRadiusDemo />
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <DynamicThemeProvider
      initialThemeId="startup"
      resolver={resolver}
      fallback={<LoadingFallback />}
      onError={(error: Error) => console.error('Theme error:', error)}
    >
      <div className="min-h-screen">
        <ThemeSelector />
        <Header />
        <MainContent />
      </div>
    </DynamicThemeProvider>
  );
}
