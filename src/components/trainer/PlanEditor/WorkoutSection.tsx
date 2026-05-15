import React from "react";
import { Plus, Trash2, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ExerciseRow } from "./ExerciseRow";
import { WorkoutSectionProps } from "./PlanEditor.types";

export const WorkoutSection = ({
  workout,
  wIndex: _wIndex,
  isExpanded,
  onToggle,
  onRemove,
  onUpdateName,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
  exercisesMaster,
  showRemoveWorkout,
  t,
  locale,
}: WorkoutSectionProps): React.JSX.Element => {
  return (
    <Card variant="interactive" padding="none" className="overflow-visible group">
      <div
        onClick={onToggle}
        className={`p-4 flex justify-between items-center transition-colors ${
          isExpanded ? "rounded-t-lg" : "rounded-lg"
        } hover:bg-white/5`}
      >
        <div className="flex-1 flex items-center gap-2">
          <Input
            variant="minimal"
            className="font-black text-white focus:text-brand-primary placeholder:text-gray-500 w-full uppercase italic tracking-tighter"
            value={workout.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onUpdateName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 ml-4">
          {showRemoveWorkout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="text-text-subtle hover:text-status-error hover:bg-status-error/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <div className="p-2 text-brand-primary">
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : "-rotate-90"}`} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
          {workout.exercises.map((ex, eIndex) => (
            <ExerciseRow
              key={eIndex}
              exercise={ex}
              eIndex={eIndex}
              onRemove={() => onRemoveExercise(eIndex)}
              onUpdate={(field, value) => onUpdateExercise(eIndex, field, value)}
              exercisesMaster={exercisesMaster}
              t={t}
              locale={locale}
            />
          ))}

          <Button
            variant="secondary"
            fullWidth
            onClick={onAddExercise}
            className="bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10"
          >
            <Plus className="w-4 h-4 mr-2" /> {t("add_exercise")}
          </Button>
        </div>
      )}
    </Card>
  );
};
