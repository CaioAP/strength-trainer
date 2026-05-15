import { Result } from "@/lib/types/common.types";
import { Exercise } from "@/domain/entities/Exercise";
import { IExerciseRepository } from "@/domain/repositories/IExerciseRepository";

export class GetExercises {
  constructor(private readonly repo: IExerciseRepository) {}

  execute(): Promise<Result<Exercise[]>> {
    return this.repo.findAll();
  }
}
