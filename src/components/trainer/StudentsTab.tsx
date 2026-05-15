import React from "react";
import { useTranslations } from "next-intl";
import { Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import InviteCard from "@/components/ui/InviteCard";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { StudentsTabProps } from "./StudentsTab.types";

export default function StudentsTab({
  students,
  searchQuery,
  setSearchQuery,
  actionLoading,
  onInvite,
}: StudentsTabProps): React.JSX.Element {
  const t = useTranslations("Trainer.Students");

  const filteredStudents = students.filter(
    (s) =>
      s.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      <InviteCard
        title={t("invite_title")}
        placeholder={t("invite_placeholder")}
        loading={actionLoading}
        onSubmit={onInvite}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-primary" />
            <Text size="xs" weight="bold" uppercase tracking="widest" variant="subtle">
              {t("my_students", { count: filteredStudents.length })}
            </Text>
          </div>
        </div>
        
        <SearchInput 
          placeholder={t("search_placeholder")} 
          value={searchQuery} 
          onChange={setSearchQuery} 
        />

        <div className="grid gap-3">
          {filteredStudents.map((student) => (
            <Link
              key={student.id}
              href={`/trainer/student/${student.id}`}
              className="block group w-full min-w-0"
            >
              <Card 
                variant="interactive" 
                padding="sm" 
                className="flex items-center justify-between w-full min-w-0"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center group-hover:bg-brand-primary/10 transition-all font-bold text-brand-primary text-xs italic shrink-0">
                    {student.profiles?.full_name?.split(" ").map((n) => n[0]).join("") || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text weight="bold" className="group-hover:text-brand-primary transition-colors truncate">
                      {student.profiles?.full_name || t("pending_name")}
                    </Text>
                    <Text size="xs" variant="subtle" className="lowercase truncate">
                      {student.profiles?.email}
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border ${
                    student.status === "active"
                      ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                      : "bg-status-warning/10 text-status-warning border-status-warning/20"
                  }`}>
                    {student.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </Link>
          ))}
          {filteredStudents.length === 0 && <EmptyState message={t("no_students")} />}
        </div>
      </div>
    </section>
  );
}

