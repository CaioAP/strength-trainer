import { useTranslations } from "next-intl";

interface UseMuscleGroupTranslationReturn {
  translateMuscleGroup: (muscleGroup?: string | null) => string;
}

/**
 * Hook to translate muscle group names from the database to the current UI language.
 */
export function useMuscleGroupTranslation(): UseMuscleGroupTranslationReturn {
  const t = useTranslations("MuscleGroups");

  /**
   * Translates a raw muscle group name (e.g., "Abdominals", "Chest") to the active locale.
   * Falls back to the raw name if no translation is found.
   */
  const translateMuscleGroup = (muscleGroup?: string | null): string => {
    if (!muscleGroup) return "";
    
    try {
      // Use a template literal to avoid direct 'any' cast if possible, 
      // but next-intl expects a keyof messages
      return t(muscleGroup as "Chest");
    } catch {
      return muscleGroup;
    }
  };

  return { translateMuscleGroup };
}
