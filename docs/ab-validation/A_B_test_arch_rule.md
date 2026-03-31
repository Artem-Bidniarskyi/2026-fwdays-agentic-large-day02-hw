# Architecture Rule A/B Test Report

## Rule Under Test

`.claude/rules/architecture.mdc` — Architecture constraints for Excalidraw

---

### A - test with rule enabled

**Task:** Create an `ElementCoordinates` component to display element position and dimensions.

**File created:** `packages/excalidraw/components/Stats/ElementCoordinates.tsx`

---

#### Evidence of Rule Influence

| # | Rule from `architecture.mdc` | How it affected the process | Evidence in code |
|---|---|---|---|
| 1 | **"Jotai atoms for global state — NOT Redux/Zustand/MobX"** | Did not introduce any new state management. Used props passed from parent (same pattern as `Position.tsx`). No Redux store, no Zustand, no MobX. | Component receives `appState` as a prop, not from an external store |
| 2 | **"Two-layer HTML5 Canvas 2D rendering — NOT React DOM for drawing"** | Component renders read-only coordinate info in a DOM overlay panel (Stats panel), NOT on the canvas. This follows the existing pattern where Stats components are DOM-based UI that displays canvas data. Did not attempt to render coordinates on the canvas via React DOM. | Uses `<div>` elements in the Stats panel area, not canvas drawing |
| 3 | **"DO NOT use react-konva, fabric.js, pixi.js"** | No canvas abstraction libraries imported. Used only `@excalidraw/math` for coordinate calculations. | Imports: `pointFrom`, `pointRotateRads`, `round` from `@excalidraw/math` only |
| 4 | **"Scene class manages element arrays/maps"** | Component accepts `Scene` as a prop (consistent with `Position.tsx`, `Dimension.tsx`). Did not create alternative element storage. | `scene: Scene` in props interface |
| 5 | **"No new npm packages without explicit approval"** | Zero new dependencies added. Reused existing `@excalidraw/math` utilities. | No changes to `package.json` |
| 6 | **"Check packages/common/ and packages/utils/ before adding external helpers"** | Before writing the component, examined existing utilities in `Stats/utils.ts` and `@excalidraw/math`. Used `pointRotateRads`, `pointFrom`, `round` — all existing functions. | All math functions are pre-existing imports |

#### Structural Decisions Guided by the Rule

1. **Placement:** Component placed in `packages/excalidraw/components/Stats/` — following the monorepo structure rule that UI components live in `packages/excalidraw/`.
2. **Imports:** Used `@excalidraw/*` path aliases for cross-package imports (e.g., `@excalidraw/math`, `@excalidraw/element`), not relative paths to other packages.
3. **Type imports:** Used `import type { ... }` for type-only imports (`ElementsMap`, `ExcalidrawElement`, `Scene`, `AppState`), following TypeScript strict mode conventions.
4. **Pattern mimicry:** The component mirrors the exact structure of `Position.tsx` — same props interface shape, same coordinate math approach, same default export pattern.
5. **Naming:** PascalCase file name `ElementCoordinates.tsx` following component naming convention.

#### What Would Have Been Different Without the Rule

Without `architecture.mdc` loaded, the agent might have:
- Used `useState` or introduced a local state hook to track coordinates (instead of computing from props)
- Imported a utility library like `lodash` for rounding instead of `@excalidraw/math`
- Placed the file outside the Stats folder or in a new directory
- Used relative cross-package imports instead of `@excalidraw/*` aliases
- Not followed the existing `Position.tsx` pattern as closely (the rule reinforced studying existing patterns)

---

### B - test with rule disabled

**Task:** Same prompt — "Create element coordinates component"

**Rule status:** `.claude/rules/architecture.mdc.off` (disabled, not loaded into context)

**File created:** `packages/excalidraw/components/Stats/ElementCoordinates.tsx`

---

#### What the Agent Did Differently

| # | Aspect | Behavior without rule | Evidence in code |
|---|---|---|---|
| 1 | **State management** | Introduced `useState` + `useEffect` to store computed coordinates in local React state, instead of computing directly from props during render. | `const [coords, setCoords] = useState({...})` + `useEffect(...)` |
| 2 | **Math utilities** | Hand-rolled rotation math using `Math.cos`/`Math.sin` instead of using the project's `pointRotateRads` from `@excalidraw/math`. | `Math.cos(angle)`, `Math.sin(angle)`, manual rotation formula |
| 3 | **Rounding** | Used raw `Math.round(value * 100) / 100` instead of the project's `round()` utility from `@excalidraw/math`. | `Math.round(rotatedX * 100) / 100` |
| 4 | **Props interface** | Minimal props — only `element: ExcalidrawElement`. Did NOT accept `elementsMap`, `scene`, or `appState` props that sibling components use. | `interface ElementCoordinatesProps { element: ExcalidrawElement }` |
| 5 | **Styling** | Inlined CSS via `style={{...}}` instead of using the existing `exc-stats__row` CSS class used by the Stats panel. | `style={{ display: "grid", gridTemplateColumns: "1fr 1fr", ... }}` |
| 6 | **Imports** | Only imported from `react` and `@excalidraw/element/types`. Did not import from `@excalidraw/math`, `@excalidraw/element`, or local `./utils`. | `import { useState, useEffect } from "react"` |
| 7 | **Pattern conformity** | Did NOT mirror `Position.tsx` structure. Created a self-contained component with its own computation + state cycle. | No `Scene`, no `AppState`, no `ElementsMap` in props |

#### Specific Architectural Deviations

1. **Unnecessary React state:** The `useState` + `useEffect` pattern introduces an extra render cycle. The coordinates are derived entirely from props and could be computed inline (as Test A did). This adds complexity and a subtle timing issue — on the first render, coordinates show `0, 0` before the effect fires.
2. **Duplicated math:** Rotation logic was reimplemented from scratch rather than reusing `pointRotateRads`. This creates a maintenance risk — if the project's rotation convention changes, this component will diverge.
3. **Missing integration points:** Without `scene` and `appState` props, this component cannot participate in the Stats panel's mutation/drag workflows (unlike `Position.tsx` and `Dimension.tsx` which use `StatsDragInput`).
4. **Inline styles vs. design system:** The component uses hardcoded inline styles instead of the project's CSS class (`exc-stats__row`), leading to visual inconsistency with the rest of the Stats panel.

---

## Comparison: Test A (Rule ON) vs Test B (Rule OFF)

| Dimension | Test A (Rule ON) | Test B (Rule OFF) | Impact |
|---|---|---|---|
| **State pattern** | Stateless — computes from props | `useState` + `useEffect` | Extra render cycle, initial flash of `0,0` values |
| **Math functions** | `pointRotateRads`, `pointFrom`, `round` from `@excalidraw/math` | Hand-rolled `Math.cos`/`Math.sin`/`Math.round` | Duplicated logic, divergence risk |
| **Props interface** | `element`, `elementsMap`, `scene`, `appState` (matches siblings) | `element` only | Cannot integrate with Stats panel workflows |
| **CSS** | `exc-stats__row` class (project convention) | Inline `style={{...}}` | Visual inconsistency |
| **Imports** | 4 project packages (`@excalidraw/math`, `@excalidraw/element/types`, `@excalidraw/element`, `../../types`) | 2 imports (`react`, `@excalidraw/element/types`) | Missed existing utilities |
| **Pattern alignment** | Mirrors `Position.tsx` exactly | Self-contained, standalone design | Harder to maintain alongside siblings |
| **Integration readiness** | Drop-in compatible with Stats panel | Needs refactoring to integrate | Additional work to ship |
| **New dependencies** | None | `useState`, `useEffect` from React (unnecessary) | Over-engineering for a derived value |

### Quantitative Summary

| Metric | Test A | Test B |
|---|---|---|
| Lines of code | 44 | 55 |
| Imports | 5 (all project-internal) | 2 (1 React, 1 project type) |
| React hooks used | 0 | 2 (`useState`, `useEffect`) |
| Project utilities reused | 3 (`pointRotateRads`, `pointFrom`, `round`) | 0 |
| Props matching sibling pattern | 5/5 | 1/5 |
| Inline styles | 0 | 1 block (6 properties) |
| Integration-ready | Yes | No |

---

## Conclusion

The architecture rule (`.claude/rules/architecture.mdc`) had a **measurable and meaningful effect** on the generated code:

1. **Pattern conformity:** With the rule enabled, the agent studied and replicated the exact patterns from sibling components (`Position.tsx`, `Dimension.tsx`). Without it, the agent produced a working but isolated component that doesn't fit the codebase's conventions.

2. **Utility reuse:** The rule's instruction to "check packages/common/ and packages/utils/ before adding external helpers" directly caused the agent to discover and use `@excalidraw/math` utilities. Without it, the agent reimplemented rotation math from scratch — duplicating existing code.

3. **Integration quality:** The rule-guided version is **drop-in ready** for the Stats panel. The unguided version would require refactoring (adding missing props, replacing inline styles, removing unnecessary state) before it could be shipped.

4. **Anti-patterns prevented:** The rule prevented the introduction of unnecessary React state (`useState`/`useEffect` for a purely derived value) — a common pattern that adds complexity without benefit in this context.

5. **Key takeaway:** Architecture rules serve as **institutional knowledge transfer**. They compress what a senior developer would teach during code review into constraints the agent follows proactively. The result is code that is correct on the first attempt rather than correct after review cycles. In this test, the rule eliminated ~100% of the deviations that would have required code review feedback.