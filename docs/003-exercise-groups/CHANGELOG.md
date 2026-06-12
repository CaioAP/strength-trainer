# Changelog: Exercise Groups

<!-- [task-id] type(scope): description -->

- [EG-101] feat(db): add exercise_groups table, group_id on plan_exercises, singleton backfill + RLS
- [EG-201] feat(lib): add groups.ts pure transforms (build/insert/factories/validation)
- [EG-202] test(lib): cover groups.ts ordering, mirroring, factories, validation
- [EG-301] refactor(trainer): reshape Plan Editor types to workouts→groups→exercises
- [EG-302] feat(trainer): grouped load/save + group/exercise actions in usePlanEditor
- [EG-303] feat(trainer): add GroupSection card (label, rounds, rest, superset badge)
- [EG-304] feat(trainer): WorkoutSection renders groups + add-group
- [EG-305] refactor(trainer): ExerciseRow shows reps/load only (sets/rest now group-level)
- [EG-306] feat(trainer): wire group handlers in PlanEditor
- [EG-401] feat(student): add RunnerGroup types to Workout Runner
- [EG-402] feat(student): grouped fetch + derived flat list in useWorkoutRunner
- [EG-403] feat(student): add GroupCard (superset header: rounds + rest)
- [EG-404] feat(student): WorkoutRunner renders groups
- [EG-405] refactor(student): ActiveExerciseCard hides sets/rest inside supersets
- [EG-501] feat(offline): Dexie v3 — exercise_groups store, group_id index
- [EG-601] feat(i18n): English keys for groups
- [EG-602] feat(i18n): Portuguese keys for groups
- [EG-701] chore(validation): lint + typecheck + 33 tests passing
- [EG-102] chore(db): applied exercise_groups migration (existing plans backfilled)
