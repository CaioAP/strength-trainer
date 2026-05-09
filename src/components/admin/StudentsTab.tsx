import React from "react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui/SearchInput";
import { StudentProfile } from "./AdminDashboard.types";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

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
    s.profiles.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.profiles.full_name?.toLowerCase().includes(searchQuery.toLowerCase()))
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
                {s.profiles.full_name || s.profiles.email}
              </h3>
              <div className="flex flex-col mt-1">
                {s.profiles.full_name && (
                  <Text size="xs" variant="subtle" className="lowercase truncate">
                    {s.profiles.email}
                  </Text>
                )}
                <Text size="xs" variant="subtle" weight="bold" uppercase tracking="wide" className="mt-1 truncate">
                  {t("trainer")}: {s.trainer?.profiles?.full_name || s.trainer?.profiles?.email || t("unassigned")}
                </Text>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
