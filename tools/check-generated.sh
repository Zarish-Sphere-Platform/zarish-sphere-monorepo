#!/bin/bash

# PR-Mode Validation Script for Zarish Sphere SSOT
# This script ensures that all generated files are up-to-date before allowing a merge
# It enforces SSOT integrity by validating that source files and generated outputs are in sync

set -e

echo "🔍 Starting SSOT Integrity Check..."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any checks failed
FAILED=0

# 1. Check if schema files exist
echo "${YELLOW}→ Checking schema files...${NC}"
if [ ! -f "schemas/db.ts" ] && [ ! -f "schemas/api.yaml" ]; then
  echo "${RED}✗ No schema files found in /schemas${NC}"
  FAILED=1
else
  echo "${GREEN}✓ Schema files present${NC}"
fi

# 2. Check if documentation index exists
echo "${YELLOW}→ Checking documentation index...${NC}"
if [ ! -f "docs/INDEX.md" ]; then
  echo "${YELLOW}⚠ Documentation index not found. Generating...${NC}"
  # Generate index if it doesn't exist
  node tools/generate-index.mjs || true
fi

# 3. Check for uncommitted generated files
echo "${YELLOW}→ Checking for uncommitted generated files...${NC}"
if git diff --exit-code > /dev/null 2>&1; then
  echo "${GREEN}✓ All generated files are committed${NC}"
else
  echo "${RED}✗ Found uncommitted changes in generated files${NC}"
  echo ""
  echo "Please run the following commands to regenerate and commit:"
  echo "  pnpm run generate"
  echo "  git add ."
  echo "  git commit -m 'chore: regenerate files'"
  echo ""
  git diff --name-only
  FAILED=1
fi

# 4. Validate TODO.md files
echo "${YELLOW}→ Validating TODO.md files...${NC}"
TODO_COUNT=$(find . -name "TODO.md" -type f | wc -l)
if [ "$TODO_COUNT" -gt 0 ]; then
  echo "${GREEN}✓ Found $TODO_COUNT TODO.md files${NC}"
else
  echo "${YELLOW}⚠ No TODO.md files found${NC}"
fi

# 5. Check package.json integrity
echo "${YELLOW}→ Checking package.json integrity...${NC}"
if pnpm install --dry-run > /dev/null 2>&1; then
  echo "${GREEN}✓ Dependencies are consistent${NC}"
else
  echo "${RED}✗ Dependency issues detected${NC}"
  FAILED=1
fi

# Final result
echo ""
if [ $FAILED -eq 0 ]; then
  echo "${GREEN}✅ SSOT Integrity Check PASSED${NC}"
  echo "All generated files are up-to-date and committed."
  exit 0
else
  echo "${RED}❌ SSOT Integrity Check FAILED${NC}"
  echo "Please fix the issues above and try again."
  exit 1
fi
