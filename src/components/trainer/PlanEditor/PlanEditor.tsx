"use client";

import React from "react";
import { Save, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePlanEditor } from "./usePlanEditor";
import { WorkoutSection } from "./WorkoutSection";
import { PlanExerciseInput } from "./PlanEditor.types";

export const PlanEditor = (): React.JSX.Element => {
  const t = useTranslations("Trainer.PlanEditor");
  const {
    exercisesMaster,
    loading,
    actionLoading,
    error,
    setError,
    planName,
    setPlanName,
    expandedWorkouts,
    workouts,
    setWorkouts,
    addWorkout,
    toggleWorkout,
    addExercise,
    removeExercise,
    removeWorkout,
    handleSave,
    editId,
    router,
  } = usePlanEditor();

  const onSave = async (): Promise<void> => {
    const result = await handleSave();
    if (result.error) {
      const errKey = result.error.message.split("|")[0];
      const errName = result.error.message.split("|")[1];
      
      if (errKey === "error_name_required") {
        setError(t("error_name_required"));
      } else if (errKey === "error_exercise_required") {
        setError(t("error_exercise_required", { name: errName }));
      } else {
        setError(t("error_save_failed"));
      }
    }
  };

  const updateWorkoutName = (wIndex: number, name: string): void => {
    const newWorkouts = [...workouts];
    newWorkouts[wIndex].name = name;
    setWorkouts(newWorkouts);
  };

  const updateExercise = (wIndex: number, eIndex: number, field: keyof PlanExerciseInput, value: string | number): void => {
    const newWorkouts = [...workouts];
    newWorkouts[wIndex].exercises[eIndex] = {
      ...newWorkouts[wIndex].exercises[eIndex],
      [field]: value,
    };
    setWorkouts(newWorkouts);
  };

  if (loading) return <LoadingScreen label={t("loading_library")} />;

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen">
      <header className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">{editId ? t("edit_title") : t("create_title")}</h1>
      </header>

      <div className="space-y-6 max-w-2xl mx-auto w-full p-1">
        <Card variant="default" padding="md" className="space-y-2">
          <Input
            label={t("plan_name_label")}
            placeholder={t("plan_name_placeholder")}
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </Card>

        {workouts.map((workout, wIndex) => (
          <WorkoutSection
            key={wIndex}
            workout={workout}
            wIndex={wIndex}
            isExpanded={expandedWorkouts[wIndex]}
            onToggle={() => toggleWorkout(wIndex)}
            onRemove={() => removeWorkout(wIndex)}
            onUpdateName={(name) => updateWorkoutName(wIndex, name)}
            onAddExercise={() => addExercise(wIndex)}
            onRemoveExercise={(eIndex) => removeExercise(wIndex, eIndex)}
            onUpdateExercise={(eIndex, field, value) => updateExercise(wIndex, eIndex, field, value)}
            exercisesMaster={exercisesMaster}
            showRemoveWorkout={workouts.length > 1}
            t={t}
          />
        ))}

        <div className="flex gap-4 pt-4 pb-12">
          <Button
            variant="secondary"
            fullWidth
            size="lg"
            onClick={addWorkout}
            disabled={actionLoading}
          >
            {t("add_workout")}
          </Button>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={onSave}
            loading={actionLoading}
            loadingText={t("saving")}
          >
            {!actionLoading && <Save className="w-4 h-4 mr-2" />}
            {t("save_plan")}
          </Button>
        </div>

        {error && (
          <div className="mb-12 p-4 bg-status-error/10 rounded-lg animate-in fade-in slide-in-from-bottom-2 shadow-card">
            <p className="text-status-error text-2.5 font-black uppercase tracking-widest text-center leading-relaxed">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
};
