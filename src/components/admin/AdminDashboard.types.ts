import React, { ReactNode } from "react";

export type Tab = "overview" | "trainers" | "students" | "exercises";

export interface NavTab {
  id: Tab;
  label: string;
  icon: ReactNode;
}

export interface AdminMetrics {
  total_exercises: number;
  total_trainers: number;
  pending_trainers: number;
  total_students: number;
}

export interface TrainerProfile {
  id: string;
  user_id: string;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

export interface StudentProfile {
  id: string;
  user_id: string;
  trainer_id: string | null;
  created_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
  trainer?: {
    profiles: {
      email: string;
      full_name: string | null;
    };
  };
}

export interface ExerciseMaster {
  id: string;
  name: string;
  muscle_group: string;
  description: string | null;
}

export interface MuscleGroup {
  id: string;
  name: string;
}

export interface NewExercise {
  name: string;
  muscle_group: string;
  description: string;
}

export interface UseAdminDashboardReturn {
  activeTab: Tab;
  setActiveTab: (_tab: Tab) => void;
  loading: boolean;
  actionLoading: boolean;
  metrics: AdminMetrics | null;
  trainers: TrainerProfile[];
  students: StudentProfile[];
  exercises: ExerciseMaster[];
  muscleGroups: MuscleGroup[];
  searchQuery: string;
  setSearchQuery: (_q: string) => void;
  exerciseFilter: string;
  setExerciseFilter: (_f: string) => void;
  newEx: NewExercise;
  setNewEx: (_ex: NewExercise) => void;
  handleApproveTrainer: (_userId: string) => Promise<void>;
  handleRevokeTrainer: (_userId: string) => Promise<void>;
  handleInviteTrainer: (_email: string) => Promise<void>;
  handleAddExercise: (_e: React.FormEvent) => Promise<void>;
  confirmModal: { isOpen: boolean; id: string | null };
  openModal: (_id: string) => void;
  closeModal: () => void;
  handleDelete: () => Promise<void>;
  deletingId: string | null;
}
