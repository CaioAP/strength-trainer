"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Result } from "@/lib/types/common.types";
import { Workout, ExtendedPlanExercise, UseWorkoutRunnerReturn, ExerciseMaster } from "./WorkoutRunner.types";

export const useWorkoutRunner = (): UseWorkoutRunnerReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<ExtendedPlanExercise[]>([]);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [effortRpe, setEffortRpe] = useState(7);
  const [seconds, setSeconds] = useState(0);
  const [startTime] = useState(new Date().toISOString());

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workoutId = searchParams.get("workout_id");
  const initialized = useRef(false);

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const isDirty = seconds > 2;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return (): void => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleSafeBack = useCallback((): void => {
    if (isDirty) setShowExitModal(true);
    else router.push("/");
  }, [isDirty, router]);

  const handleExitConfirmed = useCallback((): void => {
    router.push("/");
  }, [router]);

  useEffect((): (() => void) => {
    const interval = setInterval((): void => setSeconds((s: number): number => s + 1), 1000);
    return (): void => clearInterval(interval);
  }, []);

  const fetchWorkout = useCallback(async (): Promise<void> => {
    if (!workoutId) return;

    const { data, error: fetchError } = await supabase
      .from("workouts")
      .select(`
        name,
        plan_exercises (
          id,
          sets,
          reps,
          load,
          rest_seconds,
          order_index,
          exercise:exercise_master (name, name_pt, instructions, instructions_pt, media_url)
        )
      `)
      .eq("id", workoutId)
      .single();

    if (fetchError) {
      console.error("Error fetching workout:", fetchError);
      setError(fetchError.message);
    } else if (data) {
      setWorkout(data as unknown as Workout);
      
      const rawEx = (data.plan_exercises as unknown as Array<Record<string, unknown>>) || [];
      const sortedExercises = [...rawEx]
        .sort((a, b) => ((a.order_index as number) || 0) - ((b.order_index as number) || 0))
        .map((ex): ExtendedPlanExercise => ({
          id: ex.id as string,
          sets: ex.sets as number,
          reps: ex.reps as number,
          load: ex.load as number,
          rest_seconds: ex.rest_seconds as number,
          order_index: ex.order_index as number,
          exercise: (Array.isArray(ex.exercise) ? ex.exercise[0] : ex.exercise) as ExerciseMaster,
          actual_sets: ex.sets as number,
          actual_reps: ex.reps as number,
          actual_load: ex.load as number,
          actual_rest: ex.rest_seconds as number,
        }));
      setExercises(sortedExercises);
      if (sortedExercises.length === 0) setError("no_exercises");
    }
  }, [supabase, workoutId]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!initialized.current) {
        initialized.current = true;
      }
      setLoading(true);
      await fetchWorkout();
      setLoading(false);
    };
    void Promise.resolve().then(() => load());
  }, [fetchWorkout]);

  const toggleExercise = (exId: string): void => {
    setCompletedExercises((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  const updateExerciseParam = (exId: string, param: keyof ExtendedPlanExercise, value: number): void => {
    setExercises((prev) => 
      prev.map((ex) => (ex.id === exId ? { ...ex, [param]: value } : ex))
    );
  };

  const handleFinish = async (): Promise<Result<void>> => {
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: sProf } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      const { data: execution, error: execError } = await supabase
        .from("workout_executions")
        .insert([{
          student_id: sProf?.id,
          workout_id: workoutId,
          effort_rpe: effortRpe,
          started_at: startTime,
          completed_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (execError) throw execError;

      const modifications = exercises
        .filter((ex) =>
          ex.actual_sets !== ex.sets ||
          ex.actual_reps !== ex.reps ||
          ex.actual_load !== ex.load ||
          ex.actual_rest !== ex.rest_seconds
        )
        .map((ex) => ({
          execution_id: execution.id,
          plan_exercise_id: ex.id,
          set_number: 1,
          actual_reps: ex.actual_reps,
          actual_load: ex.actual_load,
          notes: `Modified session: Sets ${ex.actual_sets}, Rest ${ex.actual_rest}s`,
        }));

      if (modifications.length > 0) {
        const { error: modError } = await supabase
          .from("session_param_modifications")
          .insert(modifications);
        if (modError) throw modError;
      }

      router.push("/");
      return { data: undefined, error: null };
    } catch (err: unknown) {
      console.error("Error finishing workout:", err);
      return { data: null, error: err as Error };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    loading,
    error,
    actionLoading,
    workout,
    exercises,
    completedExercises,
    showFinishModal,
    setShowFinishModal,
    showExitModal,
    setShowExitModal,
    effortRpe,
    setEffortRpe,
    seconds,
    completedCount,
    handleSafeBack,
    handleExitConfirmed,
    toggleExercise,
    updateExerciseParam,
    handleFinish,
  };
};
