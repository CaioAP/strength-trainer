import React from "react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui/SearchInput";
import { StudentProfile } from "./AdminDashboard.types";
import { Card } from "@/components/ui/Card";

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
          <Card 
            key={s.id} 
            variant="interactive"
            padding="sm"
            className="flex justify-between items-center group"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-white group-hover:text-brand-primary transition-colors truncate">
                {s.profiles.email}
              </h3>
              <p className="text-[10px] text-text-subtle mt-1 uppercase tracking-wider truncate">
                {t("trainer")}: {s.trainer?.profiles?.email || t("unassigned")}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
