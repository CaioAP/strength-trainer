# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint (src/ only)
npm run typecheck    # tsc --noEmit
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
npm run migrate      # Run DB migrations via scripts/migrate.ts
```

Validation before finishing any task: `npm run lint && npm run typecheck && npm run test`.

---

## Architecture

### Role-Based Routing

`src/app/[locale]/page.tsx` is a Server Component that fetches the session, reads `profiles.role` from Supabase, and renders one of three dashboards: **admin**, **trainer**, or **student**. Unauthenticated users are redirected to `/login`.

### File Layout Pattern

Ports & Adapters / DDD layer structure — see AGENTS.md for full details.

```
src/
  domain/          # Entities, value objects, repository interfaces (no framework deps)
  application/     # Use cases — depend only on domain interfaces
  infrastructure/  # Supabase/Dexie adapters implementing domain interfaces
  ui/              # Reusable UI primitives (Input, Card, Dialog, Panel, Toggle, Loading…)
  app/             # Next.js routes + server actions (composition root, wires DI)
  lib/             # Shared utils, types, Supabase clients, sync engine
```

Every feature component follows this three-file pattern:

```
ComponentName.tsx          # RSC or client view, imports hook
useComponentName.ts        # Client hook — all business logic
ComponentName.types.ts     # Shared interfaces for the above
```

All reusable primitives (buttons, inputs, cards, dialogs, etc.) live in `src/ui/` — never duplicate them in feature folders.

Server actions live in `src/app/actions/`. Each action uses the Result pattern (from `src/lib/types/common.types.ts`), verifies role via `assertRole()`, and calls `revalidatePath()` after mutation.

### Supabase Clients

Three clients — use the right one:

| File | Use when |
|------|----------|
| `src/lib/supabase/server.ts` | RSC, server actions, middleware |
| `src/lib/supabase/client.ts` | Client components |
| `src/lib/supabase/admin.ts` | Service-role ops (server-only, bypasses RLS) |

### Offline-First

Dexie (IndexedDB) mirrors the Supabase schema for offline workout execution. `src/lib/sync/engine.ts` pushes pending `workout_executions` and `session_param_modifications` to Supabase when online. Don't bypass Dexie for student-facing workout writes.

### i18n

Locales: `pt` (default), `en`. All routes are under `[locale]`. Translation files: `locales/pt.json`, `locales/en.json`. Server setup: `src/i18n/request.ts`. Middleware: `src/proxy.ts`. Use `useTranslations()` in client components; pass `messages` prop from RSC parents.

### Database Migrations

SQL files in `supabase/migrations/` named `YYYYMMDDNNNNNN_description.sql`. Run with `npm run migrate`. Use `scripts/migrate.ts` as reference for the runner pattern. Do not modify existing migration files — add new ones.

### Path Alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).
