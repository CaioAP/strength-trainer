import { Result } from "@/lib/types/common.types";
import { Exercise, CreateExerciseInput, UpdateExerciseInput } from "@/domain/entities/Exercise";

export interface IExerciseRepository {
  findAll(): Promise<Result<Exercise[]>>;
  findById(id: string): Promise<Result<Exercise>>;
  create(data: CreateExerciseInput): Promise<Result<Exercise>>;
  update(id: string, data: UpdateExerciseInput): Promise<Result<Exercise>>;
  delete(id: string): Promise<Result<void>>;
}
