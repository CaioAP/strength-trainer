// Pure transforms for exercise groups (supersets / circuits).
// Shared by the trainer Plan Editor and the student Workout Runner.

export interface GroupExerciseInput {
  exercise_id: string;
  reps: number;
  load: number;
}

export interface GroupInput {
  label: string | null;
  rounds: number;
  rest: number;
  exercises: GroupExerciseInput[];
}

// Raw row shapes coming back from Supabase / Dexie joins.
export interface RawGroupExercise {
  order_in_group: number;
}

export interface RawGroup<TEx extends RawGroupExercise> {
  order_index: number;
  plan_exercises: TEx[] | null;
}

/**
 * Build ordered, mapped groups from raw joined rows.
 * Groups are sorted by `order_index`, member exercises by `order_in_group`.
 */
export function buildGroups<
  TEx extends RawGroupExercise,
  TRawGroup extends RawGroup<TEx>,
  TGroupOut,
  TExOut,
>(
  rawGroups: TRawGroup[] | null | undefined,
  mapGroup: (raw: TRawGroup, exercises: TExOut[]) => TGroupOut,
  mapExercise: (raw: TEx) => TExOut,
): TGroupOut[] {
  return [...(rawGroups ?? [])]
    .sort((a, b) => a.order_index - b.order_index)
    .map((g) => {
      const exercises = [...(g.plan_exercises ?? [])]
        .sort((a, b) => a.order_in_group - b.order_in_group)
        .map(mapExercise);
      return mapGroup(g, exercises);
    });
}

// ----- Insert payloads (trainer save) -----

export interface GroupRow {
  workout_id: string;
  label: string | null;
  rounds: number;
  rest_seconds: number;
  order_index: number;
}

export interface ExerciseRow {
  workout_id: string;
  group_id: string;
  exercise_id: string;
  reps: number;
  load: number;
  sets: number; // mirrored from group.rounds (legacy readers)
  rest_seconds: number; // mirrored from group.rest (legacy readers)
  order_in_group: number;
  order_index: number; // running, unique per workout
}

const cleanLabel = (label: string | null): string | null => {
  const trimmed = label?.trim();
  return trimmed ? trimmed : null;
};

/** One group row per group, `order_index` = position in the workout. */
export function buildGroupRows(groups: GroupInput[], workoutId: string): GroupRow[] {
  return groups.map((group, index) => ({
    workout_id: workoutId,
    label: cleanLabel(group.label),
    rounds: group.rounds,
    rest_seconds: group.rest,
    order_index: index,
  }));
}

/**
 * Exercise rows for a single group. `sets`/`rest_seconds` are mirrored from the
 * group so legacy per-exercise readers stay correct. `order_index` is a running
 * counter (unique per workout) starting at `startOrderIndex`.
 */
export function buildExerciseRows(
  group: GroupInput,
  groupId: string,
  workoutId: string,
  startOrderIndex: number,
): ExerciseRow[] {
  return group.exercises.map((exercise, index) => ({
    workout_id: workoutId,
    group_id: groupId,
    exercise_id: exercise.exercise_id,
    reps: exercise.reps,
    load: exercise.load,
    sets: group.rounds,
    rest_seconds: group.rest,
    order_in_group: index,
    order_index: startOrderIndex + index,
  }));
}

// ----- Factories -----

export function createEmptyExercise(): GroupExerciseInput {
  return { exercise_id: "", reps: 10, load: 0 };
}

export function createSingletonGroup(): GroupInput {
  return { label: null, rounds: 3, rest: 60, exercises: [createEmptyExercise()] };
}

// ----- Validation -----

/** True when a group has no exercises or any exercise lacks an `exercise_id`. */
export function isGroupIncomplete(group: GroupInput): boolean {
  return group.exercises.length === 0 || group.exercises.some((ex) => !ex.exercise_id);
}
