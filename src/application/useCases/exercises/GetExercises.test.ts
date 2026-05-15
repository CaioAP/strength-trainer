import { describe, it, expect } from "vitest";
import { GetExercises } from "./GetExercises";
import { Exercise } from "@/domain/entities/Exercise";
import { IExerciseRepository } from "@/domain/repositories/IExerciseRepository";

const makeExercise = (overrides: Partial<Exercise> = {}): Exercise => ({
  id: "1",
  name: "Squat",
  name_pt: null,
  muscle_group: "legs",
  description: null,
  media_url: null,
  equipment: null,
  difficulty: null,
  type: null,
  instructions: null,
  instructions_pt: null,
  ...overrides,
});

const makeRepo = (overrides: Partial<IExerciseRepository> = {}): IExerciseRepository => ({
  findAll: async () => ({ data: [], error: null }),
  findById: async () => ({ data: makeExercise(), error: null }),
  create: async () => ({ data: makeExercise(), error: null }),
  update: async () => ({ data: makeExercise(), error: null }),
  delete: async () => ({ data: undefined, error: null }),
  ...overrides,
});

describe("GetExercises", () => {
  it("returns exercises from repo", async () => {
    const exercises = [makeExercise(), makeExercise({ id: "2", name: "Bench Press" })];
    const repo = makeRepo({ findAll: async () => ({ data: exercises, error: null }) });

    const result = await new GetExercises(repo).execute();

    expect(result.error).toBeNull();
    expect(result.data).toEqual(exercises);
  });

  it("propagates repo error", async () => {
    const repoError = new Error("DB error");
    const repo = makeRepo({ findAll: async () => ({ data: null, error: repoError }) });

    const result = await new GetExercises(repo).execute();

    expect(result.data).toBeNull();
    expect(result.error).toBe(repoError);
  });
});
