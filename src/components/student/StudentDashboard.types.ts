import { ReactNode } from "react";

export type Tab = "workout" | "history";

export interface NavTab {
  id: Tab;
  label: string;
  icon: ReactNode;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: string;
}

export interface Workout {
  id: string;
  name: string;
  plan_exercises: { id: string }[];
}

export interface ActivePlan {
  id: string;
  name: string;
  workouts: Workout[];
}

export interface WorkoutExecution {
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

export interface UseStudentDashboardReturn {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  profile: StudentProfile | null;
  activePlan: ActivePlan | null;
  fullHistory: WorkoutExecution[];
  loading: boolean;
  hasWorkedOutOn: (dayIndex: number) => boolean;
}
