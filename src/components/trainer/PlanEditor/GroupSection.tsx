import React from "react";
import { Plus, Trash2, Layers } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import NumberInput from "@/components/ui/NumberInput";
import { ExerciseRow } from "./ExerciseRow";
import { GroupSectionProps } from "./PlanEditor.types";

export const GroupSection = ({
  group,
  gIndex: _gIndex,
  onRemoveGroup,
  showRemoveGroup,
  onUpdateField,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
  exercisesMaster,
  t,
  locale,
}: GroupSectionProps): React.JSX.Element => {
  const isSuperset = group.exercises.length > 1;

  return (
    <div className="rounded-xl border border-brand-primary/20 bg-black/10 p-4 space-y-4">
      <div className="flex items-center gap-2">
        {isSuperset && (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest italic text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
            <Layers className="w-3 h-3" /> {t("superset")}
          </span>
        )}
        <Input
          variant="minimal"
          className="flex-1 font-bold text-white placeholder:text-gray-500 text-sm"
          value={group.label ?? ""}
          placeholder={t("group_label_placeholder")}
          onChange={(e) => onUpdateField("label", e.target.value)}
        />
        {showRemoveGroup && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveGroup}
            className="text-text-subtle hover:text-status-error hover:bg-status-error/10 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          label={t("rounds")}
          value={group.rounds}
          min={1}
          onChange={(val) => onUpdateField("rounds", val)}
        />
        <NumberInput
          label={t("rest_after")}
          value={group.rest}
          step={5}
          onChange={(val) => onUpdateField("rest", val)}
        />
      </div>

      <div className="space-y-4">
        {group.exercises.map((ex, eIndex) => (
          <ExerciseRow
            key={eIndex}
            exercise={ex}
            onRemove={() => onRemoveExercise(eIndex)}
            canRemove={group.exercises.length > 1}
            onUpdate={(field, value) => onUpdateExercise(eIndex, field, value)}
            exercisesMaster={exercisesMaster}
            t={t}
            locale={locale}
          />
        ))}
      </div>

      <Button
        variant="secondary"
        fullWidth
        size="sm"
        onClick={onAddExercise}
        className="bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10"
      >
        <Plus className="w-4 h-4 mr-2" /> {t("add_to_group")}
      </Button>
    </div>
  );
};
