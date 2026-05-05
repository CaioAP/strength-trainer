import React from "react";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { formatDuration } from "@/lib/utils/time";
import { Card } from "@/components/ui/Card";
import { WorkoutExecution } from "./StudentDashboard.types";

interface HistoryViewProps {
  fullHistory: WorkoutExecution[];
}

export default function HistoryView({ 
  fullHistory 
}: HistoryViewProps): React.JSX.Element {
  const t = useTranslations("Student.History");

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="px-1">
        <h2 className="text-[10px] uppercase font-black tracking-widest text-brand-primary mb-1">
          {t("title")}
        </h2>
        <p className="text-2xl font-black text-white italic uppercase tracking-tighter">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-4 pb-8">
        {fullHistory.map((session) => (
          <Card 
            key={session.id} 
            variant="interactive"
            padding="sm"
            className="flex justify-between items-center group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white tracking-tight truncate">
                    {session.workout?.name}
                  </h3>
                  {session.workout?.plan?.name && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded font-black uppercase tracking-widest whitespace-nowrap shrink-0">
                      {session.workout.plan.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-[10px] text-text-subtle uppercase font-black tracking-widest whitespace-nowrap">
                    {new Date(session.started_at).toLocaleDateString(undefined, { 
                      weekday: "short", 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-gray-700 shrink-0" />
                  <p className="text-[10px] text-brand-accent uppercase font-black tracking-widest whitespace-nowrap">
                    {formatDuration(session.started_at, session.completed_at)}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              {session.effort_rpe ? (
                <div className="flex flex-col items-end">
                  <span className="text-brand-primary font-black text-xs">RPE {session.effort_rpe}</span>
                  <span className="text-[8px] text-text-subtle uppercase font-bold tracking-tighter">
                    {t("effort")}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-status-warning uppercase font-bold tracking-widest italic opacity-50">
                  {t("incomplete")}
                </span>
              )}
            </div>
          </Card>
        ))}

        {fullHistory.length === 0 && <EmptyState message={t("no_sessions")} />}
      </div>
    </section>
  );
}
