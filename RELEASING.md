# Releasing Livery

This document describes the release process for Livery packages.

## Overview

Livery uses **unified versioning** - all packages (`@livery/core`, `@livery/react`, `@livery/next`) share the same version number. This simplifies communication and ensures compatibility.

## Prerequisites

- Node.js 18+
- pnpm 9+
- [GitHub CLI](https://cli.github.com/) (`gh`) for creating GitHub Releases
- npm account with publish access to `@livery` scope

## Release Commands

| Command | Description |
|---------|-------------|
| `pnpm release` | Auto-detect bump type from commits |
| `pnpm release:patch` | Force patch bump (0.0.1 → 0.0.2) |
| `pnpm release:minor` | Force minor bump (0.0.1 → 0.1.0) |
| `pnpm release:major` | Force major bump (0.0.1 → 1.0.0) |
| `pnpm release:pre` | Pre-release with `next` npm tag (0.0.2-alpha.0) |

## How It Works

The release script performs these steps:

1. **Check for uncommitted changes** - Ensures working directory is clean
2. **Run tests** - All tests must pass
3. **Run type checks** - TypeScript must compile without errors
4. **Build packages** - Builds all packages in dependency order
5. **Update versions** - Bumps version in all package.json files
6. **Generate changelog** - Creates/updates CHANGELOG.md from commits
7. **Commit** - Commits version bump and changelog
8. **Tag** - Creates annotated git tag (e.g., `v1.0.0`)
9. **Publish to npm** - Publishes all packages
10. **Push** - Pushes commits and tags to remote
11. **GitHub Release** - Creates a GitHub Release with changelog

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) to automate versioning and changelog generation.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `docs` | Documentation only | None |
| `style` | Formatting, no code change | None |
| `refactor` | Code change that neither fixes a bug nor adds a feature | None |
| `perf` | Performance improvement | Patch |
| `test` | Adding or fixing tests | None |
| `chore` | Maintenance tasks | None |

### Breaking Changes

For breaking changes, either:
- Add `!` after the type: `feat!: rename ThemeConfig to LiveryConfig`
- Add a `BREAKING CHANGE:` footer in the commit body

Breaking changes trigger a **major** version bump.

### Examples

```bash
# Patch release (bug fix)
git commit -m "fix: resolve hydration mismatch in SSR"

# Minor release (new feature)
git commit -m "feat: add dark mode support to LiveryProvider"

# Major release (breaking change)
git commit -m "feat!: rename ThemeConfig to LiveryConfig"

# With scope
git commit -m "fix(react): prevent re-render on theme change"

# With body and footer
git commit -m "feat: add middleware for Next.js

This adds automatic theme detection in middleware.

BREAKING CHANGE: middleware export moved to @livery/next/middleware"
```

## Pre-releases

For testing before a stable release:

```bash
pnpm release:pre
```

This creates versions like `0.1.0-alpha.0` and publishes with the `next` npm tag. Users can install pre-releases with:

```bash
npm install @livery/core@next
```

## Manual Version Override

If auto-detection picks the wrong bump type, override it:

```bash
# Auto-detected patch, but you want minor
pnpm release:minor
```

## Troubleshooting

### "You have uncommitted changes"

Commit or stash your changes before releasing:

```bash
git stash
pnpm release
git stash pop
```

### "gh CLI not found"

Install the GitHub CLI: https://cli.github.com/

The release will still complete, but won't create a GitHub Release automatically.

### npm publish fails

Ensure you're logged in to npm with publish access:

```bash
npm login
npm whoami
```

### Commit rejected by hook

Your commit message doesn't follow conventional format. Examples of valid messages:

```
feat: add new feature
fix: resolve bug
docs: update readme
chore: update dependencies
```
