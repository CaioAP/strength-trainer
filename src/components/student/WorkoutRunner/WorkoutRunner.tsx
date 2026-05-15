import React from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Play,
  ChevronLeft,
} from "lucide-react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import SuspenseLoader from "@/components/ui/SuspenseLoader";
import { Button } from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { ActiveExerciseCard } from "./ActiveExerciseCard";
import { useWorkoutRunner } from "./useWorkoutRunner";

interface WorkoutRunnerProps {
  studentId: string;
  workoutId: string;
}

function WorkoutRunnerContent({ studentId: _studentId, workoutId: _workoutId }: WorkoutRunnerProps): React.JSX.Element {
  const t = useTranslations("Student.WorkoutRunner");
  const ct = useTranslations("Common");
  const locale = useLocale();
  
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
    router,
  } = useWorkoutRunner();

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <LoadingScreen fullPage={false} label={t("preparing_session")} />;
  if (error || !workout) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <p className="text-status-error font-bold mb-4">{error || "Workout not found"}</p>
      <Button onClick={() => router.back()}>{ct("back")}</Button>
    </div>
  );

  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen pb-32">
      <header className="p-4 bg-brand-surface border-b border-white/5 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSafeBack}
            className="p-2 rounded-full text-text-subtle hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-black uppercase italic tracking-tighter text-white leading-none">{workout.name}</h1>
            <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mt-1">
              {completedCount} / {exercises.length} {t("exercises_done")}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-brand-primary fill-current" />
            <span className="text-xl font-mono font-black text-white">{formatTime(seconds)}</span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {exercises.map((ex, index) => (
          <ActiveExerciseCard
            key={ex.id}
            exercise={ex}
            index={index}
            isDone={!!completedExercises[ex.id]}
            onToggle={() => toggleExercise(ex.id)}
            onUpdateParam={(field, val) => updateExerciseParam(ex.id, field, val)}
            locale={locale}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-brand-secondary via-brand-secondary to-transparent">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => setShowFinishModal(true)}
          disabled={completedCount === 0 || actionLoading}
          className="shadow-[0_0_30px_rgba(206,255,5,0.2)]"
        >
          {t("finish_workout")}
        </Button>
      </div>

      {/* Finish Modal */}
      <ConfirmationModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleFinish}
        title={t("finish_confirm_title")}
        message={t("finish_confirm_msg")}
        confirmText={t("finish_button")}
        isLoading={actionLoading}
      >
        <div className="mt-6 space-y-4">
          <label className="block text-xs font-bold text-text-subtle uppercase tracking-widest text-center">
            {t("rate_effort")}
          </label>
          <div className="flex justify-between gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rpe) => (
              <button
                key={rpe}
                onClick={() => setEffortRpe(rpe)}
                className={`flex-1 py-3 rounded-md font-black text-sm transition-all ${
                  effortRpe === rpe
                    ? "bg-brand-primary text-black scale-110 shadow-lg"
                    : "bg-brand-secondary text-text-subtle hover:text-white"
                }`}
              >
                {rpe}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-text-subtle uppercase tracking-tighter px-1">
            <span>{t("easy")}</span>
            <span>{t("max_effort")}</span>
          </div>
        </div>
      </ConfirmationModal>

      {/* Exit Modal */}
      <ConfirmationModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={() => router.back()}
        title={t("exit_confirm_title")}
        message={t("exit_confirm_msg")}
        confirmText={ct("exit")}
        variant="danger"
      />
    </main>
  );
}

export default function WorkoutRunner({ studentId, workoutId }: WorkoutRunnerProps): React.JSX.Element {
  return (
    <React.Suspense fallback={<SuspenseLoader />}>
      <WorkoutRunnerContent studentId={studentId} workoutId={workoutId} />
    </React.Suspense>
  );
}
