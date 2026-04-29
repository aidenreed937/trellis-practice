# Directory Structure

> Backend organization for the Trellis practice demo app.

---

## Overview

The backend is organized by feature. Routes define HTTP boundaries, services hold business logic, repositories own persistence, and shared utilities stay small and framework-neutral.

Because this repository currently contains only Trellis scaffolding, examples below show the target layout for the first demo backend. When real code is added, update the examples to reference existing files.

---

## Directory Layout

```text
apps/api/src/
├── app.ts                    # App wiring: middleware, route mounting
├── server.ts                 # Process entrypoint and listen lifecycle
├── config/
│   └── env.ts                # Environment parsing and defaults
├── db/
│   ├── client.ts             # Kysely + SQLite client factory
│   ├── migrate.ts            # Apply SQL migrations
│   ├── seed.ts               # Seed local demo data
│   ├── reset.ts              # Reset local SQLite data
│   └── migrations/           # Ordered SQL migration files
├── features/
│   └── todos/
│       ├── todos.routes.ts   # HTTP handlers and request parsing
│       ├── todos.service.ts  # Business operations
│       ├── todos.repo.ts     # Database reads/writes
│       └── todos.test.ts     # Unit tests for service/repo behavior
└── shared/
    ├── errors.ts             # AppError and HTTP error helpers
    └── logger.ts             # Logger setup
```

Shared API contracts live outside the app package:

```text
packages/shared/src/
├── api-error.ts              # Error response schema and codes
├── todos.ts                  # Todo DTO and request/response schemas
└── index.ts                  # Public exports
```

---

## Module Organization

- Add new backend features under `apps/api/src/features/<feature>/`.
- Keep a feature's route, service, repository, tests, and local types together.
- Put only cross-feature utilities in `apps/api/src/shared/`.
- Put API DTOs and validation schemas used by both apps in `packages/shared/`.
- Put process startup code in `server.ts`; do not mix listen lifecycle with route logic.
- Keep `app.ts` side-effect-light so tests can import the app without opening a port.

Example feature boundary:

```typescript
// apps/api/src/features/todos/todos.routes.ts
import { createTodo, listTodos } from './todos.service';

export async function listTodosHandler() {
  const todos = await listTodos();
  return { status: 200, body: { todos } };
}
```

```typescript
// apps/api/src/features/todos/todos.service.ts
import { insertTodo, selectTodos } from './todos.repo';

export async function listTodos() {
  return selectTodos();
}
```

---

## Naming Conventions

- Directories use kebab-case: `features/todo-lists/`.
- Feature files use `<feature>.<role>.ts`: `todos.service.ts`, `todos.repo.ts`.
- Exported service functions use verb phrases: `createTodo`, `completeTodo`, `listTodos`.
- Repository functions describe persistence operations: `selectTodoById`, `insertTodo`, `updateTodoStatus`.
- Request/response DTOs use explicit names: `CreateTodoRequest`, `TodoResponse`.

---

## Forbidden Patterns

- Do not put database queries directly in route handlers. Use a repository module.
- Do not create a generic `utils.ts` dumping ground. Name utilities by purpose.
- Do not import frontend code from backend modules.
- Do not make feature modules reach into another feature's repository. Share through a service or move common logic to `shared/` only when reuse is real.

---

## Common Mistakes

- Placing validation in both routes and services with different rules. Parse request shape at the route boundary, then enforce business rules in the service.
- Creating shared helpers after only one use. Wait for a second real use unless the helper represents a clear boundary such as validation or logging.
- Starting the HTTP server from files used by tests. Keep the listener in `server.ts`.
