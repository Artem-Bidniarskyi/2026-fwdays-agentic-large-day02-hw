# Conventions Rule A/B Test Report

## Rule Under Test

`.claude/rules/conventions.mdc` — Code conventions for Excalidraw components and utilities

---

### A - test with rule enabled

**Prompt used:**

```
Create an `ElementBadge` component in `packages/excalidraw/components/`
that displays the element type (rectangle, ellipse, diamond, etc.) as a
styled badge label.

Also create a small helper utility function that maps raw element type
strings (like "rectangle", "ellipse") to human-readable display names
(like "Rectangle", "Ellipse").

The component should accept an ExcalidrawElement and render the badge.
```

**Files created:**
- `packages/excalidraw/components/ElementBadge.tsx`
- `packages/excalidraw/components/elementTypeDisplayNames.ts`
- `packages/excalidraw/components/ElementBadge.scss`

---

#### Evidence of Rule Influence

| # | Rule from `conventions.mdc` | How it affected the process | Evidence in code |
|---|---|---|---|
| 1 | **PascalCase for components, camelCase for utilities** | Component file named `ElementBadge.tsx` (PascalCase). Utility file named `elementTypeDisplayNames.ts` (camelCase). Both follow the naming convention exactly. | `ElementBadge.tsx` vs `elementTypeDisplayNames.ts` |
| 2 | **`import type { X }` for type-only imports** | Type-only import syntax used for the `ExcalidrawElement` type, which is only used for type checking, not at runtime. | `import type { ExcalidrawElement } from "@excalidraw/element/types";` (line 1 of ElementBadge.tsx) |
| 3 | **Path aliases for cross-package imports: `@excalidraw/*`** | Cross-package import uses the `@excalidraw/element` alias instead of a relative path like `../../../element/types`. | `from "@excalidraw/element/types"` |
| 4 | **Relative imports for within-package references** | The utility import uses a relative path since both files are in the same package. | `from "./elementTypeDisplayNames"` (line 3 of ElementBadge.tsx) |
| 5 | **Colocated styles: `ComponentName.scss` alongside component file** | A dedicated `ElementBadge.scss` file was created next to the component, following the colocated styles convention. Not inline styles. | `import "./ElementBadge.scss"` (line 5 of ElementBadge.tsx) |
| 6 | **Named exports preferred; default exports for main/complex components** | The component uses a named export (`export const ElementBadge`), consistent with the rule that default exports are reserved for main/complex components like App, LayerUI. The utility also uses a named export. | `export const ElementBadge = ...` and `export const getElementTypeDisplayName = ...` |
| 7 | **Props: `interface` when extending HTML/React types, `type` for simple prop objects** | Used `interface` for props because it extends with an optional `className` (HTML attribute pattern). This shows awareness of the distinction. | `interface ElementBadgeProps { element: ExcalidrawElement; className?: string; }` |
| 8 | **Functional components + hooks preferred** | Created a functional component with arrow function syntax. No class component. | `export const ElementBadge = ({ element, className }: ElementBadgeProps) => { ... }` |
| 9 | **Strict mode — minimize `any`** | Used `Record<string, string>` for the type map instead of `any`. Function parameter typed as `string`, return typed as `string`. No `any` or `@ts-ignore` anywhere. | `const ELEMENT_TYPE_DISPLAY_NAMES: Record<string, string>` |

#### Structural Decisions Guided by the Rule

1. **Three-file structure:** Component (`.tsx`), utility (`.ts`), and styles (`.scss`) — matching the colocated file pattern seen throughout the codebase (`Avatar.tsx` + `Avatar.scss`, `Button.tsx` + `Button.scss`).
2. **Naming split:** PascalCase for the component file, camelCase for the utility file — directly following the rule's distinction between component and utility naming.
3. **Import ordering:** Type imports first, then local imports, then style imports — matching the codebase's import grouping convention.
4. **CSS custom properties:** Used `var(--color-on-surface)` and `var(--color-surface-mid)` instead of hardcoded colors, integrating with the project's design token system.
5. **No unnecessary dependencies:** Zero new packages. The utility is pure TypeScript with no external imports.

#### What Would Be Different Without the Rule

Without `conventions.mdc` loaded, the agent might have:
- Named the utility file `ElementBadgeUtils.ts` or `utils.ts` (PascalCase or generic name instead of camelCase descriptive name)
- Used inline `style={{...}}` instead of a colocated `.scss` file
- Used `import { ExcalidrawElement }` without the `type` keyword
- Used a relative cross-package import instead of `@excalidraw/element` alias
- Used `default export` for the component
- Used `type` instead of `interface` for props (or vice versa without consideration)
- Possibly introduced `any` in the type map or skipped typing the utility function return

---

### B - test with rule disabled

**Prompt used:** Same as Test A.

**Rule status:** `.claude/rules/conventions.mdc.off` (disabled, not loaded into context)

**Files created:**
- `packages/excalidraw/components/ElementBadge.tsx` (single file — component, utility, and styles combined)

---

#### What the Agent Did Differently

| # | Aspect | Behavior without rule | Evidence in code |
|---|---|---|---|
| 1 | **File structure** | Put the component, utility function, and styles all in a single file instead of splitting into three separate files (`.tsx`, `.ts`, `.scss`). | Only `ElementBadge.tsx` created — no `elementTypeDisplayNames.ts`, no `ElementBadge.scss` |
| 2 | **Styling approach** | Used inline `React.CSSProperties` object with hardcoded color values (`#e8e8e8`, `#333`) instead of a colocated `.scss` file with CSS custom properties. | `const badgeStyle: React.CSSProperties = { backgroundColor: "#e8e8e8", color: "#333", ... }` |
| 3 | **Type-only imports** | Used value import `import { ExcalidrawElement }` instead of `import type { ExcalidrawElement }`. | Line 2: `import { ExcalidrawElement } from "@excalidraw/element/types"` — missing `type` keyword |
| 4 | **Export style** | Used `export default function` for the component instead of a named export. | `export default function ElementBadge(...)` vs Test A's `export const ElementBadge = ...` |
| 5 | **Props definition** | Used `type` alias for props instead of `interface`. | `type ElementBadgeProps = { ... }` vs Test A's `interface ElementBadgeProps { ... }` |
| 6 | **Utility naming** | Named the utility function generically `getDisplayName` instead of the descriptive `getElementTypeDisplayName`. | `export const getDisplayName = (type: string) => { ... }` |
| 7 | **Utility placement** | Embedded the utility in the component file instead of extracting to a separate camelCase utility file. | Map and function defined inline in `ElementBadge.tsx` |
| 8 | **CSS custom properties** | Used hardcoded hex colors instead of the project's design token system (`var(--color-on-surface)`, `var(--color-surface-mid)`). | `backgroundColor: "#e8e8e8"`, `color: "#333"` |
| 9 | **Unused React import** | Imported `React` explicitly (not needed with modern JSX transform). | `import React from "react"` |

#### Specific Convention Deviations

1. **Single-file architecture:** Without the rule's guidance on colocated styles and separated utilities, the agent consolidated everything into one file. This violates the codebase pattern where every component has a companion `.scss` file (`Avatar.tsx` + `Avatar.scss`, `Button.tsx` + `Button.scss`).
2. **Default export:** The rule explicitly states named exports are preferred, with default exports reserved for main/complex components like `App`, `LayerUI`. The agent used `export default` for a simple badge component.
3. **Missing `import type`:** TypeScript strict mode convention requires `import type` for type-only imports. The agent imported `ExcalidrawElement` as a value import, which works but violates the project's ESLint rules and convention.
4. **Hardcoded colors:** The project uses CSS custom properties (`--color-*`) for theming. Hardcoded hex values mean the badge won't adapt to dark mode or theme changes.
5. **Generic utility name:** `getDisplayName` is ambiguous in a large codebase — it could refer to any display name. The rule-guided `getElementTypeDisplayName` is self-documenting.

---

## Comparison: Test A (Rule ON) vs Test B (Rule OFF)

| Dimension | Test A (Rule ON) | Test B (Rule OFF) | Impact |
|---|---|---|---|
| **File count** | 3 files (`.tsx`, `.ts`, `.scss`) | 1 file (`.tsx` only) | No separation of concerns; harder to reuse utility independently |
| **Styling** | Colocated `.scss` with CSS custom properties (`var(--color-*)`) | Inline `React.CSSProperties` with hardcoded hex colors | No dark mode support, visual inconsistency with theme |
| **Type imports** | `import type { ExcalidrawElement }` | `import { ExcalidrawElement }` | ESLint violation, unnecessary runtime import |
| **Export pattern** | Named export: `export const ElementBadge` | Default export: `export default function ElementBadge` | Violates project convention, inconsistent with sibling components |
| **Props typing** | `interface ElementBadgeProps` (extending HTML types pattern) | `type ElementBadgeProps` | Wrong construct per rule — `interface` preferred when extending |
| **Utility separation** | Separate `elementTypeDisplayNames.ts` (camelCase) | Embedded in component file | Cannot import utility without importing component |
| **Utility naming** | `getElementTypeDisplayName` (descriptive) | `getDisplayName` (generic) | Name collision risk in large codebase |
| **Design tokens** | `var(--color-on-surface)`, `var(--color-surface-mid)` | `#e8e8e8`, `#333` | Breaks theming, dark mode |
| **React import** | No unnecessary React import | `import React from "react"` | Unnecessary with modern JSX transform |

### Quantitative Summary

| Metric | Test A | Test B |
|---|---|---|
| Files created | 3 | 1 |
| Colocated SCSS file | Yes | No |
| `import type` used | Yes | No |
| Named export | Yes | No (default export) |
| CSS custom properties | Yes | No (hardcoded hex) |
| Utility in separate file | Yes | No |
| Utility name descriptiveness | High (`getElementTypeDisplayName`) | Low (`getDisplayName`) |
| ESLint-compliant imports | Yes | No |
| Dark-mode compatible | Yes | No |
| Convention violations | 0 | 6+ |

---

## Conclusion

The conventions rule (`.claude/rules/conventions.mdc`) had a **clear and systematic effect** on the generated code:

1. **File organization:** With the rule, the agent produced the canonical three-file structure (component + utility + styles) that matches every other component in the codebase. Without it, the agent collapsed everything into a single file — functional but inconsistent with the project's established patterns.

2. **Styling system:** The most impactful difference. The rule-guided version uses CSS custom properties and a colocated `.scss` file, integrating with the project's theming system (light/dark mode). The unguided version hardcodes hex colors, which would break in dark mode and create visual inconsistency.

3. **TypeScript strictness:** The rule enforced `import type` for type-only imports — a project ESLint requirement. Without the rule, the agent used a standard value import that would fail the project's `yarn test:code` linting check.

4. **Export conventions:** The rule-guided version correctly used a named export (as the project reserves `export default` for main components like `App` and `LayerUI`). Without the rule, the agent defaulted to `export default` — a common JavaScript habit but wrong for this codebase.

5. **Naming precision:** The rule produced a descriptively named, separately filed utility (`elementTypeDisplayNames.ts` with `getElementTypeDisplayName`). Without it, the agent used a generic name (`getDisplayName`) embedded in the component file — less reusable and more prone to naming collisions.

6. **Key takeaway:** Convention rules encode the **implicit standards** that make a codebase feel cohesive. Unlike architecture rules (which prevent structural errors), convention rules prevent the "death by a thousand cuts" — small deviations in naming, imports, file structure, and styling that individually seem harmless but collectively erode consistency. In this test, the unguided code would require at least 6 review comments to bring it in line with project standards, while the rule-guided code was convention-compliant from the start.