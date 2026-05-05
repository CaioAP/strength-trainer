import React from "react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui/SearchInput";
import { StudentProfile } from "./AdminDashboard.types";

interface StudentsTabProps {
  students: StudentProfile[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function StudentsTab({
  students,
  searchQuery,
  setSearchQuery,
}: StudentsTabProps): React.JSX.Element {
  const t = useTranslations("Admin.Students");

  const filteredStudents = students.filter((s) => 
    s.profiles.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SearchInput
        placeholder={t("search_placeholder")}
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="space-y-3">
        {filteredStudents.map((s) => (
          <div 
            key={s.id} 
            className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] flex justify-between items-center group transition-all duration-300 overflow-hidden"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-white group-hover:text-brand-primary transition-colors truncate">
                {s.profiles.email}
              </h3>
              <p className="text-[10px] text-text-subtle mt-1 uppercase tracking-wider truncate">
                {t("trainer")}: {s.trainer?.profiles?.email || t("unassigned")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
