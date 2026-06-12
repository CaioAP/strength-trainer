import React from "react";
import { Layers, Repeat, Timer } from "lucide-react";
import { ActiveExerciseCard } from "./ActiveExerciseCard";
import { RunnerGroup, ExtendedPlanExercise } from "./WorkoutRunner.types";

interface GroupCardProps {
  group: RunnerGroup;
  startIndex: number;
  completedExercises: Record<string, boolean>;
  onToggle: (exId: string) => void;
  onUpdateParam: (exId: string, field: keyof ExtendedPlanExercise, value: number) => void;
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const GroupCard = ({
  group,
  startIndex,
  completedExercises,
  onToggle,
  onUpdateParam,
  locale,
  t,
}: GroupCardProps): React.JSX.Element => {
  const isSuperset = group.exercises.length > 1;

  const cards = group.exercises.map((ex, i) => (
    <ActiveExerciseCard
      key={ex.id}
      exercise={ex}
      index={startIndex + i}
      isDone={!!completedExercises[ex.id]}
      showSetsRest={!isSuperset}
      onToggle={() => onToggle(ex.id)}
      onUpdateParam={(field, val) => onUpdateParam(ex.id, field, val)}
      locale={locale}
    />
  ));

  if (!isSuperset) return <>{cards}</>;

  return (
    <section className="rounded-2xl border border-brand-primary/30 bg-brand-primary/5 p-3 space-y-3">
      <header className="flex items-center gap-3 px-1">
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest italic text-brand-primary">
          <Layers className="w-3.5 h-3.5" />
          {group.label?.trim() ? group.label : t("superset")}
        </span>
        <span className="ml-auto flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-text-subtle">
          <span className="flex items-center gap-1">
            <Repeat className="w-3 h-3" /> {t("rounds_label", { count: group.rounds })}
          </span>
          <span className="flex items-center gap-1">
            <Timer className="w-3 h-3" /> {t("rest_after", { seconds: group.rest_seconds })}
          </span>
        </span>
      </header>
      <div className="space-y-3">{cards}</div>
    </section>
  );
};
