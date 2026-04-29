# Database Guidelines

> Persistence conventions for the Trellis practice demo app.

---

## Overview

Use SQLite with Kysely for the first learning demo because it is local, easy to reset, type-aware, and enough for CRUD workflows. Keep persistence behind repository modules so the HTTP and service layers do not depend on database details.

If a future task changes the database or query layer, update this file before implementing the schema or repository code.

---

## Query Patterns

- Repository modules are the only feature files that execute database queries.
- Return plain domain records from repositories. Convert to API response DTOs in route or service code.
- Prefer explicit column lists over `select *` so schema changes are reviewable.
- Keep one transaction boundary in the service when an operation writes multiple tables.
- Batch related reads when a request needs multiple records; avoid one query per item in loops.

Example repository shape:

```typescript
// apps/api/src/features/todos/todos.repo.ts
export type TodoRecord = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export async function selectTodos(): Promise<TodoRecord[]> {
  return db
    .selectFrom('todos')
    .select(['id', 'title', 'completed', 'created_at as createdAt'])
    .orderBy('created_at', 'desc')
    .execute();
}
```

---

## Migrations

- Store migrations in `apps/api/src/db/migrations/`.
- Name files with an ordered prefix and short description: `0001_create_todos.sql`.
- Migrations must be forward-only for the learning demo. If rollback support is introduced later, document the command and file format here first.
- Schema changes must include a repository or test update in the same task.
- Local database lifecycle commands must be exposed from the root package as `pnpm db:migrate`, `pnpm db:seed`, and `pnpm db:reset`.
- SQLite runtime files belong under `apps/api/data/` and must be gitignored.

Example migration:

```sql
-- apps/api/src/db/migrations/0001_create_todos.sql
create table todos (
  id text primary key,
  title text not null,
  completed integer not null default 0,
  created_at text not null
);

create index todos_created_at_idx on todos (created_at);
```

---

## Naming Conventions

- Tables use plural snake_case nouns: `todos`, `todo_lists`.
- Columns use snake_case: `created_at`, `owner_id`.
- TypeScript properties use camelCase and are mapped at the repository boundary.
- Primary keys are `id` unless a table has a documented composite key.
- Foreign keys use `<singular_table>_id`: `todo_id`, `user_id`.
- Indexes use `<table>_<columns>_idx`: `todos_created_at_idx`.

---

## Validation And Errors

| Case | Repository behavior | Service behavior |
|------|---------------------|------------------|
| Record missing | Return `null` or empty array | Convert to `NotFoundError` when absence is exceptional |
| Unique conflict | Let database raise or return conflict marker | Convert to `ConflictError` |
| Invalid input | Not accepted by repository | Validate before calling repository |
| Multi-write failure | Roll back transaction | Throw one domain error to route layer |

---

## Common Mistakes

- Mixing SQL column names into frontend or API DTOs. Convert `created_at` to `createdAt` before leaving the backend.
- Hiding multiple writes inside repositories. Services should make transaction boundaries obvious.
- Adding a column without updating seed data, tests, response DTOs, and validation schemas.
