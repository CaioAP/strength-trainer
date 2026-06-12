import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { GroupInput, GroupExerciseInput } from "@/lib/utils/groups";

export interface ExerciseMaster {
  id: string;
  name: string;
  name_pt?: string | null;
  media_url?: string | null;
}

export type PlanExerciseInput = GroupExerciseInput;
export type ExerciseGroupInput = GroupInput;

export interface WorkoutInput {
  name: string;
  groups: ExerciseGroupInput[];
}

export type Translate = (key: string, params?: Record<string, string | number>) => string;

export interface PlanEditorState {
  exercisesMaster: ExerciseMaster[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  planName: string;
  expandedWorkouts: Record<number, boolean>;
  workouts: WorkoutInput[];
}

export interface ExerciseRowProps {
  exercise: PlanExerciseInput;
  onRemove: () => void;
  canRemove: boolean;
  onUpdate: (field: keyof PlanExerciseInput, value: string | number) => void;
  exercisesMaster: ExerciseMaster[];
  t: Translate;
  locale: string;
}

export interface GroupSectionProps {
  group: ExerciseGroupInput;
  gIndex: number;
  onRemoveGroup: () => void;
  showRemoveGroup: boolean;
  onUpdateField: (field: "label" | "rounds" | "rest", value: string | number) => void;
  onAddExercise: () => void;
  onRemoveExercise: (eIndex: number) => void;
  onUpdateExercise: (eIndex: number, field: keyof PlanExerciseInput, value: string | number) => void;
  exercisesMaster: ExerciseMaster[];
  t: Translate;
  locale: string;
}

export interface WorkoutSectionProps {
  workout: WorkoutInput;
  wIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdateName: (name: string) => void;
  onAddGroup: () => void;
  onRemoveGroup: (gIndex: number) => void;
  onUpdateGroupField: (gIndex: number, field: "label" | "rounds" | "rest", value: string | number) => void;
  onAddExercise: (gIndex: number) => void;
  onRemoveExercise: (gIndex: number, eIndex: number) => void;
  onUpdateExercise: (gIndex: number, eIndex: number, field: keyof PlanExerciseInput, value: string | number) => void;
  exercisesMaster: ExerciseMaster[];
  showRemoveWorkout: boolean;
  t: Translate;
  locale: string;
}

export interface UsePlanEditorReturn extends PlanEditorState {
  setPlanName: (name: string) => void;
  setError: (error: string | null) => void;
  addWorkout: () => void;
  toggleWorkout: (index: number) => void;
  removeWorkout: (index: number) => void;
  updateWorkoutName: (wIndex: number, name: string) => void;
  addGroup: (wIndex: number) => void;
  removeGroup: (wIndex: number, gIndex: number) => void;
  updateGroupField: (wIndex: number, gIndex: number, field: "label" | "rounds" | "rest", value: string | number) => void;
  addExercise: (wIndex: number, gIndex: number) => void;
  removeExercise: (wIndex: number, gIndex: number, eIndex: number) => void;
  updateExercise: (wIndex: number, gIndex: number, eIndex: number, field: keyof PlanExerciseInput, value: string | number) => void;
  handleSave: () => Promise<{ data: void | null; error: Error | null }>;
  editId: string | null;
  router: AppRouterInstance;
}
