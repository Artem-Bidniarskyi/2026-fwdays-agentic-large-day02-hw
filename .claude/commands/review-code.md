---
name: review-code
description: Reviews code changes for Excalidraw conventions, security, performance, and correctness. Use when the user asks to review code, check a PR, or validate changes.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [file path, PR number, or "staged" for git staged changes]
---

# Review Code

Review the following code: $ARGUMENTS

## What to review

Get the diff to review:
- If a file path is given, read that file and check recent changes with `git diff` on it
- If a PR number is given, use `gh pr diff $0`
- If "staged" is given, use `git diff --cached`
- If no argument, use `git diff` for unstaged changes

## Checklist

### Architecture & Conventions
- [ ] State changes go through ActionManager or Jotai atoms — not direct mutation
- [ ] Canvas rendering stays in the two-layer pipeline (StaticCanvas/InteractiveCanvas)
- [ ] Cross-package imports use `@excalidraw/*` aliases, not relative paths
- [ ] No modifications to protected files (Renderer.ts, restore.ts, manager.tsx, types.ts, Scene.ts) without justification
- [ ] Functional components preferred (class components only if extending App.tsx)
- [ ] `import type` used for type-only imports

### Security
- [ ] User-provided URLs pass through `normalizeLink()` or `toValidURL()`
- [ ] No `innerHTML`/`dangerouslySetInnerHTML` with user-controlled content
- [ ] No `eval()`, `new Function()`, `document.write()`
- [ ] Iframe embeds validated against domain whitelist
- [ ] `postMessage` calls specify explicit `targetOrigin`

### TypeScript
- [ ] No `any` types introduced — use proper typing
- [ ] No `@ts-ignore` or `@ts-expect-error` added
- [ ] New types added to appropriate package (common types → `packages/common/`, element types → `packages/element/`)

### Performance
- [ ] No expensive operations in render paths
- [ ] Element lookups use `elementsMap` (Map) not array scans
- [ ] Memoization where appropriate for expensive computations

### Testing
- [ ] Changes have corresponding test updates
- [ ] Tests use project helpers: `API.createElement()`, `Pointer`, `Keyboard`, `UI`
- [ ] Snapshots updated if visual/structural changes (`yarn test:update`)

## Output Format

Provide review as:

### Summary
One-paragraph overview of the changes.

### Issues Found
List each issue with severity (🔴 critical / 🟡 warning / 🔵 suggestion), file:line, and explanation.

### Approved / Changes Requested
Final verdict with reasoning.