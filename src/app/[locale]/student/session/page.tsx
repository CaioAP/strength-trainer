'use client';

import { useState, useEffect, Suspense } from 'react';
import { ChevronLeft, Check, Timer, Info, Loader2, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import NumberInput from '@/components/ui/NumberInput';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { formatMMSS } from '@/lib/utils/time';
import { navigateBackAndRefresh } from '@/lib/utils/navigation';

function WorkoutRunner() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [workout, setWorkout] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [effortRpe, setEffortRpe] = useState(7);
  const [seconds, setSeconds] = useState(0);
  const [startTime] = useState(new Date().toISOString());

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('workout_id');

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const isDirty = seconds > 2;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSafeBack = () => {
    if (isDirty) setShowExitModal(true);
    else router.back();
  };

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchWorkout() {
      if (!workoutId) return;
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('workouts')
        .select(`
          name,
          plan_exercises (
            id,
            sets,
            reps,
            load,
            rest_seconds,
            order_index,
            exercise:exercise_master (name, description)
          )
        `)
        .eq('id', workoutId)
        .single();

      if (error) {
        console.error('Error fetching workout:', error);
        setError(error.message);
      } else if (data) {
        setWorkout(data);
        const sortedExercises = (data.plan_exercises || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((ex: any) => ({
            ...ex,
            actual_sets: ex.sets,
            actual_reps: ex.reps,
            actual_load: ex.load,
            actual_rest: ex.rest_seconds,
          }));
        setExercises(sortedExercises);
        if (sortedExercises.length === 0) setError('No exercises found for this workout.');
      }
      setLoading(false);
    }
    fetchWorkout();
  }, [supabase, workoutId]);

  const toggleExercise = (exId: string) => {
    setCompletedExercises((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  const updateExerciseParam = (exId: string, param: string, value: number) => {
    setExercises((prev) => prev.map((ex) => (ex.id === exId ? { ...ex, [param]: value } : ex)));
  };

  const handleFinish = async () => {
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: sProf } = await supabase.from('student_profiles').select('id').eq('user_id', user?.id).single();

      const { data: execution, error: execError } = await supabase
        .from('workout_executions')
        .insert([{
          student_id: sProf?.id,
          workout_id: workoutId,
          effort_rpe: effortRpe,
          started_at: startTime,
          completed_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (execError) throw execError;

      const modifications = exercises
        .filter((ex) =>
          ex.actual_sets !== ex.sets ||
          ex.actual_reps !== ex.reps ||
          ex.actual_load !== ex.load ||
          ex.actual_rest !== ex.rest_seconds
        )
        .map((ex) => ({
          execution_id: execution.id,
          plan_exercise_id: ex.id,
          set_number: 1,
          actual_reps: ex.actual_reps,
          actual_load: ex.actual_load,
          notes: `Modified session: Sets ${ex.actual_sets}, Rest ${ex.actual_rest}s`,
        }));

      if (modifications.length > 0) {
        const { error: modError } = await supabase.from('session_param_modifications').insert(modifications);
        if (modError) throw modError;
      }

      navigateBackAndRefresh(router);
    } catch (err) {
      console.error('Error finishing workout:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingScreen label="Preparing Session..." />;

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-brand-secondary min-h-screen p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Info className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-white font-black uppercase tracking-tighter text-xl mb-2 italic">Session Error</h2>
        <p className="text-text-subtle text-xs mb-8 max-w-xs">
          {error === 'JSON object requested, multiple (or no) rows returned'
            ? "This workout could not be found or you don't have access to it."
            : error}
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-brand-primary text-black font-black uppercase text-[10px] tracking-widest rounded shadow-elevated transition-transform active:scale-95"
        >
          Return to Dashboard
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
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Active Session</span>
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
                  isDone ? 'ring-1 ring-brand-primary/50 shadow-[inset_0_0_20px_rgba(206,255,5,0.05)]' : ''
                }`}
              >
                <div className={`p-4 flex justify-between items-start ${isDone ? 'bg-brand-primary/5' : ''}`}>
                  <div className="flex gap-3">
                    <span className="text-[10px] font-black text-text-subtle mt-1">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className={`font-black text-lg leading-tight uppercase italic tracking-tighter transition-colors ${isDone ? 'text-brand-primary' : 'text-white'}`}>
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
                        ? 'bg-brand-primary text-black scale-105 shadow-[0_0_15px_rgba(206,255,5,0.4)]'
                        : 'bg-brand-secondary text-text-subtle shadow-inner hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Check className={`w-5 h-5 ${isDone ? 'stroke-[3px]' : ''}`} />
                  </button>
                </div>

                <div className={`p-4 grid grid-cols-2 gap-4 transition-opacity duration-300 bg-black/10 ${isDone ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <NumberInput label="Sets" value={ex.actual_sets} onChange={(v) => updateExerciseParam(ex.id, 'actual_sets', v)} min={1} />
                  <NumberInput label="Reps" value={ex.actual_reps} onChange={(v) => updateExerciseParam(ex.id, 'actual_reps', v)} min={1} />
                  <NumberInput label="Load (kg)" value={ex.actual_load} onChange={(v) => updateExerciseParam(ex.id, 'actual_load', v)} step={0.5} />
                  <NumberInput label="Rest (s)" value={ex.actual_rest} onChange={(v) => updateExerciseParam(ex.id, 'actual_rest', v)} step={5} min={0} />
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
          Finish & Save Session
        </button>
      </footer>

      <ConfirmationModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleFinish}
        isLoading={actionLoading}
        title="Complete Session"
        message={`Excellent session! You completed ${completedCount} exercises in ${formatMMSS(seconds)}. Rate your overall perceived effort below.`}
        confirmText="Submit Progress"
        variant="primary"
      >
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-end px-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle mb-1">Perceived Effort</span>
              <span className="text-3xl font-black text-brand-primary italic leading-none tracking-tighter">RPE {effortRpe}</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-accent italic mb-1">
              {effortRpe <= 3 ? 'Recovery' : effortRpe <= 6 ? 'Challenging' : effortRpe <= 8 ? 'Very Hard' : 'Max Effort'}
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
              <span>Light</span>
              <span>Moderate</span>
              <span>Heavy</span>
            </div>
          </div>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={() => { setShowExitModal(false); router.back(); }}
        title="Discard Progress?"
        message="You have an active session. Leaving now will discard all your logged exercises and time."
        confirmText="Discard & Exit"
        cancelText="Keep Training"
        variant="danger"
      />
    </main>
  );
}

export default function ActiveSessionPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-brand-secondary min-h-screen">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    }>
      <WorkoutRunner />
    </Suspense>
  );
}
