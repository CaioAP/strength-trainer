'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPlanPage() {
  const [planName, setPlanName] = useState('');
  const [workouts, setWorkouts] = useState([
    { name: 'Workout A', exercises: [{ name: '', sets: 3, reps: 10, load: 0, rest: 60 }] }
  ]);

  const addWorkout = () => {
    setWorkouts([...workouts, { name: `Workout ${String.fromCharCode(65 + workouts.length)}`, exercises: [] }]);
  };

  const addExercise = (wIndex: number) => {
    const newWorkouts = [...workouts];
    newWorkouts[wIndex].exercises.push({ name: '', sets: 3, reps: 10, load: 0, rest: 60 });
    setWorkouts(newWorkouts);
  };

  const removeExercise = (wIndex: number, eIndex: number) => {
    const newWorkouts = [...workouts];
    newWorkouts[wIndex].exercises.splice(eIndex, 1);
    setWorkouts(newWorkouts);
  };

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 hover:bg-brand-surface rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">Create New Plan</h1>
      </header>

      <div className="space-y-6 max-w-2xl mx-auto w-full">
        <div>
          <label className="block text-xs uppercase tracking-widest text-text-subtle mb-2">Plan Name</label>
          <input
            type="text"
            placeholder="e.g. Hypertrophy Phase 1"
            className="w-full bg-brand-surface border border-gray-800 rounded-md p-3 text-white outline-none focus:ring-1 focus:ring-brand-primary"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>

        {workouts.map((workout, wIndex) => (
          <div key={wIndex} className="bg-brand-surface rounded-lg border border-gray-800 overflow-hidden">
            <div className="bg-gray-800/50 p-3 flex justify-between items-center">
              <input
                className="bg-transparent font-semibold outline-none focus:text-brand-primary"
                value={workout.name}
                onChange={(e) => {
                  const newWorkouts = [...workouts];
                  newWorkouts[wIndex].name = e.target.value;
                  setWorkouts(newWorkouts);
                }}
              />
              <span className="text-[10px] text-text-subtle uppercase">Workout {wIndex + 1}</span>
            </div>

            <div className="p-4 space-y-4">
              {workout.exercises.map((ex, eIndex) => (
                <div key={eIndex} className="grid grid-cols-12 gap-2 items-end border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                  <div className="col-span-11 grid grid-cols-12 gap-2">
                    <div className="col-span-12">
                      <label className="text-[10px] text-text-subtle uppercase">Exercise Name</label>
                      <input
                        className="w-full bg-brand-secondary border border-gray-800 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-brand-primary"
                        value={ex.name}
                        onChange={(e) => {
                          const newWorkouts = [...workouts];
                          newWorkouts[wIndex].exercises[eIndex].name = e.target.value;
                          setWorkouts(newWorkouts);
                        }}
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-text-subtle uppercase">Sets</label>
                      <input
                        type="number"
                        className="w-full bg-brand-secondary border border-gray-800 rounded p-2 text-sm text-center"
                        value={ex.sets}
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-text-subtle uppercase">Reps</label>
                      <input
                        type="number"
                        className="w-full bg-brand-secondary border border-gray-800 rounded p-2 text-sm text-center"
                        value={ex.reps}
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-text-subtle uppercase">Load</label>
                      <input
                        type="number"
                        className="w-full bg-brand-secondary border border-gray-800 rounded p-2 text-sm text-center"
                        value={ex.load}
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-text-subtle uppercase">Rest (s)</label>
                      <input
                        type="number"
                        className="w-full bg-brand-secondary border border-gray-800 rounded p-2 text-sm text-center"
                        value={ex.rest}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeExercise(wIndex, eIndex)}
                    className="col-span-1 text-status-error p-2 hover:bg-status-error/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addExercise(wIndex)}
                className="w-full py-2 border border-dashed border-gray-700 rounded text-text-subtle hover:text-brand-primary hover:border-brand-primary transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> Add Exercise
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-4 pt-4 pb-12">
          <button
            onClick={addWorkout}
            className="flex-1 py-3 border border-brand-primary text-brand-primary rounded-md font-bold uppercase text-sm hover:bg-brand-primary/5"
          >
            Add Workout
          </button>
          <button className="flex-1 py-3 bg-brand-primary text-black rounded-md font-bold uppercase text-sm shadow-elevated flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Plan
          </button>
        </div>
      </div>
    </main>
  );
}
