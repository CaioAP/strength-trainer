"use client";

import { ChevronLeft, Check, Timer, Info, Trophy } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import NumberInput from "@/components/ui/NumberInput";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { formatMMSS } from "@/lib/utils/time";
import { useWorkoutRunner } from "./useWorkoutRunner";

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
        <Link
          href="/"
          className="px-8 py-3 bg-brand-primary text-black font-black uppercase text-[10px] tracking-widest rounded shadow-elevated transition-transform active:scale-95"
        >
          {t("return_to_dashboard")}
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
            <button onClick={handleSafeBack} className="p-1 hover:bg-brand-secondary rounded transition-colors">
              <ChevronLeft className="w-5 h-5 text-text-subtle" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">{t("active_session")}</span>
              <span className="text-sm font-black uppercase tracking-tight text-white truncate max-w-[150px] italic">{workout?.name}</span>
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
          {exercises.map((ex, index) => {
            const isDone = completedExercises[ex.id];
            return (
              <div
                key={ex.id}
                className={`bg-brand-surface rounded-xl shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 overflow-hidden ${
                  isDone ? "ring-1 ring-brand-primary/50 shadow-[inset_0_0_20px_rgba(206,255,5,0.05)]" : ""
                }`}
              >
                <div className={`p-4 flex justify-between items-start ${isDone ? "bg-brand-primary/5" : ""}`}>
                  <div className="flex gap-3">
                    <span className="text-[10px] font-black text-text-subtle mt-1">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className={`font-black text-lg leading-tight uppercase italic tracking-tighter transition-colors ${isDone ? "text-brand-primary" : "text-white"}`}>
                        {ex.exercise?.name}
                      </h3>
                      {ex.exercise?.description && !isDone && (
                        <p className="text-[10px] text-text-subtle mt-1 italic opacity-60 line-clamp-1">{ex.exercise.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExercise(ex.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-brand-primary text-black scale-105 shadow-[0_0_15px_rgba(206,255,5,0.4)]"
                        : "bg-brand-secondary text-text-subtle shadow-inner hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Check className={`w-5 h-5 ${isDone ? "stroke-[3px]" : ""}`} />
                  </button>
                </div>

                <div className={`p-4 grid grid-cols-2 gap-4 transition-opacity duration-300 bg-black/10 ${isDone ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                  <NumberInput label="Sets" value={ex.actual_sets} onChange={(v) => updateExerciseParam(ex.id, "actual_sets", v)} min={1} />
                  <NumberInput label="Reps" value={ex.actual_reps} onChange={(v) => updateExerciseParam(ex.id, "actual_reps", v)} min={1} />
                  <NumberInput label="Load (kg)" value={ex.actual_load} onChange={(v) => updateExerciseParam(ex.id, "actual_load", v)} step={0.5} />
                  <NumberInput label="Rest (s)" value={ex.actual_rest} onChange={(v) => updateExerciseParam(ex.id, "actual_rest", v)} step={5} min={0} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-brand-secondary/80 backdrop-blur-md flex gap-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => setShowFinishModal(true)}
          disabled={completedCount === 0}
          className="w-full py-4 bg-brand-primary text-black rounded-md font-black uppercase text-sm tracking-widest shadow-elevated transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
        >
          <Trophy className="w-5 h-5" />
          {t("finish_save")}
        </button>
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
              <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle mb-1">{t("perceived_effort")}</span>
              <span className="text-3xl font-black text-brand-primary italic leading-none tracking-tighter">RPE {effortRpe}</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-accent italic mb-1">
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
            <div className="flex justify-between mt-3 text-[9px] font-black text-text-subtle uppercase tracking-widest px-1">
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
