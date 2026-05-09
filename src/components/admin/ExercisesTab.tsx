import React from "react";
import { useTranslations } from "next-intl";
import { Plus, Dumbbell, Trash2, Video, Pencil, X } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import SearchInput from "@/components/ui/SearchInput";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { ExerciseMaster, MuscleGroup, NewExercise } from "./AdminDashboard.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { VideoModal } from "@/components/ui/VideoModal";
import { getLocalizedExercise } from "@/lib/utils/exercise";
import { useMuscleGroupTranslation } from "@/hooks/useMuscleGroupTranslation";

interface ExercisesTabProps {
  exercises: ExerciseMaster[];
  muscleGroups: MuscleGroup[];
  exerciseFilter: string;
  setExerciseFilter: (filter: string) => void;
  newEx: NewExercise;
  setNewEx: (ex: NewExercise) => void;
  editingId: string | null;
  startEditing: (ex: ExerciseMaster) => void;
  cancelEditing: () => void;
  actionLoading: boolean;
  deletingId: string | null;
  onAdd: (e: React.FormEvent) => Promise<void>;
  onUpdate: (e: React.FormEvent) => Promise<void>;
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
  newEx,
  setNewEx,
  editingId,
  startEditing,
  cancelEditing,
  actionLoading,
  deletingId,
  onAdd,
  onUpdate,
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
  const [videoModal, setVideoModal] = React.useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: "",
    title: "",
  });

  const muscleGroupOptions = React.useMemo(() => {
    const options = muscleGroups.map(g => ({ 
      name: g.name, 
      label: translateMuscleGroup(g.name) 
    }));
    
    // Sort by translated label
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

    // Sort by localized name
    return result.sort((a, b) => {
      const nameA = getLocalizedExercise(a, locale).displayName;
      const nameB = getLocalizedExercise(b, locale).displayName;
      return nameA.localeCompare(nameB, locale);
    });
  }, [exercises, exerciseFilter, nameSearch, locale]);

  return (
    <div className="space-y-6">
      <form onSubmit={editingId ? onUpdate : onAdd}>
        <Card 
          variant={editingId ? "interactive" : "default"} 
          padding="lg" 
          className={`space-y-4 transition-all duration-300 ${editingId ? "ring-1 ring-brand-primary/50 bg-brand-primary/5" : ""}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {editingId ? <Pencil className="text-brand-primary w-5 h-5" /> : <Plus className="text-brand-primary w-5 h-5" />}
              <h2 className="text-lg font-semibold">{editingId ? t("edit_title_form") : t("new_title")}</h2>
            </div>
            {editingId && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={cancelEditing}
                className="text-text-subtle hover:text-white"
              >
                <X className="w-4 h-4 mr-1" /> {ct("cancel")}
              </Button>
            )}
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="EN Name"
                placeholder={t("name_placeholder")}
                value={newEx.name}
                onChange={(e) => setNewEx({ ...newEx, name: e.target.value })}
                required
                disabled={actionLoading}
              />
              <Input
                label="PT Nome"
                placeholder="Nome em Português"
                value={newEx.name_pt || ""}
                onChange={(e) => setNewEx({ ...newEx, name_pt: e.target.value })}
                disabled={actionLoading}
              />
            </div>
            <CustomSelect
              options={muscleGroups.map(g => ({ name: g.name, label: translateMuscleGroup(g.name) }))}
              value={newEx.muscle_group}
              onChange={(val) => setNewEx({ ...newEx, muscle_group: val })}
              placeholder={t("select_muscle_group")}
              disabled={actionLoading}
            />
            <Input
              label="Tutorial URL (MP4)"
              placeholder="https://..."
              value={newEx.media_url || ""}
              onChange={(e) => setNewEx({ ...newEx, media_url: e.target.value })}
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
          <div className="flex gap-3">
            <Button
              type="submit"
              fullWidth
              loading={actionLoading}
              loadingText={ct("processing")}
            >
              {editingId ? ct("save") : t("add_button")}
            </Button>
          </div>
        </Card>
      </form>

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
            const { displayName, displayDescription } = getLocalizedExercise(ex, locale);
            const isEditing = editingId === ex.id;
            return (
              <Card 
                key={ex.id} 
                variant="interactive"
                padding="none"
                onClick={() => startEditing(ex)}
                className={`group min-h-20 flex flex-col justify-center px-4 py-2 transition-all duration-300 ${
                  isEditing ? "ring-2 ring-brand-primary bg-brand-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors truncate">
                      {displayName}
                    </h3>
                    {ex.media_url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoModal({ isOpen: true, url: ex.media_url!, title: displayName });
                        }}
                        className="p-1 bg-brand-primary/10 text-brand-primary rounded hover:bg-brand-primary/20 transition-all shrink-0"
                        title={t("view_video")}
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded uppercase font-bold tracking-widest whitespace-nowrap shrink-0">
                    {translateMuscleGroup(ex.muscle_group)}
                  </span>
                </div>
                
                <div className="pr-10">
                  {displayDescription && (
                    <p className="text-xs text-text-subtle line-clamp-2 italic opacity-80">
                      {displayDescription}
                    </p>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 flex items-center shrink-0">
                  {deletingId === ex.id ? (
                    <div className="p-2">
                      <div className="w-4 h-4 border-2 border-status-error border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(ex.id);
                      }}
                      disabled={actionLoading}
                      className="text-status-error hover:bg-status-error/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title={ct("delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
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

      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ ...videoModal, isOpen: false })}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </div>
  );
}
