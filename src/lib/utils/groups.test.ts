import { describe, it, expect } from "vitest";
import {
  buildGroups,
  buildGroupRows,
  buildExerciseRows,
  createEmptyExercise,
  createSingletonGroup,
  isGroupIncomplete,
  GroupInput,
  RawGroup,
} from "./groups";

interface RawEx {
  order_in_group: number;
  exercise_id: string;
}

describe("buildGroups", () => {
  it("sorts groups by order_index and exercises by order_in_group", () => {
    const raw: RawGroup<RawEx>[] = [
      {
        order_index: 1,
        plan_exercises: [
          { order_in_group: 1, exercise_id: "b" },
          { order_in_group: 0, exercise_id: "a" },
        ],
      },
      { order_index: 0, plan_exercises: [{ order_in_group: 0, exercise_id: "x" }] },
    ];

    const result = buildGroups(
      raw,
      (g, exercises) => ({ order: g.order_index, exercises }),
      (ex: RawEx) => ex.exercise_id,
    );

    expect(result).toEqual([
      { order: 0, exercises: ["x"] },
      { order: 1, exercises: ["a", "b"] },
    ]);
  });

  it("handles null/undefined groups and exercises", () => {
    expect(buildGroups(null, (_g, e) => e, (ex: RawEx) => ex)).toEqual([]);
    expect(
      buildGroups([{ order_index: 0, plan_exercises: null }], (_g, e) => e, (ex: RawEx) => ex),
    ).toEqual([[]]);
  });
});

describe("buildGroupRows", () => {
  it("assigns order_index by position and trims labels to null", () => {
    const groups: GroupInput[] = [
      { label: "  ", rounds: 3, rest: 60, exercises: [] },
      { label: " Superset A ", rounds: 4, rest: 90, exercises: [] },
    ];

    expect(buildGroupRows(groups, "w1")).toEqual([
      { workout_id: "w1", label: null, rounds: 3, rest_seconds: 60, order_index: 0 },
      { workout_id: "w1", label: "Superset A", rounds: 4, rest_seconds: 90, order_index: 1 },
    ]);
  });
});

describe("buildExerciseRows", () => {
  it("mirrors sets=rounds and rest_seconds=group.rest and runs order_index", () => {
    const group: GroupInput = {
      label: null,
      rounds: 4,
      rest: 90,
      exercises: [
        { exercise_id: "a", reps: 10, load: 40 },
        { exercise_id: "b", reps: 12, load: 35 },
      ],
    };

    const rows = buildExerciseRows(group, "g1", "w1", 5);

    expect(rows).toEqual([
      { workout_id: "w1", group_id: "g1", exercise_id: "a", reps: 10, load: 40, sets: 4, rest_seconds: 90, order_in_group: 0, order_index: 5 },
      { workout_id: "w1", group_id: "g1", exercise_id: "b", reps: 12, load: 35, sets: 4, rest_seconds: 90, order_in_group: 1, order_index: 6 },
    ]);
  });
});

describe("factories", () => {
  it("createEmptyExercise has empty id and default reps/load", () => {
    expect(createEmptyExercise()).toEqual({ exercise_id: "", reps: 10, load: 0 });
  });

  it("createSingletonGroup has one empty exercise", () => {
    const group = createSingletonGroup();
    expect(group.rounds).toBe(3);
    expect(group.rest).toBe(60);
    expect(group.exercises).toHaveLength(1);
  });
});

describe("isGroupIncomplete", () => {
  it("flags empty groups and missing exercise ids", () => {
    expect(isGroupIncomplete({ label: null, rounds: 1, rest: 60, exercises: [] })).toBe(true);
    expect(isGroupIncomplete(createSingletonGroup())).toBe(true);
    expect(
      isGroupIncomplete({ label: null, rounds: 1, rest: 60, exercises: [{ exercise_id: "a", reps: 10, load: 0 }] }),
    ).toBe(false);
  });
});
