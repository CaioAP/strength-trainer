import { Result } from "@/lib/types/common.types";
import { Exercise } from "@/domain/entities/Exercise";
import { IExerciseRepository } from "@/domain/repositories/IExerciseRepository";

export class GetExercise {
  constructor(private readonly repo: IExerciseRepository) {}

  execute(id: string): Promise<Result<Exercise>> {
    return this.repo.findById(id);
  }
}
