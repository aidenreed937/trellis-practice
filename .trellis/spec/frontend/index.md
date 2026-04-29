# Frontend Development Guidelines

> Project-specific frontend conventions for the Trellis practice demo app.

---

## Overview

This repository is a Trellis learning workspace. It does not contain frontend application code yet. These frontend guidelines define the conventions for the small demo app that will be built next so future AI sessions can generate and review code against concrete rules.

The planned frontend is a React + TypeScript app managed with `pnpm`. Keep UI code feature-oriented, accessible, and direct. Do not introduce a design system, global state library, or component abstraction before the demo needs it.

---

## Pre-Development Checklist

Before changing frontend code, read the files that match the task:

- `directory-structure.md` for new pages, components, hooks, utilities, or assets.
- `component-guidelines.md` for component boundaries, props, composition, styling, and accessibility.
- `hook-guidelines.md` for custom hooks and data fetching behavior.
- `state-management.md` for local, URL, server, and shared state decisions.
- `type-safety.md` for TypeScript DTOs, validation, and forbidden type shortcuts.
- `quality-guidelines.md` for testing, linting, review criteria, and accessibility checks.
- `../guides/index.md` for shared thinking triggers.

---

## Quality Check

Before considering frontend work complete:

- Read `quality-guidelines.md` and check changed files against the review checklist.
- Read any topic-specific guideline touched by the change.
- Run the affected test file first if tests exist.
- Run `pnpm lint`, `pnpm test`, or `pnpm build` when those scripts exist.
- If the repository still has no frontend package or scripts, state that verification is limited to documentation or static inspection.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | Component, route, hook, and utility layout | Filled |
| [Component Guidelines](./component-guidelines.md) | Component patterns, props, composition, accessibility | Filled |
| [Hook Guidelines](./hook-guidelines.md) | Custom hooks and data fetching patterns | Filled |
| [State Management](./state-management.md) | Local, URL, server, and shared state | Filled |
| [Type Safety](./type-safety.md) | TypeScript and runtime validation conventions | Filled |
| [Quality Guidelines](./quality-guidelines.md) | Linting, tests, accessibility, review rules | Filled |

---

## Current Scope

- Frontend framework: React.
- Language: TypeScript.
- Package manager: `pnpm`.
- Styling: plain CSS modules or colocated CSS files for the first demo; avoid adding a styling framework unless a task requires it.
- API format: JSON requests to backend `/api/*` endpoints.
- Documentation language: English.

Update these guidelines when real frontend code introduces a different framework, routing system, styling approach, or state management library.
