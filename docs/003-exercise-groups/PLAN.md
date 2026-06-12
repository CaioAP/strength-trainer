# Plan: Exercise Groups (Supersets / Circuits)

See [TASKS.md](./TASKS.md) and [CHANGELOG.md](./CHANGELOG.md).

## Context

A workout was a flat ordered list of `plan_exercises`. Trainers could not express "do A → B → C back-to-back, then rest" (supersets/circuits). This adds **exercise groups**: trainers group exercises in the Plan Editor and students see + run them as a unit.

## Decisions

- **Circuit-with-rounds**: a group has `rounds` (repeat whole group N times) and `rest_seconds` (break after each round). Each exercise keeps its own `reps` + `load`.
- **Uniform model**: every exercise belongs to a group. Standalone exercise = singleton group (`rounds` = its old `sets`). Existing plans auto-wrapped by migration.
- `plan_exercises.sets` / `rest_seconds` kept, mirrored from the group on write (`sets = rounds`, `rest_seconds = group.rest`), so existing WorkoutRunner/history readers keep working.

## Approach

1. **DB**: new `exercise_groups` table; `plan_exercises` gains `group_id` + `order_in_group`; backfill singleton groups; RLS mirrors `workouts`.
2. **Pure helpers** (`src/lib/utils/groups.ts`, fully unit-tested): build grouped state from DB rows, build insert rows (group + mirrored exercise rows), factories.
3. **Trainer Plan Editor**: state becomes `workouts[].groups[].exercises[]`; new `GroupSection` card with label/rounds/rest; grouped save (insert groups, then exercises).
4. **Student Workout Runner**: grouped fetch + `GroupCard` wrapper (label, rounds, rest badge); flat exercise list retained for completion + finish logic (unchanged).
5. **Offline**: Dexie v3 — add `exercise_groups` store, `group_id` index on `plan_exercises`.
6. **i18n**: new keys under `Trainer.PlanEditor` and `Student.WorkoutRunner`.

## Files

| File | Change |
|------|--------|
| `supabase/migrations/20260612000001_exercise_groups.sql` | New table + alter + backfill + RLS |
| `src/lib/utils/groups.ts` (+ `.test.ts`) | Pure transforms / factories |
| `src/components/trainer/PlanEditor/*` | Grouped types, hook, sections |
| `src/components/student/WorkoutRunner/*` | Grouped types, hook, GroupCard |
| `src/lib/db/dexie.ts` | v3 store |
| `locales/{pt,en}.json` | New keys |

## Verification

1. `npm run migrate` — succeeds; `exercise_groups` count == old `plan_exercises` count, every `plan_exercises.group_id` set.
2. Trainer: existing plan loads as singleton groups; create a 3-exercise group (rounds 3, rest 90), save, reload edit → persists with order.
3. Student: session shows the 3 exercises under one superset card; finish + RPE + modifications still record per exercise.
4. `npm run lint && npm run typecheck && npm run test` — all green.
