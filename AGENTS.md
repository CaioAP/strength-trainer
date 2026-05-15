# Project Agents & Skills

This document serves as the primary source of truth for all AI agents working on the Strength Trainer project. Follow these mandates strictly.

## Core Development Mandates
- **RSC First**: Always use Server Components. Use Client Components (`'use client'`) ONLY for interactivity or browser APIs. SSR/SSG is the default — CSR only when absolutely necessary.
- **Functional Only**: Always use functional components with hooks.
- **Single Responsibility**: Break complex components into smaller, composable units.
- **Logic Separation**: Always separate the component logic (hooks/actions) and the rendering (view) into different files.
- **DRY & SOLID**: Never write the same code twice. Apply SOLID principles and design patterns (Factory, Strategy, Observer) to solve coding construction.
- **Airbnb Style**: Follow Airbnb linting styles strictly.
- **Validation**: Always run `npm run lint`, `npm run typecheck`, and `npm run test` before finishing a task.
- **i18n Mandatory**: Always use i18n code for user-facing text. Never use static strings in components. Use translation keys and appropriate hooks/functions (e.g., `t('key')`).

## TypeScript Standards
- **Strict Mode**: Apply strict TypeScript rules.
- **No `any`**: Never use `any`. No `@ts-ignore`.
- **Explicit Typing**: Always type variables, params, functions (including return types), and objects.
- **Shared Types**: Separate interfaces and types into their own `*.types.ts` files for reuse via imports.
- **Error Handling**: Use return errors (Result pattern) instead of try/catch. Create explicit error typing.
  ```typescript
  type Result<T, E = Error> = { data: T; error: null } | { data: null; error: E };
  ```

## Styling & Design
- **Tailwind Preferred**: Always prefer styling with Tailwind CSS. Custom CSS only if Tailwind is insufficient.
- **Theme Consistency**: Always follow the theme design. Apply new styling only if asked or approved.

## Quality & Workflow
- **Unit Testing**: Always write unit tests for business logic (domain + application layers) and all shared UI components. Run `npm run test` before finishing any task. Iterate until all tests pass.
- **Typechecking**: Always run `tsc` after finishing a feature and iterate until zero errors.
- **Composition**: Prefer composition over inheritance. If a component is complex, break it down.

---

## Architecture — Ports & Adapters / Domain-Driven Design

### Layer Structure

```
src/
  domain/          # Pure business logic — no framework deps
  application/     # Use cases, orchestrate domain via interfaces
  infrastructure/  # Adapters: Supabase, Dexie, HTTP (implements domain interfaces)
  ui/              # Reusable UI primitives (see Shared UI Components below)
  app/             # Next.js routes, server actions (composition root)
  lib/             # Shared utilities, types, DI wiring
```

### Domain Layer (`src/domain/`)
- Entities, value objects, domain events, repository **interfaces** (ports).
- Zero framework or infrastructure imports.
- Fully unit-testable in isolation.

### Application Layer (`src/application/`)
- Use cases / interactors — depend only on domain interfaces.
- Receive dependencies via constructor injection or factory params — never `new ConcreteAdapter()` inside a use case.
- Return the `Result<T>` type; never throw.

### Infrastructure Layer (`src/infrastructure/` or `src/lib/`)
- Adapters that implement domain repository interfaces: Supabase repos, Dexie repos, external APIs.
- Mocked at this boundary in tests — never mock domain or application logic.

### Dependency Injection
- Composition root: server actions and RSC pages wire concrete adapters to use cases.
- Prefer factory functions over classes for lightweight DI.
- Never instantiate infrastructure adapters inside domain or application code.

---

## Shared UI Components

- **All reusable primitives live in `src/ui/`** — Input, Button, Card, Dialog, Panel, Toggle, Loading, Badge, Avatar, etc.
- Never duplicate a primitive. Always import from `src/ui/` before creating a new one.
- Each primitive follows the three-file pattern (`Component.tsx`, `useComponent.ts` if needed, `Component.types.ts`).
- Feature-specific components stay in their feature folder and may import from `src/ui/`.

---

## Semantic HTML & Accessibility

- **Semantic elements always**: `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<ul>`/`<li>`, `<button>`, `<a>`, `<form>`, `<label>`, etc.
- Never use `<div>` or `<span>` for interactive or landmark roles.
- ARIA attributes (`aria-label`, `aria-describedby`, `role`, etc.) required when semantic HTML alone is insufficient.
- Focus management: dialogs and modals trap focus; restore focus to trigger on close.
- Color contrast: WCAG AA minimum (4.5:1 for body text, 3:1 for large text/UI).
- All images need `alt`; decorative images use `alt=""`.
- Keyboard navigability: every interactive element reachable and operable via keyboard.

---

## Navigation & Routing

- **Every distinct view gets its own URL route.** No in-memory state replacing routes.
- Use Next.js `<Link>` for navigable links — never `onClick` + `router.push` when a real URL is appropriate.
- Drill-down views (e.g. workout template detail) use nested routes under their parent (e.g. `/templates/[id]`).
- Browser back button must always return to the previous route — never break history.
- Breadcrumb or back-nav UI must use `<Link href={parentRoute}>` not `router.back()` unless back == parent is guaranteed.

---

## Testing

- **Stack**: Vitest + React Testing Library + `@testing-library/user-event` + `jsdom`.
- **Scope**: Unit-test all domain entities, use cases, and shared `src/ui/` components. Integration-test server actions against mock adapters.
- **Test file location**: co-located with source as `*.test.ts` / `*.test.tsx`.
- **Mocking boundary**: mock infrastructure adapters (Supabase, Dexie) — never mock domain or application code.
- **Commands**: `npm run test` (single run), `npm run test:watch` (watch mode).

---

## Custom Skills & Tools

### [next-supabase-dev](./.gemini/skills/next-supabase-dev/SKILL.md)
Expert guidance for Next.js, React, and Supabase development.
- Trigger: Active for Supabase or Next.js App Router tasks.
- Resource: `generate_migration.cjs` for database changes.

### Caveman Suite
- `caveman`: Terser communication mode.
- `caveman-commit`: Optimized commit message generation.
- `caveman-review`: Compressed code review feedback.

---

## Next.js Special Instructions
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
