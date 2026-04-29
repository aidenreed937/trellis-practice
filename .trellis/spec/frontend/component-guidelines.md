# Component Guidelines

> Component conventions for the Trellis practice demo app.

---

## Overview

Components should be small, typed, and accessible. Prefer composition over configuration-heavy components. Keep feature components close to the feature and promote shared components only when reuse is proven.

---

## Component Structure

- Export named components.
- Define props directly above the component.
- Keep event handlers local when they are simple; extract only when they represent reusable behavior.
- Keep render branches explicit and readable.
- Use semantic HTML before custom ARIA.

Example:

```typescript
type TodoListProps = {
  todos: TodoView[];
  onToggleTodo: (id: string) => void;
};

export function TodoList({ todos, onToggleTodo }: TodoListProps) {
  if (todos.length === 0) {
    return <p>No todos yet.</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <button type="button" onClick={() => onToggleTodo(todo.id)}>
            {todo.title}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Props Conventions

- Name callback props by user intent: `onSubmitTodo`, `onToggleTodo`.
- Avoid boolean props that create unrelated visual variants. Split components when behavior diverges.
- Accept `children` only for layout or wrapper components.
- Keep server DTOs out of presentational components when a view model makes the UI clearer.

Good prop boundary:

```typescript
type TodoFormProps = {
  isSaving: boolean;
  onSubmitTodo: (input: { title: string }) => Promise<void>;
};
```

Avoid:

```typescript
type TodoFormProps = {
  mode: 'create' | 'edit' | 'bulk' | 'readonly';
  data: unknown;
  onAction: (action: string, payload: unknown) => void;
};
```

---

## Styling Patterns

- Start with plain CSS in `apps/web/src/styles/global.css` for tokens and layout defaults.
- Use component CSS files or CSS modules when component-specific styles grow beyond simple class names.
- Keep layout styles with the component that owns the layout.
- Do not add Tailwind, styled-components, or a component library unless a task explicitly chooses one and updates this guide.

---

## Accessibility

- Use real buttons for actions and links for navigation.
- Every input must have a visible label or an accessible label.
- Buttons must include `type="button"` unless they submit a form.
- Loading and error states must be visible to screen readers when they block user action.
- Do not remove focus outlines without replacing them with an accessible focus style.

Example form pattern:

```typescript
<form onSubmit={handleSubmit}>
  <label htmlFor="todo-title">Title</label>
  <input id="todo-title" value={title} onChange={handleTitleChange} />
  <button type="submit" disabled={isSaving}>Save</button>
</form>
```

---

## Common Mistakes

- Building clickable `div` elements instead of using `button`.
- Passing raw API errors directly into UI without mapping them to user-safe messages.
- Creating a generic component with many optional props before two real use cases exist.
