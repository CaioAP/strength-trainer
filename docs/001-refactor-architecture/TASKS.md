# Tasks — Architecture Compliance

> Mark each item `[x]` when done. One commit per phase minimum.
> Related: [PLAN.md](./PLAN.md) | [CHANGELOG.md](./CHANGELOG.md)

---

## Phase 1 — DDD Scaffolding + Reference Migration

- [x] 1.1 Update `AGENTS.md`: `src/ui/` → `src/components/ui/` (layer structure, shared UI, testing sections)
- [x] 1.2 Create directories: `src/domain/repositories/`, `src/domain/entities/`, `src/application/useCases/exercises/`, `src/infrastructure/supabase/`
- [x] 1.3 Create `src/domain/entities/Exercise.ts` — pure entity + input types, zero framework imports
- [x] 1.4 Create `src/domain/repositories/IExerciseRepository.ts` — repository interface (port)
- [x] 1.5 Create `src/application/useCases/exercises/GetExercises.ts`
- [x] 1.6 Create `src/application/useCases/exercises/GetExercise.ts`
- [x] 1.7 Create `src/application/useCases/exercises/SaveExercise.ts`
- [x] 1.8 Create `src/application/useCases/exercises/DeleteExercise.ts`
- [x] 1.9 Create `src/infrastructure/supabase/SupabaseExerciseRepository.ts` — implements `IExerciseRepository`
- [x] 1.10 Create `src/app/actions/exercises.ts` — composition root: wires adapter into use cases, exports server actions
- [x] 1.11 Refactor `src/components/admin/ExerciseEditor/useExerciseEditor.ts` — remove direct Supabase calls, call server actions
- [x] 1.12 Write `src/application/useCases/exercises/GetExercises.test.ts`
- [x] 1.13 Write `src/application/useCases/exercises/SaveExercise.test.ts`
- [x] 1.14 Write `src/application/useCases/exercises/DeleteExercise.test.ts`

---

## Phase 2 — Navigation & Routing

- [x] 2.1 Update `src/components/ui/SubPageHeader.tsx` — add `backHref?: string` prop; use `<Link>` when provided, keep `router.back()` as fallback
- [x] 2.2 Update all settings sub-pages to pass `backHref="/"` to `SubPageHeader` (`/settings/email`, `/settings/security`, `/settings/help`, `/settings/bug`, `/settings/privacy`)
- [x] 2.3 Refactor `src/components/ui/SettingsModal.tsx` — convert `SettingsItem` `<div onClick>` to `<Link>`
- [x] 2.4 Remove `navigating` state + loading overlay from `SettingsModal.tsx`
- [x] 2.5 Update `src/components/student/WorkoutRunner/useWorkoutRunner.ts` — replace `router.back()` in `handleSafeBack` with `router.push('/')`, remove `navigateBackAndRefresh`
- [x] 2.6 Update `src/components/student/WorkoutRunner/WorkoutRunner.tsx` — replace `router.back()` error fallback with `<Link href="/">`
- [x] 2.7 Remove `router` from `UseWorkoutRunnerReturn` in `WorkoutRunner.types.ts`
- [x] 2.8 Delete `src/lib/utils/navigation.ts`

---

## Phase 3 — Accessibility

- [x] 3.1 Update `src/components/ui/ConfirmationModal.tsx` — `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, id on `<h3>`, focus trap on mount, Escape closes, restore focus on close
- [x] 3.2 Update `src/components/ui/SettingsModal.tsx` — `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, `aria-label` on close button
- [x] 3.3 Update `src/components/ui/BottomNav.tsx` — `role="tablist"` on `<nav>`, `role="tab"` + `aria-selected` + `aria-label` on each button

---

## Phase 4 — Types Files

- [x] 4.1 Create `src/components/auth/Auth.types.ts` — extract `UseLoginFormReturn` and add return types for all 4 auth hooks
- [x] 4.2 Update `useLoginForm.ts`, `useForgotPasswordForm.ts`, `useResetPasswordForm.ts`, `useSetPasswordForm.ts` to import from `Auth.types.ts`
- [x] 4.3 Create `src/components/settings/Settings.types.ts` — shared types across settings hooks/forms
- [x] 4.4 Create `src/components/student/HistoryView.types.ts`
- [x] 4.5 Create `src/components/student/WorkoutView.types.ts`
- [x] 4.6 Create `src/components/trainer/StudentsTab.types.ts`
- [x] 4.7 Create `src/components/trainer/TemplatesTab.types.ts`
- [x] 4.8 Add `ExerciseRowProps` and `WorkoutSectionProps` to `src/components/trainer/PlanEditor/PlanEditor.types.ts`
- [x] 4.9 Create `src/components/ui/ConfirmationModal.types.ts`
- [x] 4.10 Create `src/components/ui/SettingsModal.types.ts`
- [x] 4.11 Create `src/components/ui/PlanAssignmentModal.types.ts`

---

## Phase 5 — Unit Tests

- [x] 5.1 Write `src/components/ui/Button.test.tsx` — renders, variant classes, loading state, disabled state
- [x] 5.2 Write `src/components/ui/ConfirmationModal.test.tsx` — open/close, Escape key, focus trap, onConfirm called

---

## Phase 6 — i18n

- [x] 6.1 Add `Student.WorkoutRunner.not_found` key to `locales/en.json` + `locales/pt.json`
- [x] 6.2 Add `Settings.version` key to both locale files
- [x] 6.3 Add `Common.VideoUpload.invalid_format`, `Common.VideoUpload.size_exceeded`, `Common.VideoUpload.upload_failed` to both locale files
- [x] 6.4 Update `src/components/ui/VideoUpload.tsx` — use `t()` for all 3 validation/error strings
- [x] 6.5 Update `src/components/student/WorkoutRunner/WorkoutRunner.tsx` — use `t('not_found')` for error fallback
- [x] 6.6 Update `src/components/ui/SettingsModal.tsx` — use `t('version')` for version string

---

## Verification

- [x] V.1 `npm run lint` — 0 errors, 0 warnings
- [x] V.2 `npm run typecheck` — 0 errors
- [x] V.3 `npm run test` — all tests pass (26/26)
- [x] V.4 `npm run build` — all 29 pages build clean
- [ ] V.5 Manual: open `/settings/email` directly → back returns to `/`
- [ ] V.6 Manual: open workout session → exit → back returns to home
- [ ] V.7 Manual: Tab through `ConfirmationModal` → focus trapped
