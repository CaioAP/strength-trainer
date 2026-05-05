import React from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import NumberInput from "@/components/ui/NumberInput";
import { ExtendedPlanExercise } from "./WorkoutRunner.types";

interface ActiveExerciseCardProps {
  exercise: ExtendedPlanExercise;
  index: number;
  isDone: boolean;
  onToggle: () => void;
  onUpdateParam: (field: keyof ExtendedPlanExercise, value: number) => void;
}

export const ActiveExerciseCard = ({
  exercise,
  index,
  isDone,
  onToggle,
  onUpdateParam,
}: ActiveExerciseCardProps): React.JSX.Element => {
  return (
    <Card
      variant="interactive"
      padding="none"
      className={`overflow-hidden transition-all duration-300 ${
        isDone ? "ring-1 ring-brand-primary/50 shadow-[inset_0_0_20px_rgba(206,255,5,0.05)]" : ""
      }`}
    >
      <div className={`p-4 flex justify-between items-start ${isDone ? "bg-brand-primary/5" : ""}`}>
        <div className="flex gap-3">
          <span className="text-[10px] font-black text-text-subtle mt-1">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className={`font-black text-lg leading-tight uppercase italic tracking-tighter transition-colors ${
              isDone ? "text-brand-primary" : "text-white"
            }`}>
              {exercise.exercise?.name}
            </h3>
            {exercise.exercise?.description && !isDone && (
              <p className="text-[10px] text-text-subtle mt-1 italic opacity-60 line-clamp-1">
                {exercise.exercise.description}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="plain"
          size="none"
          onClick={onToggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isDone
              ? "bg-brand-primary text-black scale-105 shadow-[0_0_15px_rgba(206,255,5,0.4)]"
              : "bg-brand-secondary text-text-subtle shadow-inner hover:text-white hover:bg-white/5"
          }`}
        >
          <Check className={`w-5 h-5 ${isDone ? "stroke-[3px]" : ""}`} />
        </Button>
      </div>

      <div className={`p-4 grid grid-cols-2 gap-4 transition-opacity duration-300 bg-black/10 ${
        isDone ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}>
        <NumberInput 
          label="Sets" 
          value={exercise.actual_sets} 
          onChange={(v) => onUpdateParam("actual_sets", v)} 
          min={1} 
        />
        <NumberInput 
          label="Reps" 
          value={exercise.actual_reps} 
          onChange={(v) => onUpdateParam("actual_reps", v)} 
          min={1} 
        />
        <NumberInput 
          label="Load (kg)" 
          value={exercise.actual_load} 
          onChange={(v) => onUpdateParam("actual_load", v)} 
          step={0.5} 
        />
        <NumberInput 
          label="Rest (s)" 
          value={exercise.actual_rest} 
          onChange={(v) => onUpdateParam("actual_rest", v)} 
          step={5} 
          min={0} 
        />
      </div>
    </Card>
  );
};
