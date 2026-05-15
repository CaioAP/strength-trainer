# Plan: Deferred Video Upload + exercise-tutorials Bucket

See [TASKS.md](./TASKS.md) and [CHANGELOG.md](./CHANGELOG.md).

## Context

Two problems:
1. `exercise-tutorials` Supabase storage bucket never created → `StorageApiError: Bucket not found` on upload.
2. `VideoUpload.tsx` uploads immediately on file select — should defer to Save click, with atomic error/success feedback.

## Approach

1. **Migration**: create `exercise-tutorials` bucket (public) + RLS (admins upload, public read).
2. **VideoUpload**: pure file-picker — holds `File` in state, previews via `URL.createObjectURL`, exposes `onFileSelected(file | null)`.
3. **useExerciseEditor.handleSave**: upload video (if pending) → save exercise → show success + navigate back; show error and stop on any failure.
4. **ExerciseEditor**: wire new prop, render success banner.
5. **i18n**: add `save_success`, `upload_failed`, `save_failed` under `Admin.Exercises`.

## Files Modified

| File | Change |
|------|--------|
| `supabase/migrations/20260515000001_exercise_tutorials_bucket.sql` | New — bucket + RLS |
| `src/components/ui/VideoUpload.tsx` | Decouple from Supabase |
| `src/components/admin/ExerciseEditor/ExerciseEditor.types.ts` | Add `success`, `setPendingVideoFile` |
| `src/components/admin/ExerciseEditor/useExerciseEditor.ts` | Deferred upload + success state |
| `src/components/admin/ExerciseEditor/ExerciseEditor.tsx` | Wire props + success banner |
| `locales/en.json` | 3 new keys |
| `locales/pt.json` | 3 new keys |

## Verification

1. `npm run migrate` — no error
2. Upload MP4 via ExerciseEditor → success message → navigate back
3. Save without video → success
4. Invalid file type/size → validation error in VideoUpload, no save triggered
5. `npm run lint && npm run typecheck && npm run test` — all pass
