# Error Handling

> Backend error contracts for the Trellis practice demo app.

---

## Overview

Errors should be explicit at boundaries and boring inside modules. Route handlers convert thrown application errors into a consistent JSON response. Services throw typed application errors for expected business failures. Unknown errors are logged and returned as a generic internal error.

---

## Error Types

Define a small `AppError` hierarchy in `apps/api/src/shared/errors.ts`.

```typescript
export type ErrorCode =
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: ErrorCode,
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}
```

---

## Error Handling Patterns

- Validate request bodies at the route boundary and return `400 BAD_REQUEST` for shape errors.
- Throw `AppError` subclasses for expected failures such as not found or duplicate records.
- Do not catch an error only to rethrow the same error.
- Catch errors at one HTTP boundary middleware or wrapper.
- Preserve original errors in logs, not in client responses.

Correct boundary pattern:

```typescript
export async function getTodoHandler(req: Request) {
  const id = parseId(req.params.id);
  const todo = await getTodo(id);
  return json({ todo });
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return json({ error: { code: error.code, message: error.message } }, error.status);
  }

  logger.error({ error }, 'Unhandled API error');
  return json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, 500);
}
```

---

## API Error Responses

All API errors use this JSON shape:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found"
  }
}
```

Validation errors may include field details:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid request body",
    "fields": {
      "title": "Required"
    }
  }
}
```

---

## Validation Matrix

| Situation | Status | Code | Client message |
|-----------|--------|------|----------------|
| Invalid JSON or body shape | 400 | `BAD_REQUEST` | Safe validation summary |
| Missing record requested by ID | 404 | `NOT_FOUND` | Resource-specific message |
| Duplicate unique value | 409 | `CONFLICT` | Conflict summary |
| Unexpected exception | 500 | `INTERNAL_ERROR` | `Internal server error` |

---

## Forbidden Patterns

- Do not return raw `Error.message` for unknown errors.
- Do not use string comparisons like `if (error.message.includes(...))` for control flow.
- Do not return different error response shapes from different routes.
- Do not swallow errors and return empty data unless empty data is an explicit success case.

---

## Common Mistakes

- Treating missing records as `null` all the way to the client. Convert to `NotFoundError` when the route asks for a specific ID.
- Logging expected validation errors as server errors. Validation failures are client errors and should not pollute error logs.
- Adding a new `ErrorCode` without documenting its status code and test expectations here.
