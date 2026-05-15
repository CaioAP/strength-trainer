import { Result } from "@/lib/types/common.types";
import { Exercise, CreateExerciseInput } from "@/domain/entities/Exercise";
import { IExerciseRepository } from "@/domain/repositories/IExerciseRepository";

export interface SaveExerciseInput {
  id?: string;
  data: CreateExerciseInput;
}

export class SaveExercise {
  constructor(private readonly repo: IExerciseRepository) {}

  async execute(input: SaveExerciseInput): Promise<Result<Exercise>> {
    if (!input.data.name || !input.data.muscle_group) {
      return { data: null, error: new Error("Name and muscle group are required") };
    }
    if (input.id) {
      return this.repo.update(input.id, input.data);
    }
    return this.repo.create(input.data);
  }
}
