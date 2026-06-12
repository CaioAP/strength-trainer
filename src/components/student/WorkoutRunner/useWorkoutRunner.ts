"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Result } from "@/lib/types/common.types";
import { buildGroups } from "@/lib/utils/groups";
import { Workout, RunnerGroup, ExtendedPlanExercise, UseWorkoutRunnerReturn, ExerciseMaster } from "./WorkoutRunner.types";

interface RawRunnerExercise {
  id: string;
  reps: number;
  load: number;
  sets: number;
  rest_seconds: number;
  order_in_group: number;
  exercise: ExerciseMaster | ExerciseMaster[] | null;
}

interface RawRunnerGroup {
  id: string;
  label: string | null;
  rounds: number;
  rest_seconds: number;
  order_index: number;
  plan_exercises: RawRunnerExercise[] | null;
}

export const useWorkoutRunner = (): UseWorkoutRunnerReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [groups, setGroups] = useState<RunnerGroup[]>([]);
  const exercises = useMemo<ExtendedPlanExercise[]>(() => groups.flatMap((g) => g.exercises), [groups]);
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
        exercise_groups (
          id,
          label,
          rounds,
          rest_seconds,
          order_index,
          plan_exercises (
            id,
            sets,
            reps,
            load,
            rest_seconds,
            order_in_group,
            exercise:exercise_master (name, name_pt, instructions, instructions_pt, media_url)
          )
        )
      `)
      .eq("id", workoutId)
      .single();

    if (fetchError) {
      console.error("Error fetching workout:", fetchError);
      setError(fetchError.message);
    } else if (data) {
      const rawGroups = data.exercise_groups as unknown as RawRunnerGroup[];

      const builtGroups = buildGroups<RawRunnerExercise, RawRunnerGroup, RunnerGroup, ExtendedPlanExercise>(
        rawGroups,
        (g, groupExercises) => ({
          id: g.id,
          label: g.label,
          rounds: g.rounds,
          rest_seconds: g.rest_seconds,
          order_index: g.order_index,
          exercises: groupExercises,
        }),
        (ex) => ({
          id: ex.id,
          sets: ex.sets,
          reps: ex.reps,
          load: ex.load,
          rest_seconds: ex.rest_seconds,
          order_index: ex.order_in_group,
          exercise: (Array.isArray(ex.exercise) ? ex.exercise[0] : ex.exercise) as ExerciseMaster,
          actual_sets: ex.sets,
          actual_reps: ex.reps,
          actual_load: ex.load,
          actual_rest: ex.rest_seconds,
        }),
      );

      setWorkout({ name: data.name as string, groups: builtGroups });
      setGroups(builtGroups);
      const exerciseCount = builtGroups.reduce((sum, g) => sum + g.exercises.length, 0);
      if (exerciseCount === 0) setError("no_exercises");
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
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        exercises: g.exercises.map((ex) => (ex.id === exId ? { ...ex, [param]: value } : ex)),
      })),
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
    groups,
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
