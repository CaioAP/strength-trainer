import { Result } from "@/lib/types/common.types";
import { IExerciseRepository } from "@/domain/repositories/IExerciseRepository";

export class DeleteExercise {
  constructor(private readonly repo: IExerciseRepository) {}

  execute(id: string): Promise<Result<void>> {
    return this.repo.delete(id);
  }
}
