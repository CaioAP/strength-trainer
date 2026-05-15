"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Result } from "@/lib/types/common.types";
import { Exercise, CreateExerciseInput } from "@/domain/entities/Exercise";
import { MuscleGroup } from "@/components/admin/AdminDashboard.types";
import { SupabaseExerciseRepository } from "@/infrastructure/supabase/SupabaseExerciseRepository";
import { GetExercises } from "@/application/useCases/exercises/GetExercises";
import { GetExercise } from "@/application/useCases/exercises/GetExercise";
import { SaveExercise, SaveExerciseInput } from "@/application/useCases/exercises/SaveExercise";
import { DeleteExercise } from "@/application/useCases/exercises/DeleteExercise";

async function assertAdminRole(supabase: SupabaseClient): Promise<Result<string>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Not authenticated") };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { data: null, error: new Error("Unauthorized. Admin role required.") };
    }
    return { data: user.id, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Auth assertion failed"),
    };
  }
}

export async function getExercises(): Promise<Result<Exercise[]>> {
  const supabase = await createClient();
  return new GetExercises(new SupabaseExerciseRepository(supabase)).execute();
}

export async function getExercise(id: string): Promise<Result<Exercise>> {
  const supabase = await createClient();
  return new GetExercise(new SupabaseExerciseRepository(supabase)).execute(id);
}

export async function getMuscleGroups(): Promise<Result<MuscleGroup[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("muscle_groups")
    .select("*")
    .order("name");
  if (error) return { data: null, error };
  return { data: data as MuscleGroup[], error: null };
}

export async function saveExercise(input: SaveExerciseInput): Promise<Result<Exercise>> {
  const supabase = await createClient();
  const roleResult = await assertAdminRole(supabase);
  if (roleResult.error) return { data: null, error: roleResult.error };

  const result = await new SaveExercise(new SupabaseExerciseRepository(supabase)).execute(input);
  if (!result.error) revalidatePath("/");
  return result;
}

export async function deleteExercise(id: string): Promise<Result<void>> {
  const supabase = await createClient();
  const roleResult = await assertAdminRole(supabase);
  if (roleResult.error) return { data: null, error: roleResult.error };

  const result = await new DeleteExercise(new SupabaseExerciseRepository(supabase)).execute(id);
  if (!result.error) revalidatePath("/");
  return result;
}

export type { SaveExerciseInput, CreateExerciseInput };
