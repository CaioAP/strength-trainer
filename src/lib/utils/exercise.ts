/**
 * Utility to get localized fields for an exercise based on the current locale.
 */
export function getLocalizedExercise<T extends { 
  name: string; 
  name_pt?: string | null; 
  instructions?: string | null; 
  instructions_pt?: string | null; 
  description?: string | null;
}>(
  exercise: T, 
  locale: string
): T & { displayName: string; displayInstructions: string | null | undefined; displayDescription: string | null | undefined } {
  const isPt = locale === "pt";
  
  return {
    ...exercise,
    displayName: isPt ? (exercise.name_pt || exercise.name) : exercise.name,
    displayInstructions: isPt ? (exercise.instructions_pt || exercise.instructions) : exercise.instructions,
    displayDescription: isPt ? (exercise.name_pt || exercise.description) : (exercise.description || exercise.name),
  };
}
