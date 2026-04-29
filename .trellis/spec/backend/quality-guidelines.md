# Quality Guidelines

> Backend quality standards for the Trellis practice demo app.

---

## Overview

Backend code should be easy to trace from route to service to repository. Prefer explicit functions, narrow modules, and tests at the layer where behavior lives.

Because this is a learning repo, do not add production-scale infrastructure until a task needs it. Document new conventions in `.trellis/spec/backend/` before relying on them in future tasks.

---

## Required Patterns

- Keep HTTP parsing in route handlers.
- Keep business rules in services.
- Keep persistence in repositories.
- Export named functions instead of default exports.
- Use TypeScript types for request DTOs, response DTOs, and repository records.
- Import cross-layer request/response schemas and DTO types from `@trellis-practice/shared`.
- Use shared error and logging helpers instead of ad hoc per-route logic.

Example service test target:

```typescript
// apps/api/src/features/todos/todos.service.test.ts
it('rejects blank todo titles', async () => {
  await expect(createTodo({ title: '   ' })).rejects.toMatchObject({
    code: 'BAD_REQUEST',
  });
});
```

---

## Forbidden Patterns

- No `any` for request bodies, database rows, or service returns.
- No raw SQL or database client calls in route handlers.
- No `console.log` in committed backend source.
- No hidden environment reads outside `apps/api/src/config/env.ts`.
- No API DTO duplication inside `apps/api` when a shared contract exists.
- No catch-all utility modules such as `helpers.ts` or `utils.ts` without a specific domain name.
- No new dependency unless the task needs it and the reason is documented in the task or PRD.

---

## Testing Requirements

- Service logic needs unit tests for success and failure cases.
- Repository code needs tests when it contains query conditions, transactions, or data mapping.
- Route tests are required when request parsing, response shape, or status codes change.
- Shared contract tests are required when DTO schemas or error code contracts change.
- For bug fixes, add a regression test that fails without the fix.
- Prefer running the affected test file first. Run broader checks only after the narrow check passes.

Minimum cases for a CRUD operation:

| Operation | Good case | Bad case |
|-----------|-----------|----------|
| Create | Valid input returns created record | Blank or invalid input returns 400 |
| Read by ID | Existing record returns 200 | Missing record returns 404 |
| Update | Valid change persists | Conflicting or invalid state returns documented error |
| Delete | Existing record is removed | Repeated delete has documented behavior |

---

## Code Review Checklist

- Does each changed file belong to the right layer?
- Are request, service, repository, and response types explicit?
- Are cross-layer contracts imported from `@trellis-practice/shared` instead of duplicated?
- Are expected errors represented by `AppError` subclasses or documented equivalents?
- Are database column names converted at the backend boundary?
- Are logs useful and free of secrets or full request bodies?
- Were narrow tests or a documented verification step run?

---

## Common Mistakes

- Adding a service that only forwards to a repository and then adding business rules in the route. If behavior exists, put it in the service.
- Returning database records directly from APIs, leaking snake_case names or internal columns.
- Expanding shared abstractions before a second feature proves the pattern.
