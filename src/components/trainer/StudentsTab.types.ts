import { StudentListItem } from "./TrainerDashboard.types";

export interface StudentsTabProps {
  students: StudentListItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  actionLoading: boolean;
  onInvite: (email: string) => Promise<void>;
}
