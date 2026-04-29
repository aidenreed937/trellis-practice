# Directory Structure

> Frontend organization for the Trellis practice demo app.

---

## Overview

Organize frontend code by feature, with shared UI and utilities separated only when reuse is real. Components should be easy to find from a route or feature folder.

Because this repository currently contains only Trellis scaffolding, examples below show the target layout for the first demo frontend. When real code is added, update the examples to reference existing files.

---

## Directory Layout

```text
apps/web/src/
├── main.tsx                 # React entrypoint
├── App.tsx                  # App shell and route composition
├── styles/
│   └── global.css           # Reset, tokens, global element styles
├── api/
│   ├── client.ts            # Fetch wrapper and API error handling
│   └── todos.ts             # Todo API calls and DTO mapping
├── features/
│   └── todos/
│       ├── TodoPage.tsx
│       ├── TodoList.tsx
│       ├── TodoForm.tsx
│       ├── useTodos.ts
│       └── TodoPage.test.tsx
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── TextField.tsx
│   └── hooks/
│       └── useDebouncedValue.ts
└── test/
    └── render.tsx           # Test render helper
```

---

## Module Organization

- Put route-level views in `features/<feature>/<Feature>Page.tsx`.
- Keep feature-specific components inside the feature directory.
- Move components to `shared/components/` only after at least two features use them.
- Keep API functions under `apps/web/src/api/`; components and hooks should not build raw `fetch` calls inline.
- Keep test helpers under `apps/web/src/test/`.
- Import API DTOs and schemas from `@trellis-practice/shared`; do not duplicate cross-layer contracts in feature files.
- Use Vite dev proxy so frontend code calls `/api/*` rather than hard-coding `http://localhost:3001`.

Example feature imports:

```typescript
// apps/web/src/features/todos/TodoPage.tsx
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import { useTodos } from './useTodos';

export function TodoPage() {
  const todos = useTodos();
  return <TodoList todos={todos.items} />;
}
```

---

## Naming Conventions

- React components use PascalCase file names: `TodoList.tsx`.
- Hooks use camelCase with `use` prefix: `useTodos.ts`.
- Feature type files use `<feature>.types.ts`: `todos.types.ts`.
- Feature type files are only for UI-only view models. API DTOs belong in `packages/shared`.
- API files use domain nouns: `todos.ts`, `auth.ts`.
- CSS module files match component names if CSS modules are introduced: `TodoList.module.css`.

---

## Forbidden Patterns

- Do not create broad `components/`, `hooks/`, or `utils/` folders at the app root for feature-specific code.
- Do not import backend files into frontend code. Share contracts through `@trellis-practice/shared`.
- Do not place tests far from the feature they validate unless they are app-level integration tests.
- Do not introduce path aliases until the folder depth makes relative imports hard to read.

---

## Common Mistakes

- Promoting a component to shared after one use. Keep it local until reuse is real.
- Putting API calls directly in button handlers across multiple components. Centralize API calls in `apps/web/src/api/` and stateful fetch logic in hooks.
- Mixing route layout, data fetching, and item rendering in one large component.
