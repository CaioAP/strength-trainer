"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  StudentProfile, 
  ActivePlan, 
  WorkoutHistory, 
  TrainerTemplate,
  UseStudentDetailReturn 
} from "./StudentDetail.types";

export const useStudentDetail = (studentId: string): UseStudentDetailReturn => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [trainerTemplates, setTrainerTemplates] = useState<TrainerTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const initialized = useRef(false);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const { data: sData } = await supabase
        .from("student_profiles")
        .select("id, status, profiles:user_id (email, full_name)")
        .eq("id", studentId)
        .single();
      if (sData) setStudent(sData as unknown as StudentProfile);

      const { data: plan } = await supabase
        .from("plans")
        .select("id, name, created_at")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setActivePlan(plan as ActivePlan);

      const { data: executions } = await supabase
        .from("workout_executions")
        .select("id, started_at, completed_at, effort_rpe, workout:workout_id (name, plan:plan_id (name))")
        .eq("student_id", studentId)
        .order("started_at", { ascending: false });
      if (executions) setHistory(executions as unknown as WorkoutHistory[]);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: templates } = await supabase
          .from("plans")
          .select("id, name, description")
          .eq("is_template", true)
          .order("name");
        if (templates) setTrainerTemplates(templates as TrainerTemplate[]);
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
    }
  }, [supabase, studentId]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!initialized.current) {
        initialized.current = true;
      }
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    load();
  }, [fetchData]);

  const handleRemovePlan = async (): Promise<void> => {
    if (!activePlan) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from("plans").delete().eq("id", activePlan.id);
      if (error) throw error;
      await fetchData();
      setRemoveModalOpen(false);
    } catch (err) {
      console.error("Error removing plan:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTemplate = async (templateId: string): Promise<void> => {
    setActionLoading(true);
    try {
      const { data: template, error: tErr } = await supabase
        .from("plans")
        .select("name, workouts (name, order_index, plan_exercises (exercise_id, sets, reps, load, rest_seconds, order_index))")
        .eq("id", templateId)
        .single();
      if (tErr) throw tErr;

      const { data: { user } } = await supabase.auth.getUser();
      const { data: trainerProf } = await supabase.from("trainer_profiles").select("id").eq("user_id", user?.id).single();

      const { data: newPlan, error: pErr } = await supabase
        .from("plans")
        .insert([{ name: template.name, trainer_id: trainerProf?.id, student_id: studentId, is_template: false }])
        .select()
        .single();
      if (pErr) throw pErr;

      for (const w of template.workouts) {
        const { data: newWorkout, error: wErr } = await supabase
          .from("workouts")
          .insert([{ plan_id: newPlan.id, name: w.name, order_index: w.order_index }])
          .select()
          .single();
        if (wErr) throw wErr;

        await supabase.from("plan_exercises").insert(
          w.plan_exercises.map((ex: { exercise_id: string; sets: number; reps: number; load: number; rest_seconds: number; order_index: number }) => ({ ...ex, workout_id: newWorkout.id }))
        );
      }

      await fetchData();
      setAssignModalOpen(false);
    } catch (err) {
      console.error("Error cloning template:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const avgRpe = history.length > 0
    ? (history.reduce((acc, curr) => acc + (curr.effort_rpe || 0), 0) / history.filter((h) => h.effort_rpe).length).toFixed(1)
    : "--";

  const completedSessions = history.filter((h) => h.completed_at).length;

  return {
    student,
    activePlan,
    history,
    trainerTemplates,
    loading,
    assignModalOpen,
    setAssignModalOpen,
    removeModalOpen,
    setRemoveModalOpen,
    actionLoading,
    handleRemovePlan,
    handleAssignTemplate,
    avgRpe,
    completedSessions,
    router,
  };
};
