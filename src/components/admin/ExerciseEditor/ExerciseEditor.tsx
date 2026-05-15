"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import CustomSelect from "@/components/ui/CustomSelect";
import { VideoUpload } from "@/components/ui/VideoUpload";
import { useMuscleGroupTranslation } from "@/hooks/useMuscleGroupTranslation";
import { useExerciseEditor } from "./useExerciseEditor";
import { ExerciseEditorProps } from "./ExerciseEditor.types";

export const ExerciseEditor = ({ exerciseId }: ExerciseEditorProps): React.JSX.Element => {
  const t = useTranslations("Admin.Exercises");
  const ct = useTranslations("Common");
  const { translateMuscleGroup } = useMuscleGroupTranslation();

  const {
    muscleGroups,
    loading,
    actionLoading,
    error,
    form,
    setForm,
    handleSave,
    isEditing,
  } = useExerciseEditor(exerciseId);

  const onSave = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await handleSave();
  };

  if (loading) return <LoadingScreen label={t("loading_library")} />;

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen">
      <header className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">{isEditing ? t("edit_title_form") : t("new_title")}</h1>
      </header>

      <div className="space-y-6 max-w-2xl mx-auto w-full p-1">
        <form onSubmit={onSave} className="space-y-6">
          <Card variant="default" padding="lg" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t("name_en_label")}
                  placeholder={t("name_placeholder")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={actionLoading}
                />
                <Input
                  label={t("name_pt_label")}
                  placeholder="Ex: Agachamento"
                  value={form.name_pt || ""}
                  onChange={(e) => setForm({ ...form, name_pt: e.target.value })}
                  disabled={actionLoading}
                />
              </div>

              <CustomSelect
                label={t("select_muscle_group")}
                options={muscleGroups.map(g => ({ name: g.name, label: translateMuscleGroup(g.name) }))}
                value={form.muscle_group}
                onChange={(val) => setForm({ ...form, muscle_group: val })}
                placeholder={t("select_muscle_group")}
                disabled={actionLoading}
              />

              <VideoUpload
                label={t("tutorial_url_label")}
                currentUrl={form.media_url}
                onUploadSuccess={(url) => setForm({ ...form, media_url: url })}
                disabled={actionLoading}
              />

              <TextArea
                label={ct("description")}
                placeholder={t("description_placeholder")}
                className="min-h-32"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={actionLoading}
              />
            </div>
          </Card>

          <div className="flex gap-4 pt-4 pb-12">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={actionLoading}
              loadingText={ct("processing")}
            >
              {isEditing ? ct("save") : t("add_button")}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mb-12 p-4 bg-status-error/10 rounded-lg animate-in fade-in slide-in-from-bottom-2 shadow-card text-center">
            <p className="text-status-error text-xs font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
};
