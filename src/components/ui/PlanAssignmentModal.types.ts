import { WorkoutTemplate } from "@/lib/types/common.types";

export interface PlanAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: WorkoutTemplate[];
  onAssign: (templateId: string) => void;
  isLoading: boolean;
}
