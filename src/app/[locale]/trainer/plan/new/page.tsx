'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ChevronLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CustomSelect from '@/components/ui/CustomSelect';
import NumberInput from '@/components/ui/NumberInput';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { navigateBackAndRefresh } from '@/lib/utils/navigation';

export default function NewPlanPage() {
  const [exercisesMaster, setExercisesMaster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planName, setPlanName] = useState('');
  const [expandedWorkouts, setExpandedWorkouts] = useState<Record<number, boolean>>({ 0: true });
  const [workouts, setWorkouts] = useState([
    { name: 'Workout A', exercises: [{ exercise_id: '', sets: 3, reps: 10, load: 0, rest: 60 }] },
  ]);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('student_id');
  const editId = searchParams.get('plan_id');

  useEffect(() => {
    async function init() {
      setLoading(true);

      const { data: exData } = await supabase.from('exercise_master').select('id, name').order('name');
      if (exData) setExercisesMaster(exData);

      if (editId) {
        try {
          const { data: plan, error: pErr } = await supabase
            .from('plans')
            .select(`
              name,
              workouts (
                id,
                name,
                order_index,
                plan_exercises (
                  exercise_id,
                  sets,
                  reps,
                  load,
                  rest_seconds,
                  order_index
                )
              )
            `)
            .eq('id', editId)
            .single();

          if (pErr) throw pErr;

          setPlanName(plan.name);

          const mappedWorkouts = plan.workouts
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((w: any) => ({
              name: w.name,
              exercises: w.plan_exercises
                .sort((a: any, b: any) => a.order_index - b.order_index)
                .map((ex: any) => ({
                  exercise_id: ex.exercise_id,
                  sets: ex.sets,
                  reps: ex.reps,
                  load: ex.load,
                  rest: ex.rest_seconds,
                })),
            }));

          setWorkouts(mappedWorkouts);
          const initialExpanded: Record<number, boolean> = {};
          mappedWorkouts.forEach((_: any, i: number) => (initialExpanded[i] = true));
          setExpandedWorkouts(initialExpanded);
        } catch (err) {
          console.error('Error loading plan for edit:', err);
          setError('Failed to load plan data.');
        }
      }

      setLoading(false);
    }
    init();
  }, [supabase, editId]);

  const handleSave = async () => {
    if (!planName.trim()) {
      setError('Please provide a name for this plan.');
      return;
    }

    for (const workout of workouts) {
      if (workout.exercises.some((ex) => !ex.exercise_id)) {
        setError(`Please select an exercise for all slots in "${workout.name}".`);
        return;
      }
    }

    setActionLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required.');

      const { data: trainerProfile } = await supabase
        .from('trainer_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!trainerProfile) throw new Error('Trainer profile not found.');

      let plan;

      if (editId) {
        const { data: updatedPlan, error: pErr } = await supabase
          .from('plans')
          .update({ name: planName })
          .eq('id', editId)
          .select()
          .single();
        if (pErr) throw pErr;
        plan = updatedPlan;

        const { error: dErr } = await supabase.from('workouts').delete().eq('plan_id', editId);
        if (dErr) throw dErr;
      } else {
        const { data: newPlan, error: pErr } = await supabase
          .from('plans')
          .insert([{
            name: planName,
            trainer_id: trainerProfile.id,
            student_id: studentId || null,
            is_template: !studentId,
          }])
          .select()
          .single();
        if (pErr) throw pErr;
        plan = newPlan;
      }

      for (let i = 0; i < workouts.length; i++) {
        const wData = workouts[i];
        const { data: workout, error: workoutError } = await supabase
          .from('workouts')
          .insert([{ plan_id: plan.id, name: wData.name, order_index: i }])
          .select()
          .single();

        if (workoutError) throw workoutError;

        const exercisesToInsert = wData.exercises.map((ex, exIndex) => ({
          workout_id: workout.id,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          load: ex.load,
          rest_seconds: ex.rest,
          order_index: exIndex,
        }));

        const { error: exError } = await supabase.from('plan_exercises').insert(exercisesToInsert);
        if (exError) throw exError;
      }

      navigateBackAndRefresh(router);
    } catch (err: any) {
      console.error('Error saving plan:', err);
      setError(err.message || 'Failed to save plan. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const addWorkout = () => {
    const newIndex = workouts.length;
    setWorkouts([...workouts, {
      name: `Workout ${String.fromCharCode(65 + newIndex)}`,
      exercises: [{ exercise_id: '', sets: 3, reps: 10, load: 0, rest: 60 }],
    }]);
    setExpandedWorkouts((prev) => ({ ...prev, [newIndex]: true }));
  };

  const toggleWorkout = (index: number) => {
    setExpandedWorkouts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const addExercise = (wIndex: number) => {
    const newWorkouts = [...workouts];
    newWorkouts[wIndex].exercises.push({ exercise_id: '', sets: 3, reps: 10, load: 0, rest: 60 });
    setWorkouts(newWorkouts);
  };

  const removeExercise = (wIndex: number, eIndex: number) => {
    const newWorkouts = [...workouts];
    newWorkouts[wIndex].exercises.splice(eIndex, 1);
    setWorkouts(newWorkouts);
  };

  const removeWorkout = (index: number) => {
    if (workouts.length <= 1) return;
    const newWorkouts = [...workouts];
    newWorkouts.splice(index, 1);
    setWorkouts(newWorkouts);
    const newExpanded = { ...expandedWorkouts };
    delete newExpanded[index];
    setExpandedWorkouts(newExpanded);
  };

  if (loading) return <LoadingScreen label="Loading Library..." />;

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-brand-surface rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{editId ? 'Edit Training Plan' : 'Create New Plan'}</h1>
      </header>

      <div className="space-y-6 max-w-2xl mx-auto w-full p-1">
        <div className="bg-brand-surface rounded-lg shadow-card p-4 space-y-2">
          <label className="block text-xs uppercase tracking-widest text-text-subtle font-black ml-1">Plan Name</label>
          <input
            type="text"
            placeholder="e.g. Hypertrophy Phase 1"
            className="w-full bg-brand-secondary rounded-md p-3 text-white outline-none focus:ring-1 focus:ring-brand-primary shadow-inner placeholder:text-gray-700"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>

        {workouts.map((workout, wIndex) => (
          <div key={wIndex} className="bg-brand-surface rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-visible group">
            <div
              onClick={() => toggleWorkout(wIndex)}
              className={`p-4 flex justify-between items-center rounded-t-lg cursor-pointer hover:bg-white/5 transition-colors ${!expandedWorkouts[wIndex] ? 'rounded-b-lg' : ''}`}
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
                  <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${expandedWorkouts[wIndex] ? 'rotate-90' : '-rotate-90'}`} />
                </div>
              </div>
            </div>

            {expandedWorkouts[wIndex] && (
              <div className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
                {workout.exercises.map((ex, eIndex) => (
                  <div key={eIndex} className="bg-brand-secondary/30 rounded-xl p-4 shadow-inner relative group/ex transition-all border border-white/5">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-text-subtle uppercase font-black tracking-widest mb-1.5 block ml-1">Exercise</label>
                        <CustomSelect
                          options={exercisesMaster}
                          value={exercisesMaster.find((m) => m.id === ex.exercise_id)?.name || ''}
                          onChange={(val) => {
                            const masterEx = exercisesMaster.find((m) => m.name === val);
                            if (!masterEx) return;
                            const newWorkouts = [...workouts];
                            newWorkouts[wIndex].exercises[eIndex].exercise_id = masterEx.id;
                            setWorkouts(newWorkouts);
                          }}
                          placeholder="Search library..."
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
                  <Plus className="w-4 h-4" /> Add Exercise
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
            Add Workout
          </button>
          <button
            onClick={handleSave}
            disabled={actionLoading}
            className="flex-1 py-4 bg-brand-primary text-black rounded-md font-black uppercase text-xs tracking-widest shadow-elevated flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {actionLoading ? 'Saving...' : 'Save Plan'}
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
}
