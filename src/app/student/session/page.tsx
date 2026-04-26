'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Check, Timer, Info, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function ActiveSessionPage() {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});

  const exercise = {
    name: 'Barbell Back Squat',
    sets: 3,
    reps: 10,
    load: 100,
    rest: 90,
    instructions: 'Keep your chest up and drive through your heels.'
  };

  const toggleSet = (setNum: number) => {
    const key = `${activeExerciseIndex}-${setNum}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <header className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 hover:bg-brand-surface rounded">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-semibold truncate max-w-[150px]">Upper Body A</span>
        </div>
        <div className="flex items-center gap-2 text-brand-primary">
          <Timer className="w-4 h-4" />
          <span className="text-sm font-mono">00:45</span>
        </div>
        <button className="p-1">
          <MoreVertical className="w-5 h-5 text-text-subtle" />
        </button>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-800">
        <div className="h-full bg-brand-primary w-1/3 transition-all duration-300" />
      </div>

      <div className="p-4 flex-1 flex flex-col space-y-6">
        {/* Exercise Header */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-white leading-tight">
              {exercise.name}
            </h1>
            <button className="p-2 bg-brand-surface rounded-full text-brand-accent">
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-text-subtle text-sm italic">
            "{exercise.instructions}"
          </p>
        </div>

        {/* Set Logger */}
        <div className="space-y-3">
          {[...Array(exercise.sets)].map((_, i) => {
            const isCompleted = completedSets[`${activeExerciseIndex}-${i + 1}`];
            return (
              <div 
                key={i} 
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  isCompleted 
                  ? 'bg-brand-primary/10 border-brand-primary' 
                  : 'bg-brand-surface border-gray-800'
                }`}
              >
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-text-subtle font-bold">Set {i + 1}</span>
                    <div className="flex items-baseline gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold">{exercise.reps}</span>
                        <span className="text-xs text-text-subtle">REPS</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold">{exercise.load}</span>
                        <span className="text-xs text-text-subtle">KG</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => toggleSet(i + 1)}
                    className={`touch-target w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted 
                      ? 'bg-brand-primary border-brand-primary text-black' 
                      : 'border-gray-700 text-transparent'
                    }`}
                  >
                    <Check className="w-6 h-6" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modification hint */}
        <p className="text-center text-[10px] text-text-subtle uppercase tracking-widest">
          Tap numbers to modify for this session
        </p>
      </div>

      {/* Footer Controls */}
      <footer className="p-4 bg-brand-surface border-t border-gray-800 flex gap-4">
        <button className="flex-1 py-4 bg-gray-800 text-white rounded-md font-bold uppercase text-sm">
          Previous
        </button>
        <button className="flex-[2] py-4 bg-brand-primary text-black rounded-md font-bold uppercase text-sm shadow-elevated">
          Next Exercise
        </button>
      </footer>
    </main>
  );
}
