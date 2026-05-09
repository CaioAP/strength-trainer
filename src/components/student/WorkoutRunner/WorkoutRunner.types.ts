import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface ExerciseMaster {
  name: string;
  name_pt?: string | null;
  description: string | null;
  media_url?: string | null;
  instructions?: string | null;
  instructions_pt?: string | null;
}

export interface PlanExercise {
  id: string;
  sets: number;
  reps: number;
  load: number;
  rest_seconds: number;
  order_index: number;
  exercise: ExerciseMaster;
}

export interface Workout {
  name: string;
  plan_exercises: PlanExercise[];
}

export interface ExtendedPlanExercise extends PlanExercise {
  actual_sets: number;
  actual_reps: number;
  actual_load: number;
  actual_rest: number;
}

export interface SessionState {
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  workout: Workout | null;
  exercises: ExtendedPlanExercise[];
  completedExercises: Record<string, boolean>;
  showFinishModal: boolean;
  showExitModal: boolean;
  effortRpe: number;
  seconds: number;
  startTime: string;
}

export interface UseWorkoutRunnerReturn {
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  workout: Workout | null;
  exercises: ExtendedPlanExercise[];
  completedExercises: Record<string, boolean>;
  showFinishModal: boolean;
  setShowFinishModal: (show: boolean) => void;
  showExitModal: boolean;
  setShowExitModal: (show: boolean) => void;
  effortRpe: number;
  setEffortRpe: (val: number) => void;
  seconds: number;
  completedCount: number;
  handleSafeBack: () => void;
  toggleExercise: (id: string) => void;
  updateExerciseParam: (id: string, param: keyof ExtendedPlanExercise, val: number) => void;
  handleFinish: () => Promise<{ data: void | null; error: Error | null }>;
  router: AppRouterInstance;
}
