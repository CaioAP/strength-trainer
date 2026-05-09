# Strength Trainer Project Instructions

Comprehensive guide for AI agents working on the Strength Trainer project.

## Project Overview
Strength Trainer is a Next.js (App Router) application designed for trainers and students. It features offline-first capabilities using Dexie.js for local storage and Supabase for cloud synchronization.

- **Frontend**: Next.js 16+ (React 19), Tailwind CSS 4.
- **Backend/Auth**: Supabase (@supabase/ssr).
- **Local DB**: Dexie.js (for offline workout execution).
- **Internationalization**: next-intl (mandatory i18n keys).
- **Architecture**: RSC-first, functional components, separated logic (hooks/actions) from views.

## Core Development Mandates
*Strictly follow these rules for every task:*

### Component Standards
- **RSC First**: Use Server Components by default. Use `'use client'` ONLY for interactivity or browser APIs.
- **Functional Only**: Use functional components with hooks.
- **Separation of Concerns**: Logic (hooks/actions) and rendering (view) MUST be in separate files.
- **Atomic Design**: Break complex components into smaller, composable units.
- **Typography**: ALWAYS use the `<Text />` component (`src/components/ui/Text.tsx`) for all UI labels and text. Use standard Tailwind classes for any specific overrides. Strictly avoid arbitrary values (e.g., `text-[10px]`) unless absolutely necessary.
- **i18n Mandatory**: NEVER use static strings in components. Use translation keys (`t('key')`) from `locales/`.

### TypeScript & Error Handling
- **Strict Mode**: No `any`, no `@ts-ignore`. Explicit typing for all variables, params, and returns.
- **Result Pattern**: Prefer return errors over try/catch for predictable error handling.
  ```typescript
  type Result<T, E = Error> = { data: T; error: null } | { data: null; error: E };
  ```
- **Shared Types**: Put interfaces/types in `*.types.ts` files.

### Styling
- **Tailwind CSS**: Use Tailwind CSS (v4) for all styling.
- **Design Consistency**: Follow established theme and spacing.

## Building and Running
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Typecheck**: `npm run typecheck`
- **Lint**: `npm run lint`
- **Migrations**: `npm run migrate` (uses `scripts/migrate.ts` and `tsx`)

## Technical Context
- **Supabase**: Client files in `src/lib/supabase/`. Use `admin.ts` for service role operations (server-side only), `server.ts` for RSC/Actions, and `client.ts` for Client Components.
- **Offline Sync**: Dexie schema in `src/lib/db/dexie.ts`. Sync logic in `src/lib/sync/engine.ts`.
- **i18n**: Config in `src/i18n/request.ts`. Locales in `locales/en.json` and `locales/pt.json`.
- **Database**: Migrations are stored in `supabase/migrations/`.

## Quality Workflow
1. **Research**: Map components and types.
2. **Implement**: Separate hooks/actions from UI.
3. **Verify**: Run `npm run typecheck` and `npm run lint` before completion.
4. **Test**: Add unit tests for new logic/components.
