import { useRouter } from "next/navigation";

export interface Profile {
  email: string;
  full_name: string;
}

export interface StudentProfile {
  id: string;
  status: string;
  profiles: Profile;
}

export interface ActivePlan {
  id: string;
  name: string;
  created_at: string;
}

export interface WorkoutHistory {
  id: string;
  started_at: string;
  completed_at: string | null;
  effort_rpe: number | null;
  workout: {
    name: string;
    plan: {
      name: string;
    };
  };
}

export interface TrainerTemplate {
  id: string;
  name: string;
  description: string | null;
}

export interface UseStudentDetailReturn {
  student: StudentProfile | null;
  activePlan: ActivePlan | null;
  history: WorkoutHistory[];
  trainerTemplates: TrainerTemplate[];
  loading: boolean;
  assignModalOpen: boolean;
  setAssignModalOpen: (open: boolean) => void;
  removeModalOpen: boolean;
  setRemoveModalOpen: (open: boolean) => void;
  actionLoading: boolean;
  handleRemovePlan: () => Promise<void>;
  handleAssignTemplate: (id: string) => Promise<void>;
  avgRpe: string;
  completedSessions: number;
  router: ReturnType<typeof useRouter>;
}

export interface StudentDetailState {
  student: StudentProfile | null;
  activePlan: ActivePlan | null;
  history: WorkoutHistory[];
  trainerTemplates: TrainerTemplate[];
  loading: boolean;
  assignModalOpen: boolean;
  removeModalOpen: boolean;
  actionLoading: boolean;
}
