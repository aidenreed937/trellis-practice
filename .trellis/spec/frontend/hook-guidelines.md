# Hook Guidelines

> Hook conventions for the Trellis practice demo app.

---

## Overview

Hooks should package stateful behavior, not hide simple calculations. Keep data-fetching hooks feature-specific until reuse is real. Components should remain readable when calling hooks: input at the top, event handlers next, JSX last.

---

## Custom Hook Patterns

- Name every custom hook with the `use` prefix.
- Return an object when the hook exposes more than one value.
- Keep hook parameters explicit and typed.
- Do not call hooks conditionally.
- Do not hide navigation, global side effects, or unrelated mutations inside a hook unless the hook name makes that behavior obvious.

Example:

```typescript
type UseTodosResult = {
  items: TodoView[];
  isLoading: boolean;
  errorMessage: string | null;
  createTodo: (input: { title: string }) => Promise<void>;
};

export function useTodos(): UseTodosResult {
  // Feature-specific stateful data loading belongs here.
}
```

---

## Data Fetching

- API modules own raw HTTP calls.
- Hooks own loading, error, retry, and refresh state.
- Components call hooks and render states; they should not duplicate fetch lifecycle logic.
- If server-state complexity grows, introduce a library such as TanStack Query in a dedicated task and update this file first.

Layer split:

```typescript
// apps/web/src/api/todos.ts
export async function fetchTodos(): Promise<TodoDto[]> {
  return apiGet('/api/todos');
}

// apps/web/src/features/todos/useTodos.ts
export function useTodos() {
  const [items, setItems] = useState<TodoView[]>([]);
  // Loading and error state stay here.
}
```

---

## Naming Conventions

- `useTodos` loads and mutates todo list state.
- `useTodoFilters` owns local filter state.
- `useDebouncedValue` is shared only when multiple features use it.
- Avoid names like `useData`, `useApi`, or `useManager` because they hide intent.

---

## Forbidden Patterns

- Do not put raw `fetch` calls directly in multiple components.
- Do not return arrays from project hooks when an object would make call sites clearer.
- Do not use effects to derive state that can be calculated during render.
- Do not suppress hook dependency lint warnings without documenting the reason in code and tests.

---

## Common Mistakes

- Combining unrelated concerns in one hook, such as filters, API mutation, and keyboard shortcuts.
- Forgetting to cancel or ignore stale async results when inputs change quickly.
- Returning unstable callbacks that cause child components or effects to rerun unnecessarily.
