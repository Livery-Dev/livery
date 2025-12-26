#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Packages to publish (in dependency order)
PACKAGES=("core" "react" "next")

# Get the version bump type from argument (default: auto-detect from commits)
BUMP_TYPE="${1:-auto}"

# Function to get current version from a package
get_version() {
    local pkg=$1
    node -p "require('./packages/$pkg/package.json').version"
}

# Function to detect bump type from conventional commits
detect_bump_type() {
    local last_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

    if [[ -z "$last_tag" ]]; then
        # No tags yet, check all commits
        local commits=$(git log --pretty=format:"%s" 2>/dev/null || echo "")
    else
        local commits=$(git log "${last_tag}..HEAD" --pretty=format:"%s" 2>/dev/null || echo "")
    fi

    # Check for breaking changes
    if echo "$commits" | grep -qE "^[a-z]+(\(.+\))?!:|BREAKING CHANGE:"; then
        echo "major"
        return
    fi

    # Check for features
    if echo "$commits" | grep -qE "^feat(\(.+\))?:"; then
        echo "minor"
        return
    fi

    # Check for fixes
    if echo "$commits" | grep -qE "^fix(\(.+\))?:"; then
        echo "patch"
        return
    fi

    # Default to patch if no conventional commits found
    echo "patch"
}

# Function to bump version
bump_version() {
    local current=$1
    local type=$2

    IFS='.' read -r major minor patch <<< "${current%-*}"
    local prerelease="${current#*-}"

    case $type in
        major)
            echo "$((major + 1)).0.0"
            ;;
        minor)
            echo "$major.$((minor + 1)).0"
            ;;
        patch)
            echo "$major.$minor.$((patch + 1))"
            ;;
        pre)
            if [[ "$current" == *"-"* ]]; then
                # Already a prerelease, bump the prerelease number
                local pre_num="${prerelease##*.}"
                local pre_prefix="${prerelease%.*}"
                if [[ "$pre_num" =~ ^[0-9]+$ ]]; then
                    echo "$major.$minor.$patch-$pre_prefix.$((pre_num + 1))"
                else
                    echo "$major.$minor.$patch-alpha.0"
                fi
            else
                # Not a prerelease, create new prerelease
                echo "$major.$minor.$((patch + 1))-alpha.0"
            fi
            ;;
    esac
}

# Function to extract changelog for this release
extract_release_notes() {
    local version=$1
    local changelog_file="CHANGELOG.md"

    if [[ ! -f "$changelog_file" ]]; then
        echo "Release v$version"
        return
    fi

    # Extract content between this version header and the next version header
    awk -v ver="$version" '
        /^## \[/ {
            if (found) exit
            if (index($0, ver)) found=1
            next
        }
        found { print }
    ' "$changelog_file"
}

# Auto-detect or validate bump type
if [[ "$BUMP_TYPE" == "auto" ]]; then
    BUMP_TYPE=$(detect_bump_type)
    echo -e "${YELLOW}Auto-detected bump type: ${BUMP_TYPE}${NC}"
elif [[ ! "$BUMP_TYPE" =~ ^(pre|patch|minor|major)$ ]]; then
    echo -e "${RED}Error: Invalid bump type '$BUMP_TYPE'${NC}"
    echo "Usage: $0 [auto|pre|patch|minor|major]"
    exit 1
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Livery Release Script - ${BUMP_TYPE} release${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Get current version (all packages should be in sync)
CURRENT_VERSION=$(get_version "core")
NEW_VERSION=$(bump_version "$CURRENT_VERSION" "$BUMP_TYPE")

echo -e "${YELLOW}Current version:${NC} $CURRENT_VERSION"
echo -e "${YELLOW}New version:${NC}     $NEW_VERSION"
echo ""

# Confirmation prompt
read -p "Continue with release? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Release cancelled.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 1: Checking for uncommitted changes...${NC}"
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}Error: You have uncommitted changes. Please commit or stash them first.${NC}"
    git status --short
    exit 1
fi
echo -e "${GREEN}✓ Working directory is clean${NC}"

echo ""
echo -e "${BLUE}Step 2: Running tests...${NC}"
pnpm test
echo -e "${GREEN}✓ All tests passed${NC}"

echo ""
echo -e "${BLUE}Step 3: Running type checks...${NC}"
pnpm check-types
echo -e "${GREEN}✓ Type checks passed${NC}"

echo ""
echo -e "${BLUE}Step 4: Building packages...${NC}"
pnpm build
echo -e "${GREEN}✓ Build completed${NC}"

echo ""
echo -e "${BLUE}Step 5: Updating versions in package.json files...${NC}"
for pkg in "${PACKAGES[@]}"; do
    pkg_json="./packages/$pkg/package.json"

    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('$pkg_json', 'utf8'));
        pkg.version = '$NEW_VERSION';
        fs.writeFileSync('$pkg_json', JSON.stringify(pkg, null, 2) + '\n');
    "

    echo -e "  ${GREEN}✓${NC} Updated @livery/$pkg to $NEW_VERSION"
done

echo ""
echo -e "${BLUE}Step 6: Generating changelog...${NC}"
pnpm exec conventional-changelog -p angular -i CHANGELOG.md -s -r 0
echo -e "${GREEN}✓ Changelog updated${NC}"

echo ""
echo -e "${BLUE}Step 7: Committing version bump and changelog...${NC}"
git add packages/*/package.json CHANGELOG.md
git commit --no-verify -m "chore(release): v$NEW_VERSION"
echo -e "${GREEN}✓ Committed version bump${NC}"

echo ""
echo -e "${BLUE}Step 8: Creating git tag...${NC}"
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
echo -e "${GREEN}✓ Created tag v$NEW_VERSION${NC}"

echo ""
echo -e "${BLUE}Step 9: Publishing packages to npm...${NC}"
for pkg in "${PACKAGES[@]}"; do
    echo -e "  Publishing @livery/$pkg..."
    cd "./packages/$pkg"

    if [[ "$BUMP_TYPE" == "pre" ]]; then
        pnpm publish --access public --tag next --no-git-checks
    else
        pnpm publish --access public --no-git-checks
    fi

    cd ../..
    echo -e "  ${GREEN}✓${NC} Published @livery/$pkg@$NEW_VERSION"
done

echo ""
echo -e "${BLUE}Step 10: Pushing to remote...${NC}"
git push
git push --tags
echo -e "${GREEN}✓ Pushed commits and tags${NC}"

echo ""
echo -e "${BLUE}Step 11: Creating GitHub Release...${NC}"
RELEASE_NOTES=$(extract_release_notes "$NEW_VERSION")

if command -v gh &> /dev/null; then
    if [[ "$BUMP_TYPE" == "pre" ]]; then
        gh release create "v$NEW_VERSION" \
            --title "v$NEW_VERSION" \
            --notes "$RELEASE_NOTES" \
            --prerelease
    else
        gh release create "v$NEW_VERSION" \
            --title "v$NEW_VERSION" \
            --notes "$RELEASE_NOTES"
    fi
    echo -e "${GREEN}✓ GitHub Release created${NC}"
else
    echo -e "${YELLOW}⚠ gh CLI not found. Skipping GitHub Release creation.${NC}"
    echo -e "${YELLOW}  Install it from: https://cli.github.com/${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Release v$NEW_VERSION completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
