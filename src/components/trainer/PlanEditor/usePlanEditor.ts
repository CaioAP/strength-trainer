"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Result } from "@/lib/types/common.types";
import {
  buildGroups,
  buildGroupRows,
  buildExerciseRows,
  createSingletonGroup,
  createEmptyExercise,
  isGroupIncomplete,
  ExerciseRow as ExerciseInsertRow,
} from "@/lib/utils/groups";
import {
  ExerciseMaster,
  WorkoutInput,
  ExerciseGroupInput,
  PlanExerciseInput,
  UsePlanEditorReturn,
} from "./PlanEditor.types";

interface PlanExerciseRow {
  exercise_id: string;
  reps: number;
  load: number;
  order_in_group: number;
}

interface ExerciseGroupRow {
  label: string | null;
  rounds: number;
  rest_seconds: number;
  order_index: number;
  plan_exercises: PlanExerciseRow[];
}

interface WorkoutRow {
  id: string;
  name: string;
  order_index: number;
  exercise_groups: ExerciseGroupRow[];
}

interface PlanRow {
  name: string;
  workouts: WorkoutRow[];
}

const newWorkout = (name: string): WorkoutInput => ({ name, groups: [createSingletonGroup()] });

export const usePlanEditor = (): UsePlanEditorReturn => {
  const [exercisesMaster, setExercisesMaster] = useState<ExerciseMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planName, setPlanName] = useState("");
  const [expandedWorkouts, setExpandedWorkouts] = useState<Record<number, boolean>>({ 0: true });
  const [workouts, setWorkouts] = useState<WorkoutInput[]>([newWorkout("Workout A")]);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("student_id");
  const editId = searchParams.get("plan_id");

  const init = useCallback(async (): Promise<void> => {
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
              exercise_groups (
                label,
                rounds,
                rest_seconds,
                order_index,
                plan_exercises (
                  exercise_id,
                  reps,
                  load,
                  order_in_group
                )
              )
            )
          `)
          .eq("id", editId)
          .single();

        if (pErr) throw pErr;
        const plan = planData as unknown as PlanRow;

        setPlanName(plan.name);

        const mappedWorkouts: WorkoutInput[] = (plan.workouts || [])
          .sort((a, b) => a.order_index - b.order_index)
          .map((w) => ({
            name: w.name,
            groups: buildGroups<PlanExerciseRow, ExerciseGroupRow, ExerciseGroupInput, PlanExerciseInput>(
              w.exercise_groups,
              (g, exercises) => ({
                label: g.label,
                rounds: g.rounds,
                rest: g.rest_seconds,
                exercises,
              }),
              (ex) => ({ exercise_id: ex.exercise_id, reps: ex.reps, load: ex.load }),
            ),
          }));

        setWorkouts(mappedWorkouts);
        const initialExpanded: Record<number, boolean> = {};
        mappedWorkouts.forEach((_, i) => (initialExpanded[i] = true));
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

  // ----- Workout mutations -----
  const addWorkout = (): void => {
    const newIndex = workouts.length;
    setWorkouts([...workouts, newWorkout(`Workout ${String.fromCharCode(65 + newIndex)}`)]);
    setExpandedWorkouts((prev) => ({ ...prev, [newIndex]: true }));
  };

  const toggleWorkout = (index: number): void => {
    setExpandedWorkouts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const removeWorkout = (index: number): void => {
    if (workouts.length <= 1) return;
    setWorkouts(workouts.filter((_, i) => i !== index));
    const newExpanded = { ...expandedWorkouts };
    delete newExpanded[index];
    setExpandedWorkouts(newExpanded);
  };

  const updateWorkoutName = (wIndex: number, name: string): void => {
    setWorkouts(workouts.map((w, i) => (i === wIndex ? { ...w, name } : w)));
  };

  // ----- Group / exercise mutations -----
  const mapGroups = (
    wIndex: number,
    fn: (groups: ExerciseGroupInput[]) => ExerciseGroupInput[],
  ): void => {
    setWorkouts(workouts.map((w, i) => (i === wIndex ? { ...w, groups: fn(w.groups) } : w)));
  };

  const addGroup = (wIndex: number): void => {
    mapGroups(wIndex, (groups) => [...groups, createSingletonGroup()]);
  };

  const removeGroup = (wIndex: number, gIndex: number): void => {
    mapGroups(wIndex, (groups) => (groups.length <= 1 ? groups : groups.filter((_, i) => i !== gIndex)));
  };

  const updateGroupField = (
    wIndex: number,
    gIndex: number,
    field: "label" | "rounds" | "rest",
    value: string | number,
  ): void => {
    mapGroups(wIndex, (groups) =>
      groups.map((g, i) => (i === gIndex ? { ...g, [field]: value } : g)),
    );
  };

  const addExercise = (wIndex: number, gIndex: number): void => {
    mapGroups(wIndex, (groups) =>
      groups.map((g, i) => (i === gIndex ? { ...g, exercises: [...g.exercises, createEmptyExercise()] } : g)),
    );
  };

  const removeExercise = (wIndex: number, gIndex: number, eIndex: number): void => {
    mapGroups(wIndex, (groups) =>
      groups.map((g, i) =>
        i === gIndex && g.exercises.length > 1
          ? { ...g, exercises: g.exercises.filter((_, j) => j !== eIndex) }
          : g,
      ),
    );
  };

  const updateExercise = (
    wIndex: number,
    gIndex: number,
    eIndex: number,
    field: keyof PlanExerciseInput,
    value: string | number,
  ): void => {
    mapGroups(wIndex, (groups) =>
      groups.map((g, i) =>
        i === gIndex
          ? {
              ...g,
              exercises: g.exercises.map((ex, j) => (j === eIndex ? { ...ex, [field]: value } : ex)),
            }
          : g,
      ),
    );
  };

  // ----- Save -----
  const persistWorkoutGroups = async (workoutId: string, groups: ExerciseGroupInput[]): Promise<void> => {
    const { data: insertedGroups, error: gErr } = await supabase
      .from("exercise_groups")
      .insert(buildGroupRows(groups, workoutId))
      .select("id, order_index");
    if (gErr) throw gErr;

    const groupIdByOrder = new Map<number, string>(
      (insertedGroups || []).map((g) => [g.order_index as number, g.id as string]),
    );

    const exerciseRows: ExerciseInsertRow[] = [];
    let runningIndex = 0;
    groups.forEach((group, gIndex) => {
      const groupId = groupIdByOrder.get(gIndex);
      if (!groupId) throw new Error("Group id missing after insert.");
      exerciseRows.push(...buildExerciseRows(group, groupId, workoutId, runningIndex));
      runningIndex += group.exercises.length;
    });

    if (exerciseRows.length > 0) {
      const { error: exError } = await supabase.from("plan_exercises").insert(exerciseRows);
      if (exError) throw exError;
    }
  };

  const handleSave = async (): Promise<Result<void>> => {
    if (!planName.trim()) {
      return { data: null, error: new Error("error_name_required") };
    }

    for (const workout of workouts) {
      if (workout.groups.some(isGroupIncomplete)) {
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

        await persistWorkoutGroups(workout.id, wData.groups);
      }

      router.push("/");
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
    addWorkout,
    toggleWorkout,
    removeWorkout,
    updateWorkoutName,
    addGroup,
    removeGroup,
    updateGroupField,
    addExercise,
    removeExercise,
    updateExercise,
    handleSave,
    editId,
    router,
  };
};
