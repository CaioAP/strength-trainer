"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MuscleGroup, NewExercise } from "../AdminDashboard.types";
import { UseExerciseEditorReturn } from "./ExerciseEditor.types";

const INITIAL_FORM: NewExercise = { name: "", muscle_group: "", description: "" };

export const useExerciseEditor = (exerciseId?: string): UseExerciseEditorReturn => {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<NewExercise>(INITIAL_FORM);
  const initialized = useRef(false);

  const supabase = createClient();
  const router = useRouter();
  const isEditing = !!exerciseId;

  const init = useCallback(async (): Promise<void> => {
    try {
      const [groupsRes] = await Promise.all([
        supabase.from("muscle_groups").select("*").order("name"),
      ]);
      
      if (groupsRes.data) setMuscleGroups(groupsRes.data as MuscleGroup[]);

      if (exerciseId) {
        const { data, error: fetchError } = await supabase
          .from("exercise_master")
          .select("*")
          .eq("id", exerciseId)
          .single();

        if (fetchError) throw fetchError;
        if (data) {
          setForm({
            name: data.name,
            name_pt: data.name_pt || undefined,
            muscle_group: data.muscle_group,
            description: data.description || "",
            media_url: data.media_url || undefined,
          });
        }
      }
    } catch (err: unknown) {
      console.error("Failed to load exercise editor data:", err);
      setError("Failed to load exercise data.");
    } finally {
      setLoading(false);
    }
  }, [supabase, exerciseId]);

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
    try {
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("exercise_master")
          .update(form)
          .eq("id", exerciseId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("exercise_master")
          .insert([form]);
        if (insertError) throw insertError;
      }
      
      router.back();
      return { error: null };
    } catch (err: unknown) {
      console.error("Save failed:", err);
      return { error: err as Error };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    exercises: [], // Not needed in editor
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
