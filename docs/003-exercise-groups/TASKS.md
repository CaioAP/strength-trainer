# Tasks: Exercise Groups

## Phase 1 — Database
- [x] EG-101 Create migration `20260612000001_exercise_groups.sql` (table, alter, backfill, RLS, indexes)
- [ ] EG-102 Run `npm run migrate`

## Phase 2 — Pure helpers
- [x] EG-201 `src/lib/utils/groups.ts` — buildGroups, buildGroupRows, buildExerciseRows, factories
- [x] EG-202 `src/lib/utils/groups.test.ts` — round-trip, ordering, mirroring, factories

## Phase 3 — Trainer Plan Editor
- [x] EG-301 Reshape `PlanEditor.types.ts` (groups)
- [x] EG-302 `usePlanEditor.ts` grouped load/save + group actions
- [x] EG-303 `GroupSection.tsx` (new)
- [x] EG-304 `WorkoutSection.tsx` render groups
- [x] EG-305 `ExerciseRow.tsx` reps/load only
- [x] EG-306 `PlanEditor.tsx` wire handlers

## Phase 4 — Student Workout Runner
- [x] EG-401 `WorkoutRunner.types.ts` group types
- [x] EG-402 `useWorkoutRunner.ts` grouped fetch
- [x] EG-403 `GroupCard.tsx` (new)
- [x] EG-404 `WorkoutRunner.tsx` render groups
- [x] EG-405 `ActiveExerciseCard.tsx` group-aware sets/rest

## Phase 5 — Offline
- [x] EG-501 Dexie v3 store + ExerciseGroup interface

## Phase 6 — i18n
- [x] EG-601 `locales/en.json` keys
- [x] EG-602 `locales/pt.json` keys

## Phase 7 — Validation
- [x] EG-701 `npm run lint && npm run typecheck && npm run test`
- [x] EG-102 Run `npm run migrate`
