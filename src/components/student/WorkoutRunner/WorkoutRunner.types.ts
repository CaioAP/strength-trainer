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

export interface ExtendedPlanExercise extends PlanExercise {
  actual_sets: number;
  actual_reps: number;
  actual_load: number;
  actual_rest: number;
}

export interface RunnerGroup {
  id: string;
  label: string | null;
  rounds: number;
  rest_seconds: number;
  order_index: number;
  exercises: ExtendedPlanExercise[];
}

export interface Workout {
  name: string;
  groups: RunnerGroup[];
}

export interface SessionState {
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  workout: Workout | null;
  groups: RunnerGroup[];
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
  groups: RunnerGroup[];
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
  handleExitConfirmed: () => void;
  toggleExercise: (id: string) => void;
  updateExerciseParam: (id: string, param: keyof ExtendedPlanExercise, val: number) => void;
  handleFinish: () => Promise<{ data: void | null; error: Error | null }>;
}
