"use client";

import { Plus, Trash2, Save, ChevronLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import CustomSelect from "@/components/ui/CustomSelect";
import NumberInput from "@/components/ui/NumberInput";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { usePlanEditor } from "./usePlanEditor";

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

  if (loading) return <LoadingScreen label={t("loading_library")} />;

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-brand-surface rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{editId ? t("edit_title") : t("create_title")}</h1>
      </header>

      <div className="space-y-6 max-w-2xl mx-auto w-full p-1">
        <div className="bg-brand-surface rounded-lg shadow-card p-4 space-y-2">
          <label className="block text-xs uppercase tracking-widest text-text-subtle font-black ml-1">{t("plan_name_label")}</label>
          <input
            type="text"
            placeholder={t("plan_name_placeholder")}
            className="w-full bg-brand-secondary rounded-md p-3 text-white outline-none focus:ring-1 focus:ring-brand-primary shadow-inner placeholder:text-gray-700"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>

        {workouts.map((workout, wIndex) => (
          <div key={wIndex} className="bg-brand-surface rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-visible group">
            <div
              onClick={() => toggleWorkout(wIndex)}
              className={`p-4 flex justify-between items-center rounded-t-lg cursor-pointer hover:bg-white/5 transition-colors ${!expandedWorkouts[wIndex] ? "rounded-b-lg" : ""}`}
            >
              <div className="flex-1 flex items-center gap-2">
                <input
                  className="bg-transparent font-black text-white outline-none focus:text-brand-primary placeholder:text-gray-500 w-full uppercase italic tracking-tighter"
                  value={workout.name}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const newWorkouts = [...workouts];
                    newWorkouts[wIndex].name = e.target.value;
                    setWorkouts(newWorkouts);
                  }}
                />
              </div>
              <div className="flex items-center gap-1 ml-4">
                {workouts.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeWorkout(wIndex); }}
                    className="p-2 text-text-subtle hover:text-status-error transition-colors rounded-md hover:bg-status-error/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="p-2 text-brand-primary">
                  <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${expandedWorkouts[wIndex] ? "rotate-90" : "-rotate-90"}`} />
                </div>
              </div>
            </div>

            {expandedWorkouts[wIndex] && (
              <div className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
                {workout.exercises.map((ex, eIndex) => (
                  <div key={eIndex} className="bg-brand-secondary/30 rounded-xl p-4 shadow-inner relative group/ex transition-all border border-white/5">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-text-subtle uppercase font-black tracking-widest mb-1.5 block ml-1">{t("exercise_label")}</label>
                        <CustomSelect
                          options={exercisesMaster}
                          value={exercisesMaster.find((m) => m.id === ex.exercise_id)?.name || ""}
                          onChange={(val) => {
                            const masterEx = exercisesMaster.find((m) => m.name === val);
                            if (!masterEx) return;
                            const newWorkouts = [...workouts];
                            newWorkouts[wIndex].exercises[eIndex].exercise_id = masterEx.id;
                            setWorkouts(newWorkouts);
                          }}
                          placeholder={t("exercise_placeholder")}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <NumberInput label="Sets" value={ex.sets} onChange={(val) => { const nw = [...workouts]; nw[wIndex].exercises[eIndex].sets = val; setWorkouts(nw); }} />
                        <NumberInput label="Reps" value={ex.reps} onChange={(val) => { const nw = [...workouts]; nw[wIndex].exercises[eIndex].reps = val; setWorkouts(nw); }} />
                        <NumberInput label="Load (kg)" value={ex.load} onChange={(val) => { const nw = [...workouts]; nw[wIndex].exercises[eIndex].load = val; setWorkouts(nw); }} step={0.5} />
                        <NumberInput label="Rest (s)" value={ex.rest} onChange={(val) => { const nw = [...workouts]; nw[wIndex].exercises[eIndex].rest = val; setWorkouts(nw); }} step={5} />
                      </div>
                    </div>

                    <button
                      onClick={() => removeExercise(wIndex, eIndex)}
                      className="absolute -top-2 -right-2 bg-brand-surface p-1.5 rounded-full text-status-error shadow-card hover:bg-status-error hover:text-white transition-all scale-0 group-hover/ex:scale-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addExercise(wIndex)}
                  className="w-full py-3 bg-brand-primary/5 rounded-lg text-brand-primary hover:bg-brand-primary/10 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4" /> {t("add_exercise")}
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="flex gap-4 pt-4 pb-12">
          <button
            onClick={addWorkout}
            disabled={actionLoading}
            className="flex-1 py-4 bg-brand-surface text-white rounded-md font-black uppercase text-xs tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-all shadow-card"
          >
            {t("add_workout")}
          </button>
          <button
            onClick={onSave}
            disabled={actionLoading}
            className="flex-1 py-4 bg-brand-primary text-black rounded-md font-black uppercase text-xs tracking-widest shadow-elevated flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {actionLoading ? t("saving") : t("save_plan")}
          </button>
        </div>

        {error && (
          <div className="mb-12 p-4 bg-status-error/10 rounded-lg animate-in fade-in slide-in-from-bottom-2 shadow-card">
            <p className="text-status-error text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
};
