---
name: build-verify
description: Runs the full quality gate (typecheck, lint, build) after code changes, fixes compilation and lint errors without ts-ignore or test hacks, and reports status with fixes and full output. Use when the user asks to build, verify, or check compilation, or after edits that might affect compilation.
---

# Skill: Build & Verify

## When to use

After making code changes that might affect compilation or code quality.
Triggered by: "build", "verify", "check compilation", "check types".

## Inputs

- Changed files (from `git diff` or conversation context)
- Which packages were affected (determines build scope)

## Steps

### Step 1: TypeScript Type Check

1. Run `yarn test:typecheck` (runs `tsc` in strict mode across the monorepo)
2. If passes → proceed to Step 2
3. If fails:
   a. Read error output — identify file, line, error type (TS2xxx codes)
   b. Open the file at the error line
   c. Fix the issue (type error, missing import, wrong generic, missing property)
   d. Re-run `yarn test:typecheck`
   e. Repeat until passes (max 3 attempts)

### Step 2: ESLint Check

1. Run `yarn test:code` (ESLint with zero warnings policy)
2. If passes → proceed to Step 3
3. If fails:
   a. Try `yarn fix:code` first (auto-fixable issues: import order, type imports, formatting)
   b. If errors remain — read output, fix manually (restricted imports, unused vars, missing types)
   c. Re-run `yarn test:code`
   d. Repeat until passes (max 3 attempts)

### Step 3: Build (if packages were changed)

1. If changes are in `packages/*` — run `yarn build:packages` (builds common → math → element → excalidraw in order)
2. If changes are only in `excalidraw-app/` — run `yarn build:app`
3. If unsure — run `yarn build`
4. If build fails:
   a. Read esbuild/Vite error output
   b. Fix the issue (missing export, circular dependency, SCSS error, bad alias)
   c. Re-run the appropriate build command
   d. Repeat until passes (max 3 attempts)

### Step 4: Report

- Report build status: PASS / FAIL
- List all fixes applied (if any)
- Include relevant error output

## Outputs

- TypeScript check: PASS / FAIL
- ESLint check: PASS / FAIL
- Build: PASS / FAIL / SKIPPED
- List of fixes applied (if any)
- Full output of any failed step

## Safety

- Do NOT fix errors by adding `@ts-ignore`, `@ts-expect-error`, or `any`
- Do NOT modify test files to fix build errors
- Do NOT bypass ESLint rules with `eslint-disable` comments
- Do NOT change `tsconfig.json` or `.eslintrc.json` to suppress errors
- Respect the package dependency graph — if fixing a type in `common`, verify it doesn't break `element` or `excalidraw`
- If 3 attempts fail on any step — stop and report to user with full error context