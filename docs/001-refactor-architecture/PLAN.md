# Architecture Compliance Plan

## Context

Audit of the strength-trainer codebase against AGENTS.md/CLAUDE.md mandates revealed 71+ violations across 6 categories. This plan fixes them in priority order. DDD migration is incremental: scaffold layers + migrate one feature as a reference pattern. UI primitives stay at `src/components/ui/` (AGENTS.md updated to match).

Related: [TASKS.md](./TASKS.md) | [CHANGELOG.md](./CHANGELOG.md) | [docs/](../)

---

## Phase 1 — DDD Scaffolding + Reference Migration

### 1a. Update AGENTS.md
- Change `src/ui/` references to `src/components/ui/` throughout.

### 1b. Create layer scaffolding

```
src/
  domain/
    repositories/       # Repository interfaces (ports)
    entities/           # Entity types / value objects
  application/
    useCases/           # Use cases (interactors)
  infrastructure/
    supabase/           # Supabase repo implementations
```

### 1c. Reference migration — Exercises feature

Migrate the exercises CRUD end-to-end as the reference pattern. All other features follow this pattern when touched in future.

**Domain interface** → `src/domain/repositories/IExerciseRepository.ts`
```ts
interface IExerciseRepository {
  findAll(): Promise<Result<Exercise[]>>;
  findById(id: string): Promise<Result<Exercise>>;
  create(data: CreateExerciseInput): Promise<Result<Exercise>>;
  update(id: string, data: UpdateExerciseInput): Promise<Result<Exercise>>;
  delete(id: string): Promise<Result<void>>;
}
```

**Entity types** → `src/domain/entities/Exercise.ts`
Pure types, no framework imports.

**Use cases** → `src/application/useCases/exercises/`
- `GetExercises.ts` — list
- `GetExercise.ts` — single
- `SaveExercise.ts` — create/update
- `DeleteExercise.ts`

Each accepts `IExerciseRepository` as constructor param, returns `Result<T>`.

**Infrastructure adapter** → `src/infrastructure/supabase/SupabaseExerciseRepository.ts`
Implements `IExerciseRepository` using `createClient()` / `createAdminClient()`.

**Composition root** — server actions wire the adapter into use cases:
```ts
// src/app/actions/exercises.ts
const repo = new SupabaseExerciseRepository(await createClient());
const result = await new GetExercises(repo).execute();
```

**Existing hook** `src/components/admin/ExerciseEditor/useExerciseEditor.ts` — slim down to call server actions only; remove direct Supabase calls.

**Unit tests** → `src/application/useCases/exercises/*.test.ts`
Mock `IExerciseRepository` with a simple in-memory stub.

---

## Phase 2 — Navigation & Routing

### 2a. SubPageHeader — add `href` prop for deterministic back link

`src/components/ui/SubPageHeader.tsx`
- Add `backHref?: string` prop.
- If provided, render `<Link href={backHref}>` instead of `router.back()`.
- Callers pass their parent route (e.g. `backHref="/"` or `backHref="/trainer/student/{id}"`).
- Keep `router.back()` as fallback only when `backHref` is not provided.

All settings sub-pages (`/settings/email`, `/settings/security`, `/settings/help`, `/settings/bug`, `/settings/privacy`) call `SubPageHeader` with `backHref="/"`.

### 2b. SettingsModal — replace router.push with Link

`src/components/ui/SettingsModal.tsx`
- Convert `SettingsItem` from `<div onClick={router.push(...)}>` to accept `href?: string`.
- When `href` set, render as `<Link>` wrapping the item (or `<a>` tag).
- Remove `navigating` state + loading overlay (unnecessary with Link navigation).
- Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (links to heading id).
- Add focus trap (focus first focusable on open; restore to trigger on close).

### 2c. WorkoutRunner — fix unsafe router.back()

`src/components/student/WorkoutRunner/useWorkoutRunner.ts`
- `handleSafeBack`: instead of `router.back()`, navigate to the student home via `router.push('/')`.
- Delete `navigateBackAndRefresh` calls; import is dead after this.

`src/components/student/WorkoutRunner/WorkoutRunner.tsx`
- Error fallback: replace `router.back()` with `<Link href="/">`.

`src/lib/utils/navigation.ts` — delete file (only consumer was WorkoutRunner).

### 2d. Auth redirects — acceptable router.push usage

`useLoginForm.ts` and `useSetPasswordForm.ts` use `router.push("/")` post-auth. Programmatic redirect after async action — keep as-is, no violation.

---

## Phase 3 — Accessibility

### 3a. ConfirmationModal

`src/components/ui/ConfirmationModal.tsx`
- Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`.
- Add `id="modal-title"` to the `<h3>`.
- Focus trap: on mount focus first button; restore focus to trigger element on close.
- Close on `Escape` key.

### 3b. SettingsModal (continued from 2b)

Already covered above. Additional:
- Close button: add `aria-label={t("close")}`.

### 3c. BottomNav

`src/components/ui/BottomNav.tsx`
- Add `role="tablist"` to `<nav>`.
- Each button: add `role="tab"`, `aria-selected={activeTab === tab.id}`, `aria-label={tab.label}`.

### 3d. DashboardHeader

`src/components/ui/DashboardHeader.tsx`
- Root `<header>` already correct — verify and add `aria-label` if needed.

---

## Phase 4 — Three-File Pattern & Types Files

Rule: `.types.ts` required when props/types are **imported by other files**. Inline types OK for self-contained components.

Feature components needing `.types.ts`:
- `src/components/auth/Auth.types.ts` — 4 auth hook return types
- `src/components/settings/Settings.types.ts`
- `src/components/student/HistoryView.types.ts`, `WorkoutView.types.ts`
- `src/components/trainer/StudentsTab.types.ts`, `TemplatesTab.types.ts`
- Add `ExerciseRowProps`, `WorkoutSectionProps` to `src/components/trainer/PlanEditor/PlanEditor.types.ts`

UI primitives:
- `src/components/ui/ConfirmationModal.types.ts`
- `src/components/ui/SettingsModal.types.ts`
- `src/components/ui/PlanAssignmentModal.types.ts`

Simple presentational components (EmptyState, StatCard, SuspenseLoader, Text, ToggleRow, SettingsSection, SubPageHeader, BottomNav, DashboardHeader) — no hook file needed, no business logic.

---

## Phase 5 — Unit Tests

1. **Domain use cases** (pure, no framework):
   - `src/application/useCases/exercises/GetExercises.test.ts`
   - `src/application/useCases/exercises/SaveExercise.test.ts`
   - `src/application/useCases/exercises/DeleteExercise.test.ts`
   - Mock `IExerciseRepository` inline (plain objects, no Vitest mock factories).

2. **UI primitives** (RTL):
   - `src/components/ui/Button.test.tsx` — renders, variant classes, loading state, disabled
   - `src/components/ui/ConfirmationModal.test.tsx` — renders when open, closes on Escape, focus trap, calls onConfirm

---

## Phase 6 — i18n Hardcoded Strings

| File | String | Fix |
|------|--------|-----|
| `WorkoutRunner.tsx:57` | `"Workout not found"` | Add `Student.WorkoutRunner.not_found` key |
| `SettingsModal.tsx:178` | `"Strength v1.0.0"` | Add `Settings.version` key |
| `VideoUpload.tsx:38,43,69` | validation messages | Add keys under `Common.VideoUpload` |

---

## Verification

```bash
npm run lint      # 0 errors, 0 warnings
npm run typecheck # 0 errors
npm run test      # all tests pass
npm run build     # all 29 pages build clean
```

Manual:
- Open `/settings/email` directly → back returns to `/`
- Open workout session → exit modal → back returns to home
- Open trainer student detail → back returns to trainer home
- Tab through `ConfirmationModal` → focus trapped inside
- Screen reader announces BottomNav tabs as `role="tab"` with `aria-selected`

---

## Files Modified

| File | Change |
|------|--------|
| `AGENTS.md` | `src/ui/` → `src/components/ui/` ✓ |
| `src/domain/repositories/IExerciseRepository.ts` | **NEW** |
| `src/domain/entities/Exercise.ts` | **NEW** |
| `src/application/useCases/exercises/*.ts` | **NEW** (4 files) |
| `src/infrastructure/supabase/SupabaseExerciseRepository.ts` | **NEW** |
| `src/app/actions/exercises.ts` | **NEW** |
| `src/components/admin/ExerciseEditor/useExerciseEditor.ts` | Strip Supabase, call actions |
| `src/components/ui/SubPageHeader.tsx` | Add `backHref` prop |
| `src/components/ui/SettingsModal.tsx` | Link nav, ARIA, focus trap |
| `src/components/ui/ConfirmationModal.tsx` | ARIA, focus trap, Escape |
| `src/components/ui/BottomNav.tsx` | ARIA tablist/tab roles |
| `src/components/ui/DashboardHeader.tsx` | Verify `<header>` semantic |
| `src/components/student/WorkoutRunner/useWorkoutRunner.ts` | Fix router.back |
| `src/components/student/WorkoutRunner/WorkoutRunner.tsx` | Fix router.back error fallback |
| `src/lib/utils/navigation.ts` | **DELETE** |
| `src/components/auth/Auth.types.ts` | **NEW** |
| `src/components/settings/Settings.types.ts` | **NEW** |
| Various `.types.ts` files | **NEW** (see Phase 4) |
| `src/application/useCases/exercises/*.test.ts` | **NEW** |
| `src/components/ui/Button.test.tsx` | **NEW** |
| `src/components/ui/ConfirmationModal.test.tsx` | **NEW** |
| `locales/pt.json`, `locales/en.json` | Add missing i18n keys |
