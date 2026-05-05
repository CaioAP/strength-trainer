import { ReactNode } from "react";

export type Tab = "students" | "templates";

export interface NavTab {
  id: Tab;
  label: string;
  icon: ReactNode;
}

export interface StudentListItem {
  id: string;
  status: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  created_at: string;
}

export interface TrainerProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: string;
}

export interface UseTrainerDashboardReturn {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  students: StudentListItem[];
  templates: WorkoutTemplate[];
  profile: TrainerProfile | null;
  loading: boolean;
  actionLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleInviteStudent: (email: string) => Promise<void>;
  confirmModal: { isOpen: boolean; id: string | null };
  openModal: (id: string) => void;
  closeModal: () => void;
  handleDelete: () => Promise<void>;
  deletingId: string | null;
}
