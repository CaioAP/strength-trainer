import { WorkoutTemplate } from "./TrainerDashboard.types";

export interface TemplatesTabProps {
  templates: WorkoutTemplate[];
  onDelete: (id: string) => void;
}
