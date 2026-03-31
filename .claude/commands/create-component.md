---
name: create-component
description: Scaffolds a new Excalidraw React component following project conventions. Use when the user asks to create, scaffold, or add a new component.
disable-model-invocation: true
allowed-tools: Read, Write, Grep, Glob, Bash
argument-hint: [ComponentName] [package? (default: excalidraw)]
---

# Create Component

Create a new component named **$0** in the `$1` package (default: `packages/excalidraw/components/`).

## Steps

1. **Determine location**:
   - If `$1` is specified, place in `packages/$1/`
   - Default: `packages/excalidraw/components/$0/`
   - Simple component: single file `$0.tsx`
   - Complex component (with subcomponents): folder `$0/$0.tsx`

2. **Create component file** (`$0.tsx`):

```tsx
import { useAtomValue } from "../../editor-jotai";
import type { AppState } from "../../types";

import "./$0.scss";

type $0Props = {
  // TODO: define props
};

export const $0 = ({ }: $0Props) => {
  return (
    <div className="$0">
      {/* TODO: implement */}
    </div>
  );
};
```

Conventions to follow:
- Functional component with hooks — NO class components
- `type` for simple props, `interface` if extending HTML/React types
- Named export (use default export only for large top-level components)
- Use `import type` for type-only imports
- Cross-package imports via `@excalidraw/*` aliases
- Jotai state via `useAtomValue`/`useSetAtom` from `../../editor-jotai`

3. **Create stylesheet** (`$0.scss`):

```scss
@import "../../css/variables.module";

.$0 {
  // TODO: implement styles
}
```

4. **Create test file** (`$0.test.tsx`):

```tsx
import { render } from "../../tests/test-utils";
import { Excalidraw } from "../../index";

describe("$0", () => {
  beforeEach(async () => {
    await render(<Excalidraw />);
  });

  it("should render", () => {
    // TODO: implement test
  });
});
```

Conventions:
- Use custom `render()` from `tests/test-utils.ts`, not raw `@testing-library/react`
- Use `API.createElement()`, `Pointer`, `Keyboard` helpers for interaction tests
- Colocate test next to component file

5. **Add export** — If the component is part of the public API, add it to `packages/excalidraw/index.tsx`

6. **Verify** — Run `yarn test:typecheck` to confirm no type errors

## Output

- List of created files
- Remind user to:
  - Fill in props and implementation
  - Add to parent component's imports
  - Update exports in index.tsx if public API