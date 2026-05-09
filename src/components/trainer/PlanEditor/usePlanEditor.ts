"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { navigateBackAndRefresh } from "@/lib/utils/navigation";
import { Result } from "@/lib/types/common.types";
import { ExerciseMaster, WorkoutInput, UsePlanEditorReturn } from "./PlanEditor.types";

interface PlanExerciseRow {
  exercise_id: string;
  sets: number;
  reps: number;
  load: number;
  rest_seconds: number;
  order_index: number;
}

interface WorkoutRow {
  id: string;
  name: string;
  order_index: number;
  plan_exercises: PlanExerciseRow[];
}

interface PlanRow {
  name: string;
  workouts: WorkoutRow[];
}

export const usePlanEditor = (): UsePlanEditorReturn => {
  const [exercisesMaster, setExercisesMaster] = useState<ExerciseMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planName, setPlanName] = useState("");
  const [expandedWorkouts, setExpandedWorkouts] = useState<Record<number, boolean>>({ 0: true });
  const [workouts, setWorkouts] = useState<WorkoutInput[]>([
    { name: "Workout A", exercises: [{ exercise_id: "", sets: 3, reps: 10, load: 0, rest: 60 }] },
  ]);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("student_id");
  const editId = searchParams.get("plan_id");

  const init = useCallback(async (): Promise<void> => {
    // Avoid setting state if already loading to prevent cascading renders
    const { data: exData } = await supabase.from("exercise_master").select("id, name, media_url").order("name");
    if (exData) setExercisesMaster(exData as ExerciseMaster[]);

    if (editId) {
      try {
        const { data: planData, error: pErr } = await supabase
          .from("plans")
          .select(`
            name,
            workouts (
              id,
              name,
              order_index,
              plan_exercises (
                exercise_id,
                sets,
                reps,
                load,
                rest_seconds,
                order_index
              )
            )
          `)
          .eq("id", editId)
          .single();

        if (pErr) throw pErr;
        const plan = planData as unknown as PlanRow;

        setPlanName(plan.name);

        const mappedWorkouts = (plan.workouts || [])
          .sort((a: WorkoutRow, b: WorkoutRow) => a.order_index - b.order_index)
          .map((w: WorkoutRow) => ({
            name: w.name,
            exercises: (w.plan_exercises || [])
              .sort((a: PlanExerciseRow, b: PlanExerciseRow) => a.order_index - b.order_index)
              .map((ex: PlanExerciseRow) => ({
                exercise_id: ex.exercise_id,
                sets: ex.sets,
                reps: ex.reps,
                load: ex.load,
                rest: ex.rest_seconds,
              })),
          }));

        setWorkouts(mappedWorkouts);
        const initialExpanded: Record<number, boolean> = {};
        mappedWorkouts.forEach((_: WorkoutInput, i: number) => (initialExpanded[i] = true));
        setExpandedWorkouts(initialExpanded);
      } catch (err) {
        console.error("Error loading plan for edit:", err);
        setError("error_load_failed");
      }
    }

    setLoading(false);
  }, [supabase, editId]);

  useEffect(() => {
    if (loading && exercisesMaster.length === 0) {
      void Promise.resolve().then(() => init());
    }
  }, [init, loading, exercisesMaster.length]);

  const addWorkout = (): void => {
    const newIndex = workouts.length;
    setWorkouts([...workouts, {
      name: `Workout ${String.fromCharCode(65 + newIndex)}`,
      exercises: [{ exercise_id: "", sets: 3, reps: 10, load: 0, rest: 60 }],
    }]);
    setExpandedWorkouts((prev) => ({ ...prev, [newIndex]: true }));
  };

  const toggleWorkout = (index: number): void => {
    setExpandedWorkouts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const addExercise = (wIndex: number): void => {
    const newWorkouts = [...workouts];
    newWorkouts[wIndex].exercises.push({ exercise_id: "", sets: 3, reps: 10, load: 0, rest: 60 });
    setWorkouts(newWorkouts);
  };

  const removeExercise = (wIndex: number, eIndex: number): void => {
    const newWorkouts = [...workouts];
    newWorkouts[wIndex].exercises.splice(eIndex, 1);
    setWorkouts(newWorkouts);
  };

  const removeWorkout = (index: number): void => {
    if (workouts.length <= 1) return;
    const newWorkouts = [...workouts];
    newWorkouts.splice(index, 1);
    setWorkouts(newWorkouts);
    const newExpanded = { ...expandedWorkouts };
    delete newExpanded[index];
    setExpandedWorkouts(newExpanded);
  };

  const handleSave = async (): Promise<Result<void>> => {
    if (!planName.trim()) {
      return { data: null, error: new Error("error_name_required") };
    }

    for (const workout of workouts) {
      if (workout.exercises.some((ex) => !ex.exercise_id)) {
        return { data: null, error: new Error(`error_exercise_required|${workout.name}`) };
      }
    }

    setActionLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required.");

      const { data: trainerProfile } = await supabase
        .from("trainer_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!trainerProfile) throw new Error("Trainer profile not found.");

      let plan;

      if (editId) {
        const { data: updatedPlan, error: pErr } = await supabase
          .from("plans")
          .update({ name: planName })
          .eq("id", editId)
          .select()
          .single();
        if (pErr) throw pErr;
        plan = updatedPlan;

        const { error: dErr } = await supabase.from("workouts").delete().eq("plan_id", editId);
        if (dErr) throw dErr;
      } else {
        const { data: newPlan, error: pErr } = await supabase
          .from("plans")
          .insert([{
            name: planName,
            trainer_id: trainerProfile.id,
            student_id: studentId || null,
            is_template: !studentId,
          }])
          .select()
          .single();
        if (pErr) throw pErr;
        plan = newPlan;
      }

      for (let i = 0; i < workouts.length; i++) {
        const wData = workouts[i];
        const { data: workout, error: workoutError } = await supabase
          .from("workouts")
          .insert([{ plan_id: plan.id, name: wData.name, order_index: i }])
          .select()
          .single();

        if (workoutError) throw workoutError;

        const exercisesToInsert = wData.exercises.map((ex, exIndex) => ({
          workout_id: workout.id,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          load: ex.load,
          rest_seconds: ex.rest,
          order_index: exIndex,
        }));

        const { error: exError } = await supabase.from("plan_exercises").insert(exercisesToInsert);
        if (exError) throw exError;
      }

      navigateBackAndRefresh(router);
      return { data: undefined, error: null };
    } catch (err: unknown) {
      console.error("Error saving plan:", err);
      return { data: null, error: err as Error };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    exercisesMaster,
    loading,
    actionLoading,
    error,
    setError,
    planName,
    setPlanName,
    expandedWorkouts,
    workouts,
    setWorkouts,
    addWorkout,
    toggleWorkout,
    addExercise,
    removeExercise,
    removeWorkout,
    handleSave,
    editId,
    router,
  };
};
