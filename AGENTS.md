# AGENTS.md

## Project Overview

Excalidraw — open-source virtual whiteboard for sketching hand-drawn diagrams. React + TypeScript monorepo with Canvas 2D rendering powered by RoughJS.

## Project Structure

The app (`excalidraw-app/`) is a **host** around the embeddable library — it composes exports from `@excalidraw/excalidraw` plus collaboration, PWA, Sentry, and Firebase integrations.

### Package Dependency Graph

```text
@excalidraw/common     (no internal deps)
        ↑
@excalidraw/math       (depends on common)
        ↑
@excalidraw/element    (depends on common, math)
        ↑
@excalidraw/excalidraw (depends on common, element, math + UI libs)
```

**`@excalidraw/utils`** is NOT in excalidraw's `dependencies` but is aliased and **bundled** into excalidraw dist via `scripts/buildPackage.js`.

### Directory Layout

- **`packages/excalidraw/`** — Main React component library published as `@excalidraw/excalidraw`
- **`packages/element/`** — Element definitions, Scene class, element utilities
- **`packages/common/`** — Shared utilities, constants, types
- **`packages/math/`** — Mathematical utilities
- **`packages/utils/`** — Export utilities, shape helpers (bundled into excalidraw, built separately for standalone publish)
- **`excalidraw-app/`** — Full-featured PWA (excalidraw.com): Firebase, Sentry, socket.io collaboration
- **`examples/`** — Integration examples (NextJS, browser script)
- **`scripts/`** — Build scripts (`buildBase.js` for common/math/element, `buildPackage.js` for excalidraw, `buildUtils.js` for utils)

## Development Commands

```bash
# Dev server (port 3001, resolves packages from source — no pre-build needed)
yarn start

# Quality gate (run before pushing)
yarn test:all          # Full check: typecheck + lint + format + tests

# Testing
yarn test              # Run unit/component tests
yarn test:update       # Run tests + update snapshots
yarn test:coverage     # Run with coverage thresholds
yarn test:typecheck    # TypeScript type checking

# Linting & Formatting
yarn test:code         # ESLint check (zero warnings allowed)
yarn test:other        # Prettier format check
yarn fix               # Auto-fix all (ESLint + Prettier)

# Building
yarn build:packages    # Build common → math → element → excalidraw (NOT utils)
yarn build:app         # Build the web app with Vite
yarn build             # Full production build (app + version stamp)

# Cleanup
yarn clean-install     # rm node_modules + yarn install (does NOT clean examples/*)
```

## Tech Stack

- **React** 19.0.0
- **TypeScript** 5.9.3 (strict mode, ESNext target)
- **Vite** (web app bundler)
- **esbuild** (library package bundler)
- **Yarn workspaces** (Yarn 1.22.22)
- **Vitest** 3.0.6 (unit/component testing, jsdom environment)
- **Node** >=18.0.0

## Environment

- **Node CI version**: 20.x
- **Package Manager**: Yarn 1.22.22 (1.x classic) with workspaces
- **React peer range**: `^17.0.2 || ^18.2.0 || ^19.0.0`
- **Git hooks**: Husky 7.0.4 + lint-staged 12.3.7

## Architecture

### State Management

- **Jotai** 2.11.0 atoms for global state (`EditorJotaiProvider` + `editorJotaiStore` in `editor-jotai.ts`)
- ESLint restricts direct jotai imports — use app-specific modules
- **ActionManager** (`actions/manager.tsx`) as command dispatcher
- **Imperative API**: `ExcalidrawAPIProvider` + contexts for hooks outside the editor tree
- State type: `AppState` in `packages/excalidraw/types.ts`
- Do NOT introduce Redux, Zustand, or MobX

### Rendering

- Two-layer HTML5 Canvas 2D with RoughJS for hand-drawn aesthetic
  - `StaticCanvas` → `renderStaticScene()`
  - `InteractiveCanvas` → `renderInteractiveScene()`
- `Scene` class (`packages/element/src/Scene.ts`) manages elements
- Do NOT use react-konva, fabric.js, or pixi.js

### Build System

- **esbuild** for library packages → `dist/dev/` + `dist/prod/` (ESM with dev/prod conditional exports)
- **Vite** for the web app → `excalidraw-app/build/`
- **Build order matters**: `build:packages` runs common → math → element → excalidraw (NOT utils)
- To build utils separately: `yarn --cwd packages/utils build:esm`
- Path aliases in `tsconfig.json` and `excalidraw-app/vite.config.mts` resolve `@excalidraw/*` to **source** trees — dev server works without pre-building `dist/`
- Each package's `build:esm` ends with `gen:types` (rimraf types && tsc) for type declarations

## Testing Conventions

- Use custom `render()` from `packages/excalidraw/tests/test-utils.ts`, not raw `@testing-library/react`
- Create elements via `API.createElement()` from `tests/helpers/api.ts`
- Simulate input via `Pointer` (mouse/touch) and `Keyboard` classes from `tests/helpers/ui.ts`
- Coverage thresholds: 60% lines, 70% branches, 63% functions, 60% statements
- Snapshots used extensively — run `yarn test:update` after visual/structural changes

## Conventions

- Functional components preferred (`App.tsx` is the class component exception)
- PascalCase for components (`Avatar.tsx`), camelCase/kebab-case for utilities (`appState.ts`, `editor-jotai.ts`)
- Use `import type { X }` for type-only imports
- Cross-package imports use `@excalidraw/*` aliases, not relative paths
- ESLint enforces import ordering and restricted jotai imports
- Zero ESLint warnings policy — all warnings are errors in CI

## CI Pipelines

- **Push to master**: runs `yarn test:app`
- **Pull requests**: runs lint (`test:other`, `test:code`, `test:typecheck`) + coverage report
- **PR titles**: validated by semantic-pr-title check

## Boundaries

### Always Do

- Run `yarn test:all` before pushing (quality gate: typecheck + lint + format + tests)
- Run `yarn test:update` to update snapshots after visual/structural changes
- Run `yarn fix` to auto-fix formatting/lint issues
- Use `@excalidraw/*` path aliases for cross-package imports (never relative cross-package paths)
- Respect the package dependency graph — never create circular deps
- Follow existing patterns in the codebase

### Ask First

- Adding new npm dependencies
- Modifying protected files (render pipeline, action manager, core types, Scene)
- Changing CI/CD workflows
- Modifying TypeScript or ESLint configuration

### Never Do

- Introduce new state management libraries
- Use React DOM rendering for canvas drawing
- Commit with ESLint warnings
- Modify `.env.production` without explicit approval
