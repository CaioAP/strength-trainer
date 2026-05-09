import React from "react";
import { Trash2, Video } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import NumberInput from "@/components/ui/NumberInput";
import { Button } from "@/components/ui/Button";
import { VideoModal } from "@/components/ui/VideoModal";
import { PlanExerciseInput, ExerciseMaster } from "./PlanEditor.types";

interface ExerciseRowProps {
  exercise: PlanExerciseInput;
  eIndex: number;
  onRemove: () => void;
  onUpdate: (field: keyof PlanExerciseInput, value: string | number) => void;
  exercisesMaster: ExerciseMaster[];
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const ExerciseRow = ({
  exercise,
  eIndex: _eIndex,
  onRemove,
  onUpdate,
  exercisesMaster,
  t,
}: ExerciseRowProps): React.JSX.Element => {
  const [videoModalOpen, setVideoModalOpen] = React.useState(false);
  const selectedExercise = exercisesMaster.find((m) => m.id === exercise.exercise_id);

  return (
    <div className="bg-brand-secondary/30 rounded-xl p-4 shadow-inner relative group/ex transition-all border border-white/5">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5 ml-1">
            <label className="text-xs text-text-subtle uppercase font-bold tracking-widest block">
              {t("exercise_label")}
            </label>
            {selectedExercise?.media_url && (
              <button
                onClick={() => setVideoModalOpen(true)}
                className="text-brand-primary flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Tutorial</span>
              </button>
            )}
          </div>
          <CustomSelect
            options={exercisesMaster}
            value={selectedExercise?.name || ""}
            onChange={(val) => {
              const masterEx = exercisesMaster.find((m) => m.name === val);
              if (masterEx) onUpdate("exercise_id", masterEx.id);
            }}
            placeholder={t("exercise_placeholder")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberInput 
            label="Sets" 
            value={exercise.sets} 
            onChange={(val) => onUpdate("sets", val)} 
          />
          <NumberInput 
            label="Reps" 
            value={exercise.reps} 
            onChange={(val) => onUpdate("reps", val)} 
          />
          <NumberInput 
            label="Load (kg)" 
            value={exercise.load} 
            onChange={(val) => onUpdate("load", val)} 
            step={0.5} 
          />
          <NumberInput 
            label="Rest (s)" 
            value={exercise.rest} 
            onChange={(val) => onUpdate("rest", val)} 
            step={5} 
          />
        </div>
      </div>

      <Button
        variant="plain"
        size="none"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-brand-surface p-1.5 rounded-full text-status-error shadow-card hover:bg-status-error hover:text-white scale-0 group-hover/ex:scale-100 z-10 transition-transform"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>

      {selectedExercise?.media_url && (
        <VideoModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          videoUrl={selectedExercise.media_url}
          title={selectedExercise.name}
        />
      )}
    </div>
  );
};
