"use client";

import React from "react";
import { ChevronLeft, Timer, Info, Trophy } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Button } from "@/components/ui/Button";
import { formatMMSS } from "@/lib/utils/time";
import { useWorkoutRunner } from "./useWorkoutRunner";
import { ActiveExerciseCard } from "./ActiveExerciseCard";

export const WorkoutRunner = (): React.JSX.Element => {
  const t = useTranslations("Session");
  const {
    loading,
    error,
    actionLoading,
    workout,
    exercises,
    completedExercises,
    showFinishModal,
    setShowFinishModal,
    showExitModal,
    setShowExitModal,
    effortRpe,
    setEffortRpe,
    seconds,
    completedCount,
    handleSafeBack,
    toggleExercise,
    updateExerciseParam,
    handleFinish,
  } = useWorkoutRunner();

  if (loading) return <LoadingScreen label={t("preparing")} />;

  if (error) {
    const errorMsg = error === "no_exercises" 
      ? t("error_no_exercises")
      : error === "JSON object requested, multiple (or no) rows returned"
        ? t("error_not_found")
        : error;

    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-brand-secondary min-h-screen p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Info className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-white font-black uppercase tracking-tighter text-xl mb-2 italic">{t("error_title")}</h2>
        <p className="text-text-subtle text-xs mb-8 max-w-xs">{errorMsg}</p>
        <Link href="/">
          <Button variant="primary" size="lg">
            {t("return_to_dashboard")}
          </Button>
        </Link>
      </div>
    );
  }

  const progressPercent = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <header className="sticky top-0 z-50 bg-brand-secondary/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSafeBack}
              className="p-1"
            >
              <ChevronLeft className="w-5 h-5 text-text-subtle" />
            </Button>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">{t("active_session")}</span>
              <span className="text-sm font-black uppercase tracking-tight text-white truncate max-w-37.5 italic">{workout?.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-brand-primary bg-brand-primary/10 px-3 py-1.5 rounded-full shadow-card hover:shadow-card-hover transition-all">
            <Timer className="w-3.5 h-3.5" />
            <span className="text-sm font-black tracking-tighter tabular-nums">{formatMMSS(seconds)}</span>
          </div>
        </div>
        <div className="w-full h-1 bg-gray-900/50">
          <div
            className="h-full bg-brand-primary transition-all duration-500 shadow-[0_0_10px_rgba(206,255,5,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      <div className="p-4 flex-1 flex flex-col space-y-6 pb-28">
        <div className="space-y-4">
          {exercises.map((ex, index) => (
            <ActiveExerciseCard
              key={ex.id}
              exercise={ex}
              index={index}
              isDone={completedExercises[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onUpdateParam={(field, value) => updateExerciseParam(ex.id, field, value)}
            />
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-brand-secondary/80 backdrop-blur-md flex gap-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => setShowFinishModal(true)}
          disabled={completedCount === 0}
          className="gap-3 disabled:grayscale"
        >
          <Trophy className="w-5 h-5" />
          {t("finish_save")}
        </Button>
      </footer>

      <ConfirmationModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleFinish}
        isLoading={actionLoading}
        title={t("complete_title")}
        message={t("complete_message", { count: completedCount, time: formatMMSS(seconds) })}
        confirmText={t("submit_progress")}
        variant="primary"
      >
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-end px-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-1">{t("perceived_effort")}</span>
              <span className="text-3xl font-black text-brand-primary italic leading-none tracking-tighter">RPE {effortRpe}</span>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-brand-accent italic mb-1">
              {effortRpe <= 3 ? t("recovery") : effortRpe <= 6 ? t("challenging") : effortRpe <= 8 ? t("very_hard") : t("max_effort")}
            </div>
          </div>

          <div className="relative pt-2">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={effortRpe}
              onChange={(e) => setEffortRpe(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
            <div className="flex justify-between mt-3 text-xs font-bold text-text-subtle uppercase tracking-widest px-1">
              <span>{t("light")}</span>
              <span>{t("moderate")}</span>
              <span>{t("heavy")}</span>
            </div>
          </div>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={() => { setShowExitModal(false); handleSafeBack(); }}
        title={t("discard_title")}
        message={t("discard_message")}
        confirmText={t("discard_confirm")}
        cancelText={t("keep_training")}
        variant="danger"
      />
    </main>
  );
};
