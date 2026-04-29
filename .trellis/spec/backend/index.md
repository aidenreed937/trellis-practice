# Backend Development Guidelines

> Project-specific backend conventions for the Trellis practice demo app.

---

## Overview

This repository is a Trellis learning workspace. It does not contain application code yet. These backend guidelines define the conventions for the small demo app that will be built next so future AI sessions have concrete, project-specific rules to follow.

The planned backend is a small TypeScript HTTP API with feature modules, explicit service functions, and repository modules for persistence. Keep the backend boring: readable module boundaries, predictable error responses, and minimal abstractions.

---

## Pre-Development Checklist

Before changing backend code, read the files that match the task:

- `directory-structure.md` for new files, modules, routes, services, or utilities.
- `database-guidelines.md` for schema, persistence, migrations, transactions, or query changes.
- `error-handling.md` for API errors, validation errors, or exception boundaries.
- `logging-guidelines.md` for request logging, operational events, or debugging output.
- `quality-guidelines.md` for tests, linting, review criteria, and forbidden patterns.
- `../guides/index.md` for shared thinking triggers.

---

## Quality Check

Before considering backend work complete:

- Read `quality-guidelines.md` and check the changed code against the review checklist.
- Read any topic-specific guideline touched by the change.
- Run the narrowest relevant tests first, then typecheck or build if a script exists.
- If the repository still has no backend package or scripts, state that verification is limited to documentation or static inspection.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | Module organization and file layout | Filled |
| [Database Guidelines](./database-guidelines.md) | Persistence, migrations, query patterns | Filled |
| [Error Handling](./error-handling.md) | Error types, propagation, API responses | Filled |
| [Logging Guidelines](./logging-guidelines.md) | Structured logging and log levels | Filled |
| [Quality Guidelines](./quality-guidelines.md) | Code standards, tests, review rules | Filled |

---

## Current Scope

- Backend language: TypeScript.
- Runtime target: Node.js.
- Package manager: `pnpm`.
- API style: JSON HTTP API under `/api/*`.
- Database: SQLite for the learning demo unless the task explicitly chooses a different local store.
- Documentation language: English.

Update these guidelines when the demo app introduces real code that changes any convention above.
