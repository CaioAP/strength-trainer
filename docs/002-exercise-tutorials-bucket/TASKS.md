# Tasks: exercise-tutorials Bucket + Deferred Upload

## Phase 1 — Infrastructure
- [x] T01 · Create migration `20260515000001_exercise_tutorials_bucket.sql`

## Phase 2 — i18n
- [x] T02 · Add `save_success`, `upload_failed`, `save_failed` to `locales/en.json`
- [x] T03 · Add same keys to `locales/pt.json`

## Phase 3 — Component Refactor
- [x] T04 · Refactor `VideoUpload.tsx` to pure file-picker (`onFileSelected`, no Supabase)
- [x] T05 · Update `ExerciseEditor.types.ts` — add `success`, `setPendingVideoFile`
- [x] T06 · Update `useExerciseEditor.ts` — deferred upload + success state
- [x] T07 · Update `ExerciseEditor.tsx` — wire `onFileSelected`, show success banner

## Phase 4 — Validation
- [x] T08 · Run `npm run lint && npm run typecheck && npm run test`
