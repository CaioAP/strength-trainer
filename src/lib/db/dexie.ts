import Dexie, { type Table } from 'dexie';

export interface ExerciseMaster {
  id: string;
  name: string;
  description?: string;
  media_url?: string;
  muscle_group?: string;
  created_at: string;
}

export interface Plan {
  id: string;
  trainer_id: string;
  student_id?: string;
  name: string;
  description?: string;
  is_template: boolean;
  created_at: string;
}

export interface Workout {
  id: string;
  plan_id: string;
  name: string;
  order_index: number;
  created_at: string;
}

export interface PlanExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  sets: number;
  reps: number;
  load: number;
  rest_seconds: number;
  order_index: number;
  created_at: string;
}

export interface WorkoutExecution {
  id: string;
  student_id: string;
  workout_id: string;
  started_at: string;
  completed_at?: string;
  effort_rpe?: number;
}

export interface SessionParamModification {
  id: string;
  execution_id: string;
  plan_exercise_id: string;
  set_number: number;
  actual_reps?: number;
  actual_load?: number;
  notes?: string;
  created_at: string;
}

export class AppDatabase extends Dexie {
  exercise_master!: Table<ExerciseMaster>;
  plans!: Table<Plan>;
  workouts!: Table<Workout>;
  plan_exercises!: Table<PlanExercise>;
  workout_executions!: Table<WorkoutExecution>;
  session_param_modifications!: Table<SessionParamModification>;

  constructor() {
    super('StrengthTrainerDB');
    this.version(1).stores({
      exercise_master: 'id, name, muscle_group',
      plans: 'id, trainer_id, student_id, is_template',
      workouts: 'id, plan_id, order_index',
      plan_exercises: 'id, workout_id, exercise_id',
      workout_executions: 'id, student_id, workout_id, started_at',
      session_param_modifications: 'id, execution_id, plan_exercise_id'
    });
  }
}

export const db = new AppDatabase();
