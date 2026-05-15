"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { MuscleGroup, NewExercise } from "../AdminDashboard.types";
import { UseExerciseEditorReturn } from "./ExerciseEditor.types";
import {
  getExercise,
  getMuscleGroups,
  saveExercise,
} from "@/app/actions/exercises";

const INITIAL_FORM: NewExercise = { name: "", muscle_group: "", description: "" };

export const useExerciseEditor = (exerciseId?: string): UseExerciseEditorReturn => {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<NewExercise>(INITIAL_FORM);
  const initialized = useRef(false);

  const router = useRouter();
  const isEditing = !!exerciseId;

  const init = useCallback(async (): Promise<void> => {
    const groupsResult = await getMuscleGroups();
    if (groupsResult.data) setMuscleGroups(groupsResult.data);

    if (exerciseId) {
      const exerciseResult = await getExercise(exerciseId);
      if (exerciseResult.error) {
        setError("Failed to load exercise data.");
      } else if (exerciseResult.data) {
        const ex = exerciseResult.data;
        setForm({
          name: ex.name,
          name_pt: ex.name_pt ?? undefined,
          muscle_group: ex.muscle_group,
          description: ex.description ?? "",
          media_url: ex.media_url ?? undefined,
        });
      }
    }

    setLoading(false);
  }, [exerciseId]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      void init();
    }
  }, [init]);

  const handleSave = async (): Promise<{ error: Error | null }> => {
    if (!form.name || !form.muscle_group) {
      return { error: new Error("Name and Muscle Group are required") };
    }

    setActionLoading(true);
    const result = await saveExercise({ id: exerciseId, data: form });
    setActionLoading(false);

    if (result.error) return { error: result.error };

    router.back();
    return { error: null };
  };

  return {
    exercises: [],
    muscleGroups,
    loading,
    actionLoading,
    error,
    setError,
    form,
    setForm,
    handleSave,
    isEditing,
  };
};
