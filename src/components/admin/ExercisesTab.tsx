import React from "react";
import { useTranslations } from "next-intl";
import { Plus, Dumbbell, Trash2, Video } from "lucide-react";
import Link from "next/link";
import CustomSelect from "@/components/ui/CustomSelect";
import SearchInput from "@/components/ui/SearchInput";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { ExerciseMaster, MuscleGroup } from "./AdminDashboard.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getLocalizedExercise } from "@/lib/utils/exercise";
import { useMuscleGroupTranslation } from "@/hooks/useMuscleGroupTranslation";

interface ExercisesTabProps {
  exercises: ExerciseMaster[];
  muscleGroups: MuscleGroup[];
  exerciseFilter: string;
  setExerciseFilter: (filter: string) => void;
  actionLoading: boolean;
  deletingId: string | null;
  onDelete: (id: string) => void;
  confirmModal: { isOpen: boolean; id: string | null };
  closeModal: () => void;
  handleConfirmDelete: () => Promise<void>;
  locale: string;
}

export default function ExercisesTab({
  exercises,
  muscleGroups,
  exerciseFilter,
  setExerciseFilter,
  actionLoading,
  deletingId,
  onDelete,
  confirmModal,
  closeModal,
  handleConfirmDelete,
  locale,
}: ExercisesTabProps): React.JSX.Element {
  const t = useTranslations("Admin.Exercises");
  const ct = useTranslations("Common");
  const { translateMuscleGroup } = useMuscleGroupTranslation();
  const [nameSearch, setNameSearch] = React.useState("");

  const muscleGroupOptions = React.useMemo(() => {
    const options = muscleGroups.map(g => ({ 
      name: g.name, 
      label: translateMuscleGroup(g.name) 
    }));
    
    options.sort((a, b) => a.label.localeCompare(b.label, locale));
    
    return [{ name: "", label: t("filter_all") }, ...options];
  }, [muscleGroups, translateMuscleGroup, locale, t]);

  const filteredExercises = React.useMemo(() => {
    const result = exercises.filter((ex) => {
      const { displayName } = getLocalizedExercise(ex, locale);
      const matchesGroup = !exerciseFilter || ex.muscle_group === exerciseFilter;
      const matchesName = !nameSearch || displayName.toLowerCase().includes(nameSearch.toLowerCase());
      return matchesGroup && matchesName;
    });

    return result.sort((a, b) => {
      const nameA = getLocalizedExercise(a, locale).displayName;
      const nameB = getLocalizedExercise(b, locale).displayName;
      return nameA.localeCompare(nameB, locale);
    });
  }, [exercises, exerciseFilter, nameSearch, locale]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end px-1">
        <Link href="/admin/exercises/new">
          <Button variant="primary" size="md" className="gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> {t("add_button")}
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 px-1">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-brand-primary" />
              {t("library_title")}
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              placeholder={t("name_placeholder")}
              value={nameSearch}
              onChange={setNameSearch}
              className="flex-1"
            />
            <CustomSelect
              options={muscleGroupOptions}
              value={exerciseFilter}
              onChange={(val) => setExerciseFilter(val)}
              className="w-full sm:w-48"
              placeholder={ct("search")}
            />
          </div>
        </div>
        
        <div className="grid gap-3">
          {filteredExercises.map((ex) => {
            const { displayName } = getLocalizedExercise(ex, locale);
            return (
              <Link key={ex.id} href={`/admin/exercises/edit/${ex.id}`} className="block min-w-0">
                <Card
                  variant="interactive"
                  padding="none"
                  className="group flex items-center gap-3 px-4 py-3 transition-all duration-300"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors truncate">
                        {displayName}
                      </h3>
                      {ex.media_url && (
                        <span className="p-1 bg-brand-primary/10 text-brand-primary rounded shrink-0" aria-label={t("view_video")}>
                          <Video className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded uppercase font-bold tracking-widest self-start">
                      {translateMuscleGroup(ex.muscle_group)}
                    </span>
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDelete(ex.id);
                        }}
                        disabled={actionLoading}
                        className="text-status-error hover:bg-status-error/10"
                        title={ct("delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
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
