import React from "react";
import { useTranslations } from "next-intl";
import { Plus, Dumbbell, Trash2 } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { ExerciseMaster, MuscleGroup, NewExercise } from "./AdminDashboard.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";

interface ExercisesTabProps {
  exercises: ExerciseMaster[];
  muscleGroups: MuscleGroup[];
  exerciseFilter: string;
  setExerciseFilter: (filter: string) => void;
  newEx: NewExercise;
  setNewEx: (ex: NewExercise) => void;
  actionLoading: boolean;
  deletingId: string | null;
  onAdd: (e: React.FormEvent) => Promise<void>;
  onDelete: (id: string) => void;
  confirmModal: { isOpen: boolean; id: string | null };
  closeModal: () => void;
  handleConfirmDelete: () => Promise<void>;
}

export default function ExercisesTab({
  exercises,
  muscleGroups,
  exerciseFilter,
  setExerciseFilter,
  newEx,
  setNewEx,
  actionLoading,
  deletingId,
  onAdd,
  onDelete,
  confirmModal,
  closeModal,
  handleConfirmDelete,
}: ExercisesTabProps): React.JSX.Element {
  const t = useTranslations("Admin.Exercises");
  const ct = useTranslations("Common");

  const filteredExercises = exercises.filter((ex) => 
    !exerciseFilter || ex.muscle_group === exerciseFilter
  );

  return (
    <div className="space-y-6">
      <form onSubmit={onAdd}>
        <Card variant="default" padding="lg" className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Plus className="text-brand-primary w-5 h-5" />
            <h2 className="text-lg font-semibold">{t("new_title")}</h2>
          </div>
          <div className="space-y-3">
            <Input
              placeholder={t("name_placeholder")}
              value={newEx.name}
              onChange={(e) => setNewEx({ ...newEx, name: e.target.value })}
              required
              disabled={actionLoading}
            />
            <CustomSelect
              options={muscleGroups.map(g => ({ name: g.name }))}
              value={newEx.muscle_group}
              onChange={(val) => setNewEx({ ...newEx, muscle_group: val })}
              placeholder={t("select_muscle_group")}
              disabled={actionLoading}
            />
            <TextArea
              placeholder={t("description_placeholder")}
              className="min-h-25"
              value={newEx.description}
              onChange={(e) => setNewEx({ ...newEx, description: e.target.value })}
              disabled={actionLoading}
            />
          </div>
          <Button
            type="submit"
            fullWidth
            loading={actionLoading}
            loadingText={ct("processing")}
          >
            {t("add_button")}
          </Button>
        </Card>
      </form>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-brand-primary" />
            {t("library_title")}
          </h2>
          <CustomSelect
            options={[{ name: t("filter_all") }, ...muscleGroups]}
            value={exerciseFilter || t("filter_all")}
            onChange={(val) => setExerciseFilter(val === t("filter_all") ? "" : val)}
            className="w-44"
            placeholder={ct("search")}
          />
        </div>
        <div className="grid gap-3">
          {filteredExercises.map((ex) => (
            <Card 
              key={ex.id} 
              variant="interactive"
              padding="sm"
              className="flex justify-between items-center group"
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors truncate">
                    {ex.name}
                  </h3>
                  <span className="text-2 bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded uppercase font-bold tracking-widest whitespace-nowrap">
                    {ex.muscle_group}
                  </span>
                </div>
                {ex.description && (
                  <p className="text-2.5 text-text-subtle line-clamp-1 mt-1">
                    {ex.description}
                  </p>
                )}
              </div>
              <div className="flex items-center shrink-0">
                {deletingId === ex.id ? (
                  <div className="p-2">
                    <div className="w-4 h-4 border-2 border-status-error border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(ex.id)}
                    disabled={actionLoading}
                    className="text-status-error hover:bg-status-error/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title={ct("delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        isLoading={actionLoading}
        title={t("delete_confirm_title")}
        message={t("delete_confirm_msg")}
        confirmText={ct("delete")}
        variant="danger"
      />
    </div>
  );
}
