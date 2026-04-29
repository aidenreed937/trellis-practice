# Logging Guidelines

> Backend logging conventions for the Trellis practice demo app.

---

## Overview

Use structured logs for backend events. Logs should help diagnose request flow, data mutations, and unexpected failures without exposing secrets or personal data.

The first backend implementation should expose a single logger from `apps/api/src/shared/logger.ts`. If a logging library is added, configure it there and keep feature modules dependent on the shared logger only.

---

## Log Levels

| Level | Use for | Examples |
|-------|---------|----------|
| `debug` | Local diagnosis that is too noisy for normal output | Query timing during development, feature flag decisions |
| `info` | Expected lifecycle and user-visible operations | Server started, todo created, migration completed |
| `warn` | Recoverable unusual behavior | Invalid repeated client request, retryable dependency issue |
| `error` | Unexpected failures requiring investigation | Unhandled exception, failed migration, transaction rollback |

---

## Structured Logging

- Log an object plus a short message.
- Include stable identifiers such as `requestId`, `todoId`, or `migration` when available.
- Use camelCase field names in TypeScript log objects.
- Keep messages human-readable and fields machine-filterable.

Example:

```typescript
logger.info({ requestId, todoId: todo.id }, 'Todo created');
logger.error({ requestId, error }, 'Unhandled API error');
```

---

## What To Log

- Application startup and shutdown.
- Migration start, success, and failure.
- Mutating operations at `info` level with IDs, not full payloads.
- Unexpected exceptions with stack traces through the logger's `error` field.
- Slow operations once a threshold is introduced and documented.

---

## What Not To Log

- Secrets, tokens, passwords, cookies, or authorization headers.
- Full request bodies unless explicitly scrubbed.
- Personal data that is not needed for debugging.
- Noisy successful read requests unless request logging middleware already handles them.

Wrong vs correct:

```typescript
// Wrong: logs full input, including fields that may become sensitive later.
logger.info({ body: req.body }, 'Create todo request');

// Correct: logs the operation and stable result identifier.
logger.info({ requestId, todoId }, 'Todo created');
```

---

## Common Mistakes

- Using `console.log` in feature code. Use the shared logger so output format is consistent.
- Logging and throwing a handled error in every layer. Log at the boundary that handles the error.
- Adding high-cardinality or large objects to every log line.
