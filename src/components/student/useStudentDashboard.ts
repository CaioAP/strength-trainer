import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tab, StudentProfile, ActivePlan, WorkoutExecution, UseStudentDashboardReturn } from "./StudentDashboard.types";

export function useStudentDashboard(userId: string): UseStudentDashboardReturn {
  const [activeTab, setActiveTab] = useState<Tab>("workout");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [weeklyExecutions, setWeeklyExecutions] = useState<{ started_at: string }[]>([]);
  const [fullHistory, setFullHistory] = useState<WorkoutExecution[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = useCallback(async (): Promise<void> => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as StudentProfile);
  }, [supabase, userId]);

  const fetchStudentData = useCallback(async (): Promise<void> => {
    const { data: sProf } = await supabase
      .from("student_profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!sProf) return;

    if (activeTab === "workout") {
      const { data: plan } = await supabase
        .from("plans")
        .select("id, name, workouts (id, name, plan_exercises (id))")
        .eq("student_id", sProf.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (plan) setActivePlan(plan as unknown as ActivePlan);

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
      startOfWeek.setHours(0, 0, 0, 0);

      const { data: executions } = await supabase
        .from("workout_executions")
        .select("started_at")
        .eq("student_id", sProf.id)
        .gte("started_at", startOfWeek.toISOString());

      if (executions) setWeeklyExecutions(executions);
    } else {
      const { data: history } = await supabase
        .from("workout_executions")
        .select("id, started_at, completed_at, effort_rpe, workout:workout_id (name, plan:plan_id (name))")
        .eq("student_id", sProf.id)
        .order("started_at", { ascending: false });

      if (history) setFullHistory(history as unknown as WorkoutExecution[]);
    }
  }, [supabase, userId, activeTab]);

  useEffect(() => {
    async function init(): Promise<void> {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchStudentData()]);
      setLoading(false);
    }
    void init();
  }, [fetchProfile, fetchStudentData]);

  const hasWorkedOutOn = useCallback((dayIndex: number): boolean => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));

    return weeklyExecutions.some((ex) => {
      const exDate = new Date(ex.started_at);
      return (
        exDate.getDate() === startOfWeek.getDate() + dayIndex &&
        exDate.getMonth() === startOfWeek.getMonth()
      );
    });
  }, [weeklyExecutions]);

  return {
    activeTab,
    setActiveTab,
    profile,
    activePlan,
    fullHistory,
    loading,
    hasWorkedOutOn,
  };
}
