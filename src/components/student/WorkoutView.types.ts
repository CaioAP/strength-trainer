import { ActivePlan } from "./StudentDashboard.types";

export interface WorkoutViewProps {
  activePlan: ActivePlan | null;
  hasWorkedOutOn: (dayIndex: number) => boolean;
}
