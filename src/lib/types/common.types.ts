export type Result<T, E = Error> = 
  | { data: T; error: null } 
  | { data: null; error: E };

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string | null;
}
