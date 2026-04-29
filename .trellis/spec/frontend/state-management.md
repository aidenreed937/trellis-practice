# State Management

> State conventions for the Trellis practice demo app.

---

## Overview

Start with React local state and feature hooks. Add global state only when multiple distant parts of the app need the same client-owned state. Server data should be fetched through API modules and feature hooks.

---

## State Categories

| Category | Owner | Examples |
|----------|-------|----------|
| Local UI state | Component | Input text, open menu, selected tab |
| Feature state | Feature hook | Todo list loading state, filter state |
| Server state | API + feature hook | Todos loaded from `/api/todos` |
| URL state | Router/search params | Filter visible in URL, selected item ID |
| Global client state | App-level provider only when needed | Theme, authenticated viewer |

---

## When To Use Global State

Use global state only when all are true:

- The state is client-owned, not just cached server data.
- At least two distant feature areas need it.
- Passing props would make ownership unclear.
- URL state is not a better fit.

Do not add Redux, Zustand, Jotai, or Context-based global stores for the initial todo demo unless a task explicitly requires it.

---

## Server State

- Keep fetch functions in `apps/web/src/api/`.
- Keep loading/error/reload state in a feature hook such as `useTodos`.
- Map API DTOs to UI view models before passing data deep into presentational components.
- Use optimistic updates only when the failure rollback behavior is documented and tested.

Example mapping:

```typescript
function toTodoView(todo: TodoDto): TodoView {
  return {
    id: todo.id,
    title: todo.title,
    isComplete: todo.completed,
  };
}
```

---

## Derived State

- Prefer deriving values during render with plain functions.
- Use `useMemo` only for expensive calculations or stable identity needed by child components.
- Do not mirror props into state unless the component intentionally supports draft editing.

Correct:

```typescript
const visibleTodos = filterTodos(todos, filter);
```

Avoid:

```typescript
const [visibleTodos, setVisibleTodos] = useState<TodoView[]>([]);

useEffect(() => {
  setVisibleTodos(filterTodos(todos, filter));
}, [todos, filter]);
```

---

## Common Mistakes

- Promoting form input state to global state.
- Duplicating server data in both hook state and component state.
- Storing derived values that can be calculated from existing state.
