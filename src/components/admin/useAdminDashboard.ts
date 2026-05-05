import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { inviteTrainer } from "@/app/actions/invite";
import { 
  Tab, 
  AdminMetrics, 
  TrainerProfile, 
  StudentProfile, 
  ExerciseMaster, 
  MuscleGroup,
  NewExercise,
  UseAdminDashboardReturn
} from "./AdminDashboard.types";

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [exercises, setExercises] = useState<ExerciseMaster[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [exerciseFilter, setExerciseFilter] = useState("");
  const [newEx, setNewEx] = useState<NewExercise>({ name: "", muscle_group: "", description: "" });

  const supabase = createClient();
  const initialized = useRef(false);

  const fetchMetrics = useCallback(async (): Promise<void> => {
    const { data, error } = await supabase.rpc("get_admin_metrics");
    if (!error) setMetrics(data as AdminMetrics);
  }, [supabase]);

  const fetchTrainers = useCallback(async (): Promise<void> => {
    const { data, error } = await supabase
      .from("trainer_profiles")
      .select("*, profiles:user_id (email, full_name)")
      .order("created_at", { ascending: false });
    if (!error) setTrainers(data as unknown as TrainerProfile[]);
  }, [supabase]);

  const fetchStudents = useCallback(async (): Promise<void> => {
    const { data, error } = await supabase
      .from("student_profiles")
      .select("*, profiles:user_id (email, full_name), trainer:trainer_id (profiles:user_id (email, full_name))")
      .order("created_at", { ascending: false });
    if (!error) setStudents(data as unknown as StudentProfile[]);
  }, [supabase]);

  const fetchExercises = useCallback(async (): Promise<void> => {
    const [exercisesRes, groupsRes] = await Promise.all([
      supabase.from("exercise_master").select("*").order("name"),
      supabase.from("muscle_groups").select("*").order("name"),
    ]);
    if (!exercisesRes.error) setExercises(exercisesRes.data as ExerciseMaster[]);
    if (!groupsRes.error) setMuscleGroups(groupsRes.data as MuscleGroup[]);
  }, [supabase]);

  const fetchData = useCallback(async (): Promise<void> => {
    if (activeTab === "overview") await fetchMetrics();
    else if (activeTab === "trainers") await fetchTrainers();
    else if (activeTab === "students") await fetchStudents();
    else if (activeTab === "exercises") await fetchExercises();
  }, [activeTab, fetchMetrics, fetchTrainers, fetchStudents, fetchExercises]);

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

  const handleApproveTrainer = async (targetUserId: string): Promise<void> => {
    setActionLoading(true);
    const { error } = await supabase.rpc("approve_trainer", { target_user_id: targetUserId });
    if (!error) await fetchTrainers();
    setActionLoading(false);
  };

  const handleRevokeTrainer = async (targetUserId: string): Promise<void> => {
    setActionLoading(true);
    const { error } = await supabase.rpc("revoke_trainer", { target_user_id: targetUserId });
    if (!error) await fetchTrainers();
    setActionLoading(false);
  };

  const handleInviteTrainer = async (email: string): Promise<void> => {
    setActionLoading(true);
    try {
      const result = await inviteTrainer(email);
      if (result.error) throw result.error;
      await fetchTrainers();
    } catch (err) {
      console.error("Failed to invite trainer:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddExercise = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setActionLoading(true);
    const { error } = await supabase.from("exercise_master").insert([newEx]);
    if (!error) {
      setNewEx({ name: "", muscle_group: "", description: "" });
      await fetchExercises();
    }
    setActionLoading(false);
  };

  const { confirmModal, openModal, closeModal, handleDelete, deletingId } = useDeleteConfirm(
    async (id: string): Promise<void> => {
      setActionLoading(true);
      const { error } = await supabase.from("exercise_master").delete().eq("id", id);
      if (!error) await fetchExercises();
      setActionLoading(false);
    }
  );

  return {
    activeTab,
    setActiveTab,
    loading,
    actionLoading,
    metrics,
    trainers,
    students,
    exercises,
    muscleGroups,
    searchQuery,
    setSearchQuery,
    exerciseFilter,
    setExerciseFilter,
    newEx,
    setNewEx,
    handleApproveTrainer,
    handleRevokeTrainer,
    handleInviteTrainer,
    handleAddExercise,
    confirmModal,
    openModal,
    closeModal,
    handleDelete,
    deletingId,
  };
}
