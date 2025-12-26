/**
 * Generate API reference documentation from TypeScript source files
 *
 * This script uses TypeDoc to parse the @livery/* packages and generate
 * Markdown documentation that can be consumed by Nextra.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.resolve(import.meta.dirname, '../../..');
const DOCS_DIR = path.resolve(import.meta.dirname, '..');
const API_OUTPUT_DIR = path.join(DOCS_DIR, 'content', 'api');

// Packages to document
const PACKAGES = [
  { name: 'core', displayName: '@livery/core', entry: 'packages/core/src/index.ts' },
  { name: 'react', displayName: '@livery/react', entry: 'packages/react/src/index.ts' },
  { name: 'next', displayName: '@livery/next', entry: 'packages/next/src/index.ts' },
];

/**
 * Clean and create the API output directory
 */
function setupOutputDir(): void {
  if (fs.existsSync(API_OUTPUT_DIR)) {
    fs.rmSync(API_OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(API_OUTPUT_DIR, { recursive: true });
}

/**
 * Generate TypeDoc configuration for a package
 */
function generateTypedocConfig(pkg: (typeof PACKAGES)[number]): object {
  const pkgDir = path.join(ROOT_DIR, 'packages', pkg.name);
  return {
    entryPoints: [path.join(ROOT_DIR, pkg.entry)],
    out: path.join(API_OUTPUT_DIR, pkg.name),
    tsconfig: path.join(pkgDir, 'tsconfig.json'),
    plugin: ['typedoc-plugin-markdown'],
    // Markdown plugin options
    outputFileStrategy: 'modules',
    entryFileName: 'index',
    hidePageHeader: true,
    hideBreadcrumbs: true,
    hidePageTitle: false,
    // TypeDoc options
    excludePrivate: true,
    excludeProtected: true,
    excludeInternal: true,
    readme: 'none',
    gitRevision: 'main',
    sourceLinkTemplate: 'https://github.com/Livery-Dev/livery/blob/main/{path}#L{line}',
    categorizeByGroup: true,
    categoryOrder: ['Functions', 'Classes', 'Interfaces', 'Type Aliases', '*'],
  };
}

/**
 * Run TypeDoc for a package
 */
function runTypedoc(pkg: (typeof PACKAGES)[number]): void {
  console.log(`Generating API docs for ${pkg.displayName}...`);

  const config = generateTypedocConfig(pkg);
  const configPath = path.join(DOCS_DIR, `typedoc.${pkg.name}.json`);

  // Write temporary config file
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  try {
    execSync(`npx typedoc --options ${configPath}`, {
      cwd: DOCS_DIR,
      stdio: 'inherit',
    });
  } finally {
    // Clean up temp config
    fs.unlinkSync(configPath);
  }
}

/**
 * Generate _meta.ts for navigation
 */
function generateMetaFiles(): void {
  // Main API _meta.ts
  const mainMeta = `export default {
  index: 'Overview',
${PACKAGES.map((pkg) => `  ${pkg.name}: '${pkg.displayName}',`).join('\n')}
};
`;
  fs.writeFileSync(path.join(API_OUTPUT_DIR, '_meta.ts'), mainMeta);

  // Index page
  const indexContent = `# API Reference

Auto-generated API documentation for Livery packages.

## Packages

${PACKAGES.map((pkg) => `- [${pkg.displayName}](/docs/api/${pkg.name}) — ${getPackageDescription(pkg.name)}`).join('\n')}

## Generation

This documentation is automatically generated from TypeScript source files using [TypeDoc](https://typedoc.org/).

To regenerate, run:

\`\`\`bash
pnpm generate-api
\`\`\`
`;
  fs.writeFileSync(path.join(API_OUTPUT_DIR, 'index.mdx'), indexContent);
}

/**
 * Get package description
 */
function getPackageDescription(name: string): string {
  const descriptions: Record<string, string> = {
    core: 'Schema definition, validation, and CSS utilities',
    react: 'React provider and hooks',
    next: 'Next.js middleware and App Router utilities',
  };
  return descriptions[name] ?? '';
}

/**
 * Escape curly braces to prevent MDX parsing them as JSX expressions
 *
 * MDX treats { and } as JSX expression delimiters. This breaks:
 * - TypeScript type definitions like `{ [K in keyof T]: ... }`
 * - Prose mentioning braces like "Braces ({ and })"
 *
 * We escape ALL curly braces except those in fenced code blocks (``` ... ```).
 */
function escapeCurlyBracesInCode(content: string): string {
  const lines = content.split('\n');
  let inCodeBlock = false;
  const result: string[] = [];

  for (const line of lines) {
    // Track fenced code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    // Don't escape inside fenced code blocks
    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // Escape all curly braces outside of fenced code blocks
    // (including inline code with backticks - MDX still parses those)
    const escaped = line.replace(/(?<!\\)\{/g, '\\{').replace(/(?<!\\)\}/g, '\\}');
    result.push(escaped);
  }

  return result.join('\n');
}

/**
 * Post-process generated markdown files for Nextra compatibility
 */
function postProcessMarkdown(dir: string): void {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      postProcessMarkdown(filePath);
      continue;
    }

    if (!file.name.endsWith('.md')) continue;

    // Rename .md to .mdx for Nextra
    const newPath = filePath.replace(/\.md$/, '.mdx');

    let content = fs.readFileSync(filePath, 'utf-8');

    // Fix internal links to use .mdx extension
    content = content.replace(/\]\(([^)]+)\.md\)/g, '](/docs/api/$1)');

    // Remove TypeDoc header if present
    content = content.replace(/^# .*\n\n/, '');

    // Escape curly braces in inline code and code blocks to prevent MDX parsing them as JSX
    // This handles patterns like `{ [K in keyof T]: ... }` in type definitions
    content = escapeCurlyBracesInCode(content);

    fs.writeFileSync(newPath, content);
    fs.unlinkSync(filePath);
  }
}

/**
 * Generate package-specific _meta.ts files
 */
function generatePackageMetaFiles(): void {
  for (const pkg of PACKAGES) {
    const pkgDir = path.join(API_OUTPUT_DIR, pkg.name);
    if (!fs.existsSync(pkgDir)) continue;

    const files = fs
      .readdirSync(pkgDir)
      .filter((f) => f.endsWith('.mdx') && f !== 'index.mdx')
      .map((f) => f.replace('.mdx', ''));

    const meta = `export default {
  index: 'Overview',
${files.map((f) => `  '${f}': '${formatFileName(f)}',`).join('\n')}
};
`;
    fs.writeFileSync(path.join(pkgDir, '_meta.ts'), meta);
  }
}

/**
 * Format file name for display
 */
function formatFileName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('Generating API documentation...\n');

  // Setup
  setupOutputDir();

  // Generate docs for each package
  for (const pkg of PACKAGES) {
    try {
      runTypedoc(pkg);
    } catch (error) {
      console.error(`Failed to generate docs for ${pkg.displayName}:`, error);
    }
  }

  // Post-process
  console.log('\nPost-processing markdown files...');
  postProcessMarkdown(API_OUTPUT_DIR);

  // Generate meta files
  console.log('Generating navigation files...');
  generateMetaFiles();
  generatePackageMetaFiles();

  console.log('\nAPI documentation generated successfully!');
  console.log(`Output: ${API_OUTPUT_DIR}`);
}

main().catch(console.error);
