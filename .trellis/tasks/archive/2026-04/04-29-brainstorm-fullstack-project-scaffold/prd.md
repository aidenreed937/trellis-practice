# brainstorm: fullstack project scaffold

## Goal

Plan a fullstack project scaffold for this Trellis practice repository so future implementation can create a small demo app that exercises backend, frontend, specs, task context, and daily AI-assisted workflow.

## What I already know

* The user wants to complete a fullstack project scaffold setup.
* The repository is a Trellis learning workspace under `/Users/mac/workspace/personal/learning/trellis-practice`.
* Current app code does not exist yet; the repo contains Trellis/Codex scaffolding, AGENTS.md, README.md, and project specs.
* Spec layers are `backend` and `frontend` in single-repo mode.
* Existing conventions prefer TypeScript, Node.js, React, JSON HTTP API under `/api/*`, SQLite for the learning demo, and `pnpm` for Node.js package management.
* Git has no commits yet and all initialized files are still uncommitted.
* The user prefers avoiding platform lock-in while keeping strong engineering constraints.

## Assumptions (temporary)

* The scaffold should be small enough for learning Trellis rather than a production-grade platform.
* The first app should be a simple CRUD-style demo, likely todos, because existing specs use todo examples.
* The scaffold should include scripts for lint, typecheck, test, build, and dev if feasible.
* The scaffold should avoid heavy infrastructure, CI, auth, deployment, and complex database setups unless explicitly included.

## Open Questions

* Confirm final requirements before moving from brainstorm to implementation.

## Requirements (evolving)

* Create a fullstack scaffold that matches existing `.trellis/spec/backend/` and `.trellis/spec/frontend/` conventions.
* Use `pnpm` rather than npm or yarn.
* Keep the app suitable for Trellis workflow practice.
* Preserve current Trellis and Codex configuration.
* Prefer portable, platform-neutral technologies over vendor-hosted or framework-coupled runtime assumptions.
* Enforce engineering quality through workspace boundaries, typed contracts, lint/typecheck/test scripts, and documented conventions.
* Use a `pnpm workspace` monorepo with `apps/web`, `apps/api`, and `packages/shared`.
* Use `packages/shared` for API DTOs, shared validation schemas, and error code contracts.
* Add explicit API environment handling and a root `.env.example`.
* Add local SQLite database lifecycle scripts for migrate, seed, and reset.
* Add root dev orchestration scripts for running web and API together or separately.
* Configure a stable local API boundary using Vite proxy or documented CORS behavior.
* Define one JSON API error response contract and consume it consistently in web code.
* Add representative tests for backend service/repository logic, API routes, frontend UI/hook behavior, and shared contracts if schemas exist.
* Add GitHub Actions CI for lint, typecheck, test, and build.

## Acceptance Criteria (evolving)

* [ ] A clear scaffold architecture is selected.
* [ ] MVP scope is explicit.
* [ ] Out-of-scope items are explicit.
* [ ] Implementation can proceed through Trellis task workflow after brainstorm approval.
* [ ] Root workspace contains `package.json` and `pnpm-workspace.yaml`.
* [ ] `apps/web` contains a React + Vite + TypeScript app scaffold.
* [ ] `apps/api` contains a Fastify + TypeScript API scaffold.
* [ ] `packages/shared` contains shared API contract types or schemas used by both apps.
* [ ] Local scripts exist for `pnpm dev`, `pnpm dev:web`, `pnpm dev:api`, `pnpm lint`, `pnpm type-check`, `pnpm test`, and `pnpm build`.
* [ ] Database scripts exist for migrate, seed, and reset.
* [ ] GitHub Actions CI runs install, lint, typecheck, test, and build.
* [ ] README documents install, dev, test, build, and database reset commands.

## Definition of Done (team quality bar)

* Tests added or configured where appropriate for scaffolded code.
* Lint, typecheck, test, and build commands are available or documented as intentionally absent.
* Docs and `.trellis/spec/` are updated if the scaffold changes conventions.
* No automatic commit or push.

## Out of Scope (explicit)

* Production deployment.
* Authentication and authorization.
* Continuous deployment unless the user explicitly requests it.
* Database hosting or cloud infrastructure.
* A large design system or component library.
* Platform-specific adapters as a required runtime dependency.
* Docker or docker-compose.
* Postgres support.
* OpenAPI client generation or typed RPC.
* Authentication and authorization.
* Preview deployments.
* Global frontend state libraries.
* Production observability stack.

## Technical Notes

* Files inspected: `AGENTS.md`, `README.md`, `.trellis/spec/backend/index.md`, `.trellis/spec/frontend/index.md`, `.trellis/spec/guides/index.md`, current file tree, and git status.
* Current package state: no `package.json` exists yet.
* Current Trellis state: no active task before this brainstorm task was created.

## Research Notes

### What similar scaffolds usually do

* Vite + React is a common lightweight frontend scaffold for TypeScript demos because it has fast dev startup, simple build output, and minimal framework opinions.
* Express/Fastify/Hono-style Node APIs are common for small JSON HTTP backends. They keep route handlers explicit and work well with service/repository layering.
* Fullstack meta-frameworks such as Next.js or Remix reduce project count but introduce framework-specific routing, data loading, and deployment assumptions.
* Monorepos often split apps into `apps/web` and `apps/api`, but a small learning repository can keep `src/frontend` and `src/backend` in one package to reduce setup overhead.

### Constraints from this repository

* Existing specs already define `src/backend/` and `src/frontend/` target layouts.
* Backend conventions expect JSON API routes, service modules, repository modules, SQLite, migrations under `src/backend/db/migrations/`, and shared error/logging helpers.
* Frontend conventions expect React + TypeScript, feature folders, API functions under `src/frontend/api/`, local state plus feature hooks, and no global state library for the initial demo.
* User/global rules require `pnpm`, no npm/yarn dependency installation, small reviewable changes, and no automatic commit/push.

### Feasible approaches here

**Approach A: Single-package Vite + Node API scaffold** (Recommended)

* How it works: one `package.json`; Vite serves React frontend; a small Node API server lives under `src/backend`; dev script runs frontend and backend together or via two scripts; SQLite file stays local.
* Pros: matches current `src/frontend` and `src/backend` specs directly; simplest for learning Trellis; fewer workspace/package decisions; easy to inspect in one repo.
* Cons: less representative of a larger production monorepo; frontend/backend dependency boundaries need discipline.

**Approach B: pnpm workspace with `apps/web` and `apps/api`**

* How it works: create a pnpm workspace, separate frontend and backend packages, optional shared package later.
* Pros: stronger package boundaries; closer to real multi-app projects; clearer independent scripts.
* Cons: conflicts with current spec examples unless specs are updated first; more setup overhead for a learning scaffold.

**Approach C: Next.js fullstack scaffold**

* How it works: use Next.js app router for React UI and API routes in one framework.
* Pros: fastest single-framework fullstack experience; fewer moving pieces; common in production.
* Cons: diverges from existing backend `src/backend` service/repository/API server conventions; Next.js route conventions would require rewriting specs before implementation.

### Recommendation

Use Approach A for the MVP: a single-package Vite + React frontend plus small Node JSON API backend. It aligns with the guidelines already written and keeps the exercise focused on Trellis workflow rather than framework migration.

### Updated platform-neutral direction

Given the user's preference for high freedom and low platform lock-in, avoid fullstack meta-frameworks whose routing, server runtime, deployment, or data loading model is tightly coupled to a specific ecosystem. Prefer a portable web app plus standalone API:

* Frontend: React + TypeScript + Vite. Builds static assets that can be hosted anywhere.
* Backend: Node.js + TypeScript with Fastify or Hono. Runs as a normal HTTP server and can later move to containers, VMs, PaaS, or serverless adapters if needed.
* Database: start with SQLite for local learning, but keep repositories behind interfaces so moving to Postgres later is straightforward.
* Monorepo: `pnpm workspace` with `apps/web`, `apps/api`, and optional `packages/shared` gives strong boundaries without tying the project to a deployment vendor.
* Constraints: use TypeScript project references or package-level typecheck, ESLint, Vitest, explicit API DTOs, and Trellis specs to keep engineering discipline.

Revised recommendation: choose Approach B, but keep it lightweight and platform-neutral: `pnpm workspace` + Vite React web + standalone Node API + SQLite/Kysely.

### Community and developer-sentiment signals

Public package/repo signals checked on 2026-04-29:

| Tool | npm downloads last month | GitHub stars | Notes |
|------|--------------------------|--------------|-------|
| React | ~517M | ~245k | Default mainstream UI library; huge hiring/docs/forum base. |
| Vite | ~431M | ~80k | Very strong frontend tooling adoption; active repo and discussions. |
| Express | ~386M | ~69k | Largest Node HTTP ecosystem; minimal and familiar, but weak built-in engineering constraints. |
| NestJS | ~37M (`@nestjs/core`) | ~75k | Strong enterprise structure and community; heavier framework model and stronger architectural lock-in. |
| Fastify | ~27M | ~36k | Mature Node HTTP framework; good balance of performance, plugins, TypeScript support, and portability. |
| Hono | ~143M | ~30k | Very active and fast-growing; Web Standards style and edge/serverless friendliness; lighter Node-specific ecosystem. |
| Kysely | ~17M | ~14k | Type-safe SQL builder; clean SQL mental model and low ORM lock-in. |
| Drizzle ORM | ~31M | ~34k | Larger/more visible ORM ecosystem; stronger schema/migration conventions, but more ORM-specific coupling. |

Interpretation:

* Frontend choice is low-risk: React + Vite has excellent developer mindshare, docs, forum activity, and long-term portability.
* For backend, Express wins raw adoption but does not provide enough structure by itself for the desired engineering constraints.
* NestJS wins framework structure but conflicts with the goal of staying flexible and avoiding framework lock-in.
* Fastify is the best middle ground for a portable Node API with real engineering discipline.
* Hono is attractive if Web Standards and future edge/runtime portability matter more than Node ecosystem depth.
* Kysely aligns better with low lock-in because it keeps SQL visible; Drizzle has more product/community momentum but introduces more ORM-specific conventions.

Community-informed recommendation: `React + Vite` for web, `Fastify` for API, `Kysely + SQLite` for persistence. Keep `Hono` as the alternate if the user prioritizes Web Standards style over Fastify's Node ecosystem maturity.

### Quality gate and GitHub CI

The local quality setup should include scripts for:

* `pnpm lint`
* `pnpm type-check`
* `pnpm test`
* `pnpm build`

For a scaffold intended to practice real development workflow, local scripts alone are useful but not enough. Add GitHub Actions CI in the MVP as a quality gate, but avoid deployment/CD for now to preserve platform neutrality.

Recommended GitHub Actions scope:

* Trigger on `pull_request` and `push` to `main`.
* Use one current Node.js LTS version.
* Enable Corepack and pnpm.
* Run `pnpm install --frozen-lockfile`.
* Run `pnpm lint`, `pnpm type-check`, `pnpm test`, and `pnpm build`.
* Keep workflow names generic, such as `.github/workflows/ci.yml`.

Out of scope for MVP:

* Auto deploy.
* Release publishing.
* Preview environments.
* Secrets and cloud provider integration.

Decision candidate: include CI, exclude CD.

### Additional scope considerations

Accepted additions for MVP:

* Shared contracts: create `packages/shared` for API DTOs and shared validation schemas once frontend/backend need the same payload types.
* Environment handling: add explicit env parsing for `apps/api` and document required keys in `.env.example`.
* Database lifecycle: include migration, seed, and reset scripts for local SQLite so the demo can be reproduced easily.
* Dev orchestration: root `pnpm dev` should run web and api together; also provide `dev:web` and `dev:api` for focused work.
* API boundary: configure Vite dev proxy or explicit CORS rules so web talks to api consistently in local dev.
* Error contract: keep one documented JSON error shape between API and web.
* Test layers: include at least one backend service/repository test, one API route test, and one frontend component/hook test.
* Documentation: update `README.md` with workspace commands after scaffold implementation.

Worth reserving but not implementing in MVP:

* Dockerfile or docker-compose for local parity.
* Generated OpenAPI client or typed RPC.
* Postgres support.
* Authentication.
* Preview deployments.

Avoid in MVP:

* Global state libraries.
* UI component frameworks.
* Framework-specific deployment adapters.
* Production observability stack.

Decision candidate: keep MVP focused on a reproducible local fullstack scaffold with CI, not production deployment.

Decision: accepted. Keep MVP focused on a reproducible local fullstack scaffold with CI, not production deployment.

## Technical Approach

Use a platform-neutral `pnpm workspace` monorepo:

```text
apps/web          React + TypeScript + Vite
apps/api          Node.js + TypeScript + Fastify + Kysely + SQLite
packages/shared   Shared DTOs, validation schemas, and error code contracts
```

Build and quality tooling:

* Vite for web development and build.
* `tsx` for API development runtime.
* `tsup` for API build output.
* Vitest for tests across packages.
* ESLint and TypeScript checks at package and root level.
* GitHub Actions CI for install, lint, typecheck, test, and build.

## Decision (ADR-lite)

**Context**: The scaffold should be realistic enough to practice fullstack engineering and Trellis workflows, while avoiding platform lock-in and over-heavy framework conventions.

**Decision**: Use `pnpm workspace` with Vite React web, standalone Fastify API, SQLite/Kysely persistence, and shared contract package. Include local quality scripts and GitHub Actions CI. Exclude deployment/CD and production infrastructure.

**Consequences**: The project has stronger package boundaries than a single-package scaffold and remains portable across hosting options. The existing `.trellis/spec/` examples currently mention `src/frontend` and `src/backend`, so implementation should update specs to the new `apps/web`, `apps/api`, and `packages/shared` conventions before or during scaffolding.
