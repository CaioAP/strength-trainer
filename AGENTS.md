# Project Agents & Skills

This document serves as the primary source of truth for all AI agents working on the Strength Trainer project. Follow these mandates strictly.

## Core Development Mandates
- **RSC First**: Always use Server Components. Use Client Components (`'use client'`) ONLY for interactivity or browser APIs.
- **Functional Only**: Always use functional components with hooks.
- **Single Responsibility**: Break complex components into smaller, composable units.
- **Logic Separation**: Always separate the component logic (hooks/actions) and the rendering (view) into different files.
- **DRY & SOLID**: Never write the same code twice. Apply SOLID principles and design patterns (Factory, Strategy, Observer) to solve coding construction.
- **Airbnb Style**: Follow Airbnb linting styles strictly.
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
- **Unit Testing**: Always unit test files. Iterate until 100% correct.
- **Typechecking**: Always run `tsc` after finishing a feature and iterate until zero errors.
- **Composition**: Prefer composition over inheritance. If a component is complex, break it down.

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
