---
name: codebase-explore
description: Explores and explains unfamiliar areas of the Excalidraw monorepo. Maps key files, data flow, and cross-package dependencies. Use when the user asks to explore, investigate, or understand how something works.
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [area or feature to explore]
context: fork
agent: Explore
---

# Skill: Codebase Explorer

## When to use

When you need to understand an unfamiliar area of the codebase.
Triggered by: "explore", "investigate", "how does X work?"

## Inputs

- Area of interest: `$ARGUMENTS`

## Monorepo Context

Packages form a dependency chain — explore in this order for full understanding:

```
@excalidraw/common → @excalidraw/math → @excalidraw/element → @excalidraw/excalidraw
```

Key entry points per package:
- `packages/common/src/index.ts` — shared utilities, constants
- `packages/math/src/index.ts` — geometry, vectors, transforms
- `packages/element/src/index.ts` — element types, Scene class
- `packages/excalidraw/index.tsx` — main editor, App component, actions
- `excalidraw-app/index.tsx` — web app bootstrap (Firebase, Sentry, PWA)

## Steps

1. **Locate** — Find relevant files using Glob patterns and Grep searches
   - Start with `packages/excalidraw/` for editor features
   - Check `packages/element/` for element-related logic
   - Check `packages/common/` for shared utilities
2. **Read entry points** — Read the main file or index of the area, look for top-level comments and exports
3. **Map key files** — List files and their responsibilities in the area
4. **Trace data flow** — Follow the path: entry point → state changes → rendering
   - State: Jotai atoms (`editor-jotai.ts`) or ActionManager (`actions/manager.tsx`)
   - Elements: Scene class (`packages/element/src/Scene.ts`)
   - Rendering: `renderer/staticScene.ts` and `renderer/interactiveScene.ts`
5. **Trace cross-package dependencies** — Check imports from `@excalidraw/*` packages to understand the dependency chain
6. **Check tests** — Look for colocated `.test.tsx` files or `tests/` folders for usage examples and expected behavior
7. **Summarize findings**

## Outputs

- **Purpose**: What this area does and why it exists
- **Key files**: List with one-line descriptions
- **Data flow**: Entry point → processing → state update → render
- **Cross-package dependencies**: Which `@excalidraw/*` packages are imported
- **Related files**: For deeper investigation

## Safety

- READ-ONLY — do not modify any files during exploration
- Verify findings against actual code, not assumptions
- Do not expose secrets from `.env.*` files in summaries