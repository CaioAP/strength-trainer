# Changelog

> Format: `[task-id] type(scope): description`
> Types: `feat`, `fix`, `refactor`, `test`, `chore`, `a11y`
> Related: [PLAN.md](./PLAN.md) | [TASKS.md](./TASKS.md)

---

## Unreleased

### Phase 1 — DDD Scaffolding + Reference Migration

- `[1.1]` chore(agents): update UI primitives path from `src/ui/` to `src/components/ui/`
- `[1.2]` chore(arch): scaffold domain/application/infrastructure directories
- `[1.3]` feat(domain): add Exercise entity and input types
- `[1.4]` feat(domain): add IExerciseRepository interface (port)
- `[1.5]` feat(app): add GetExercises use case
- `[1.6]` feat(app): add GetExercise use case
- `[1.7]` feat(app): add SaveExercise use case with validation
- `[1.8]` feat(app): add DeleteExercise use case
- `[1.9]` feat(infra): add SupabaseExerciseRepository adapter
- `[1.10]` feat(actions): add exercises server actions as composition root
- `[1.11]` refactor(admin): remove direct Supabase calls from useExerciseEditor
- `[1.12]` test(app): add GetExercises use case tests
- `[1.13]` test(app): add SaveExercise use case tests
- `[1.14]` test(app): add DeleteExercise use case tests

### Phase 2 — Navigation & Routing

- `[2.1]` feat(ui): add `backHref` prop to SubPageHeader; use Link when provided, router.back() as fallback
- `[2.2]` fix(settings): pass `backHref="/"` to SubPageHeader in all 5 settings sub-pages
- `[2.3]` refactor(settings): convert SettingsModal SettingsItem from div+onClick to Link
- `[2.4]` refactor(settings): remove `navigating` state and loading overlay from SettingsModal
- `[2.5]` refactor(workout): replace router.back() with router.push('/') in useWorkoutRunner handleSafeBack
- `[2.6]` fix(workout): replace router.back() error fallback with Link href="/" in WorkoutRunner
- `[2.7]` refactor(workout): remove `router` from UseWorkoutRunnerReturn; add handleExitConfirmed
- `[2.8]` chore(arch): delete src/lib/utils/navigation.ts

### Phase 3 — Accessibility

- `[3.1]` a11y(ui): add role=dialog, aria-modal, aria-labelledby, focus trap, Escape, restore focus to ConfirmationModal
- `[3.2]` a11y(ui): add role=dialog, aria-modal, aria-labelledby, focus trap, aria-label on close button to SettingsModal
- `[3.3]` a11y(ui): add role=tablist to nav, role=tab + aria-selected + aria-label to each button in BottomNav

### Phase 4 — Types Files

- `[4.1]` refactor(auth): create Auth.types.ts with return types for all 4 auth hooks
- `[4.2]` refactor(auth): update auth hooks to import from Auth.types.ts
- `[4.3]` refactor(settings): create Settings.types.ts with shared types across settings hooks
- `[4.4]` refactor(student): create HistoryView.types.ts
- `[4.5]` refactor(student): create WorkoutView.types.ts
- `[4.6]` refactor(trainer): create StudentsTab.types.ts
- `[4.7]` refactor(trainer): create TemplatesTab.types.ts
- `[4.8]` refactor(trainer): add ExerciseRowProps and WorkoutSectionProps to PlanEditor.types.ts
- `[4.9]` refactor(ui): create ConfirmationModal.types.ts
- `[4.10]` refactor(ui): create SettingsModal.types.ts
- `[4.11]` refactor(ui): create PlanAssignmentModal.types.ts

### Phase 5 — Unit Tests

- `[5.1]` test(ui): add Button.test.tsx — renders, variant classes, loading state, disabled state
- `[5.2]` test(ui): add ConfirmationModal.test.tsx — open/close, Escape key, focus trap, onConfirm called

### Phase 6 — i18n

- `[6.1]` feat(i18n): add Student.WorkoutRunner.not_found key to en.json and pt.json
- `[6.2]` feat(i18n): add Settings.version key to en.json and pt.json
- `[6.3]` feat(i18n): add Common.VideoUpload error keys to en.json and pt.json
- `[6.4]` refactor(ui): use t() for all 3 validation/error strings in VideoUpload.tsx
- `[6.5]` refactor(workout): use t('not_found') for error fallback in WorkoutRunner.tsx
- `[6.6]` refactor(settings): use t('version') for version string in SettingsModal.tsx

### Verification

- `[V.1]` chore(verify): npm run lint — 0 errors, 0 warnings
- `[V.2]` chore(verify): npm run typecheck — 0 errors
- `[V.3]` chore(verify): npm run test — 26/26 pass
- `[V.4]` fix(actions): use `import type` for type-only imports in exercises.ts to fix Turbopack build; npm run build — 29/29 pages clean
