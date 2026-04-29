# Type Safety

> TypeScript conventions for the Trellis practice demo app.

---

## Overview

Use TypeScript to make data boundaries explicit. Runtime validation is required at network boundaries once API calls exist. Internal component props should use clear local types rather than broad shared types.

---

## Type Organization

- Feature-local UI types live in `features/<feature>/<feature>.types.ts` only when they are UI-specific view models.
- API DTO types and runtime schemas live in `packages/shared/src/<domain>.ts`.
- Component prop types stay in the component file unless reused by another file.
- Use domain-specific names: `TodoDto`, `TodoView`, `CreateTodoInput`.

Example:

```typescript
// packages/shared/src/todos.ts
import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  completed: z.boolean(),
  createdAt: z.string(),
});

export type TodoDto = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

// apps/web/src/features/todos/todos.types.ts
export type TodoView = {
  id: string;
  title: string;
  isComplete: boolean;
};
```

---

## Validation

- Validate API responses before trusting them if data comes from the network.
- Use shared Zod schemas from `@trellis-practice/shared` for API request and response validation.
- Keep parsing in API modules and return typed results only after checks.
- Do not let `unknown` network data leak into components.

Example boundary:

```typescript
export async function fetchTodos(): Promise<TodoDto[]> {
  const data: unknown = await apiGet('/api/todos');
  return listTodosResponseSchema.parse(data).todos;
}
```

---

## Common Patterns

- Use discriminated unions for finite UI states.
- Use `unknown` at unsafe boundaries, then narrow it.
- Use type inference from shared schemas for cross-layer DTOs.
- Keep `null` for intentionally empty object values and `undefined` for omitted optional fields.

Example UI state:

```typescript
type TodosState =
  | { status: 'loading' }
  | { status: 'loaded'; items: TodoView[] }
  | { status: 'error'; message: string };
```

---

## Forbidden Patterns

- No `any` in application code.
- No double assertions such as `value as unknown as TodoDto`.
- No broad index signatures for structured API data.
- No non-null assertions for values that can be handled explicitly.
- No exporting component prop types by default unless another file needs them.

Wrong vs correct:

```typescript
// Wrong
const todo = response as TodoDto;

// Correct
const todo = parseTodoResponse(response);
```

---

## Common Mistakes

- Reusing backend database record types in frontend code.
- Duplicating API DTO types in `apps/web` when they already exist in `packages/shared`.
- Treating API DTOs as UI view models when the UI needs different names or derived fields.
- Adding optional fields to avoid fixing callers instead of modeling real optional behavior.
