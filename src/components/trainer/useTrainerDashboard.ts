import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { inviteStudent } from "@/app/actions/invite";
import { 
  Tab, 
  StudentListItem, 
  WorkoutTemplate, 
  TrainerProfile,
  UseTrainerDashboardReturn
} from "./TrainerDashboard.types";

export function useTrainerDashboard(userId: string): UseTrainerDashboardReturn {
  const [activeTab, setActiveTab] = useState<Tab>("students");
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClient();
  const initialized = useRef(false);

  const fetchProfile = useCallback(async (): Promise<void> => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as TrainerProfile);
  }, [supabase, userId]);

  const fetchStudents = useCallback(async (): Promise<void> => {
    const { data, error } = await supabase
      .from("student_profiles")
      .select("id, status, profiles:user_id (email, full_name)")
      .order("created_at", { ascending: false });
    if (!error) setStudents(data as unknown as StudentListItem[]);
  }, [supabase]);

  const fetchTemplates = useCallback(async (): Promise<void> => {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_template", true)
      .order("created_at", { ascending: false });
    if (!error) setTemplates(data as WorkoutTemplate[]);
  }, [supabase]);

  const fetchData = useCallback(async (): Promise<void> => {
    if (activeTab === "students") await fetchStudents();
    else if (activeTab === "templates") await fetchTemplates();
  }, [activeTab, fetchStudents, fetchTemplates]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchProfile());
  }, [fetchProfile]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!initialized.current) {
        initialized.current = true;
      }
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    void Promise.resolve().then(() => load());
  }, [fetchData]);

  const handleInviteStudent = async (email: string): Promise<void> => {
    setActionLoading(true);
    try {
      const result = await inviteStudent(email);
      if (result.error) throw result.error;
      await fetchStudents();
    } catch (err) {
      console.error("Failed to invite student:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const { confirmModal, openModal, closeModal, handleDelete, deletingId } = useDeleteConfirm(
    async (id: string): Promise<void> => {
      setActionLoading(true);
      const { error } = await supabase.from("plans").delete().eq("id", id);
      if (!error) await fetchTemplates();
      setActionLoading(false);
    }
  );

  return {
    activeTab,
    setActiveTab,
    students,
    templates,
    profile,
    loading,
    actionLoading,
    searchQuery,
    setSearchQuery,
    handleInviteStudent,
    confirmModal,
    openModal,
    closeModal,
    handleDelete,
    deletingId,
  };
}
