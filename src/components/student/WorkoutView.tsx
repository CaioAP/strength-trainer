import React from "react";
import { useTranslations } from "next-intl";
import { Activity, Dumbbell, Trophy } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { WorkoutViewProps } from "./WorkoutView.types";

export default function WorkoutView({
  activePlan,
  hasWorkedOutOn
}: WorkoutViewProps): React.JSX.Element {
  const t = useTranslations("Student.Workout");

  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      {activePlan ? (
        <div className="space-y-6">
          <div className="px-1">
            <div className="flex items-center gap-3 mb-1">
              <Activity className="text-brand-primary w-4 h-4" />
              <h2 className="text-xs uppercase font-bold tracking-widest text-text-subtle">
                {t("active_plan")}
              </h2>
            </div>
            <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
              {activePlan.name}
            </h1>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-widest text-text-subtle px-1">
              {t("available_workouts")}
            </h3>
            <div className="grid gap-4">
              {activePlan.workouts?.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/student/session?workout_id=${workout.id}`}
                  className="block group"
                >
                  <Card variant="interactive" padding="md">
                    <div className="flex justify-between items-center gap-4">
                      <div className="min-w-0">
                        <p className="text-white text-lg font-bold tracking-tight group-hover:text-brand-primary transition-colors truncate">
                          {workout.name}
                        </p>
                        <p className="text-brand-accent text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2 opacity-70 truncate">
                          <Dumbbell className="w-3 h-3 shrink-0" />
                          {t("exercises_count", { count: workout.plan_exercises?.length || 0 })}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center group-hover:bg-brand-primary/10 transition-all shrink-0">
                        <Activity className="w-4 h-4 text-brand-primary" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card variant="default" padding="lg" className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
          <Dumbbell className="w-12 h-12 text-gray-700 mb-4" />
          <p className="text-text-subtle font-black uppercase tracking-widest text-sm text-center px-8 leading-relaxed">
            {t("no_plan")}
          </p>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-widest text-text-subtle px-1">
          {t("weekly_progress")}
        </h3>
        <Card variant="default" padding="md" className="grid grid-cols-7 gap-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-text-subtle uppercase">{day}</span>
              <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-500 ${
                hasWorkedOutOn(i) ? "bg-brand-primary shadow-[0_0_10px_rgba(206,255,5,0.3)]" : "bg-brand-secondary"
              }`}>
                {hasWorkedOutOn(i) && <Trophy className="w-4 h-4 text-black" />}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
