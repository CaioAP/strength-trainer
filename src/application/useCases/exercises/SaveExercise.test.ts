import { describe, it, expect, vi } from "vitest";
import { SaveExercise } from "./SaveExercise";
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

describe("SaveExercise", () => {
  it("returns error when name is missing", async () => {
    const repo = makeRepo();
    const result = await new SaveExercise(repo).execute({
      data: { name: "", muscle_group: "legs" },
    });

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe("Name and muscle group are required");
  });

  it("returns error when muscle_group is missing", async () => {
    const repo = makeRepo();
    const result = await new SaveExercise(repo).execute({
      data: { name: "Squat", muscle_group: "" },
    });

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe("Name and muscle group are required");
  });

  it("calls repo.create when no id provided", async () => {
    const created = makeExercise({ id: "new-1" });
    const createFn = vi.fn(async () => ({ data: created, error: null }));
    const repo = makeRepo({ create: createFn });

    const result = await new SaveExercise(repo).execute({
      data: { name: "Squat", muscle_group: "legs" },
    });

    expect(createFn).toHaveBeenCalledOnce();
    expect(result.data).toEqual(created);
    expect(result.error).toBeNull();
  });

  it("calls repo.update when id provided", async () => {
    const updated = makeExercise({ name: "Updated Squat" });
    const updateFn = vi.fn(async () => ({ data: updated, error: null }));
    const repo = makeRepo({ update: updateFn });

    const result = await new SaveExercise(repo).execute({
      id: "1",
      data: { name: "Updated Squat", muscle_group: "legs" },
    });

    expect(updateFn).toHaveBeenCalledWith("1", { name: "Updated Squat", muscle_group: "legs" });
    expect(result.data).toEqual(updated);
    expect(result.error).toBeNull();
  });
});
