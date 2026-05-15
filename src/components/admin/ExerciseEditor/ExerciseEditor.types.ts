import { ExerciseMaster, MuscleGroup, NewExercise } from "../AdminDashboard.types";

export interface ExerciseEditorProps {
  exerciseId?: string;
}

export interface UseExerciseEditorReturn {
  exercises: ExerciseMaster[];
  muscleGroups: MuscleGroup[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  success: string | null;
  form: NewExercise;
  setForm: (form: NewExercise) => void;
  setPendingVideoFile: (file: File | null) => void;
  handleSave: () => Promise<{ error: Error | null }>;
  isEditing: boolean;
}
