import type { SupabaseClient } from "@supabase/supabase-js";
import { Result } from "@/lib/types/common.types";
import { Exercise, CreateExerciseInput, UpdateExerciseInput } from "@/domain/entities/Exercise";
import { IExerciseRepository } from "@/domain/repositories/IExerciseRepository";

export class SupabaseExerciseRepository implements IExerciseRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findAll(): Promise<Result<Exercise[]>> {
    const { data, error } = await this.supabase
      .from("exercise_master")
      .select("*")
      .order("name");
    if (error) return { data: null, error };
    return { data: data as Exercise[], error: null };
  }

  async findById(id: string): Promise<Result<Exercise>> {
    const { data, error } = await this.supabase
      .from("exercise_master")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return { data: null, error };
    return { data: data as Exercise, error: null };
  }

  async create(input: CreateExerciseInput): Promise<Result<Exercise>> {
    const { data, error } = await this.supabase
      .from("exercise_master")
      .insert([input])
      .select()
      .single();
    if (error) return { data: null, error };
    return { data: data as Exercise, error: null };
  }

  async update(id: string, input: UpdateExerciseInput): Promise<Result<Exercise>> {
    const { data, error } = await this.supabase
      .from("exercise_master")
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error };
    return { data: data as Exercise, error: null };
  }

  async delete(id: string): Promise<Result<void>> {
    const { error } = await this.supabase
      .from("exercise_master")
      .delete()
      .eq("id", id);
    if (error) return { data: null, error };
    return { data: undefined, error: null };
  }
}
