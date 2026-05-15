export interface Exercise {
  id: string;
  name: string;
  name_pt: string | null;
  muscle_group: string;
  description: string | null;
  media_url: string | null;
  equipment: string | null;
  difficulty: string | null;
  type: string | null;
  instructions: string | null;
  instructions_pt: string | null;
}

export interface CreateExerciseInput {
  name: string;
  name_pt?: string;
  muscle_group: string;
  description?: string;
  media_url?: string;
}

export type UpdateExerciseInput = Partial<CreateExerciseInput>;
