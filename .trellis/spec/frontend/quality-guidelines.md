# Quality Guidelines

> Frontend quality standards for the Trellis practice demo app.

---

## Overview

Frontend code should be readable, accessible, and easy to verify. Keep behavior close to the feature that owns it and test user-visible flows rather than implementation details.

---

## Required Patterns

- Use named exports for components, hooks, and API functions.
- Keep API calls in `apps/web/src/api/`.
- Keep data-fetching state in hooks.
- Validate API responses with schemas from `@trellis-practice/shared` before data reaches components.
- Render explicit loading, empty, error, and success states for async UI.
- Use semantic HTML and accessible labels.
- Keep component props typed and narrow.

Example async state rendering:

```typescript
if (todos.status === 'loading') return <p>Loading...</p>;
if (todos.status === 'error') return <p role="alert">{todos.message}</p>;
if (todos.items.length === 0) return <p>No todos yet.</p>;
```

---

## Forbidden Patterns

- No `any` in frontend source or tests.
- No clickable `div` or `span` elements for actions.
- No raw `fetch` calls inside multiple components.
- No duplicated API DTOs or error codes in `apps/web` when they belong in `packages/shared`.
- No large component files that combine route shell, API calls, form state, and list rendering when those can be split by responsibility.
- No new UI library, styling framework, or global state library without updating the relevant spec first.

---

## Testing Requirements

- Component tests should assert user-visible text, roles, labels, and interactions.
- Hook tests are appropriate for complex loading, retry, or mutation behavior.
- API client tests should cover response parsing and error mapping.
- Contract-sensitive UI code should have a test proving shared schemas are used at the API boundary.
- Accessibility-sensitive components must test labels, roles, disabled states, and keyboard-reachable controls.
- For bug fixes, add a regression test that fails without the fix.

Minimum cases for an async feature page:

| State | Assertion |
|-------|-----------|
| Loading | Loading state is visible |
| Success | Loaded records render with accessible controls |
| Empty | Empty state renders without broken controls |
| Error | Error message uses `role="alert"` when blocking |
| Mutation | Disabled or pending state prevents duplicate submit |

---

## Code Review Checklist

- Does the file live in the correct feature/shared/API location?
- Are component props narrow and named by intent?
- Are async states complete: loading, empty, error, success?
- Are inputs labeled and actions implemented with buttons or links?
- Is server data parsed or mapped before being used as UI state?
- Are API DTOs and error codes imported from `@trellis-practice/shared`?
- Were affected tests, lint, or build checks run, or is the lack of scripts documented?

---

## Common Mistakes

- Testing implementation state instead of user-visible behavior.
- Hiding errors in the console instead of rendering a recoverable message.
- Creating shared components that preserve every variant from the first caller, making the API harder than local duplication.
