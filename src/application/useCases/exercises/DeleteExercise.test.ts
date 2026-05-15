import { describe, it, expect, vi } from "vitest";
import { DeleteExercise } from "./DeleteExercise";
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

describe("DeleteExercise", () => {
  it("calls repo.delete with the given id", async () => {
    const deleteFn = vi.fn(async () => ({ data: undefined, error: null }));
    const repo = makeRepo({ delete: deleteFn });

    const result = await new DeleteExercise(repo).execute("abc-123");

    expect(deleteFn).toHaveBeenCalledWith("abc-123");
    expect(result.error).toBeNull();
  });

  it("propagates repo error", async () => {
    const repoError = new Error("Delete failed");
    const repo = makeRepo({ delete: async () => ({ data: null, error: repoError }) });

    const result = await new DeleteExercise(repo).execute("abc-123");

    expect(result.data).toBeNull();
    expect(result.error).toBe(repoError);
  });
});
