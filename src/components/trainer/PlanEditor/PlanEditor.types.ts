import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface ExerciseMaster {
  id: string;
  name: string;
}

export interface PlanExerciseInput {
  exercise_id: string;
  sets: number;
  reps: number;
  load: number;
  rest: number;
}

export interface WorkoutInput {
  name: string;
  exercises: PlanExerciseInput[];
}

export interface PlanEditorState {
  exercisesMaster: ExerciseMaster[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  planName: string;
  expandedWorkouts: Record<number, boolean>;
  workouts: WorkoutInput[];
}

export interface UsePlanEditorReturn extends PlanEditorState {
  setPlanName: (name: string) => void;
  setWorkouts: (workouts: WorkoutInput[]) => void;
  setError: (error: string | null) => void;
  addWorkout: () => void;
  toggleWorkout: (index: number) => void;
  addExercise: (wIndex: number) => void;
  removeExercise: (wIndex: number, eIndex: number) => void;
  removeWorkout: (index: number) => void;
  handleSave: () => Promise<{ data: void | null; error: Error | null }>;
  editId: string | null;
  router: AppRouterInstance;
}
