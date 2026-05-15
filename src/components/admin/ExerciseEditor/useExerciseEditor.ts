"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
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
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<NewExercise>(INITIAL_FORM);
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
  const initialized = useRef(false);

  const router = useRouter();
  const t = useTranslations("Admin.Exercises");
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
      setError("Name and Muscle Group are required");
      return { error: new Error("Name and Muscle Group are required") };
    }

    setError(null);
    setSuccess(null);
    setActionLoading(true);

    let mediaUrl = form.media_url;

    if (pendingVideoFile) {
      const fileExt = pendingVideoFile.name.split(".").pop() ?? "mp4";
      const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
      const filePath = `tutorials/${fileName}`;

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("exercise-tutorials")
        .upload(filePath, pendingVideoFile);

      if (uploadError) {
        setError(t("upload_failed"));
        setActionLoading(false);
        return { error: uploadError };
      }

      const { data: { publicUrl } } = supabase.storage
        .from("exercise-tutorials")
        .getPublicUrl(filePath);

      mediaUrl = publicUrl;
    }

    const result = await saveExercise({ id: exerciseId, data: { ...form, media_url: mediaUrl } });
    setActionLoading(false);

    if (result.error) {
      setError(t("save_failed"));
      return { error: result.error };
    }

    setSuccess(t("save_success"));
    setTimeout(() => router.back(), 1500);
    return { error: null };
  };

  return {
    exercises: [],
    muscleGroups,
    loading,
    actionLoading,
    error,
    setError,
    success,
    form,
    setForm,
    setPendingVideoFile,
    handleSave,
    isEditing,
  };
};
