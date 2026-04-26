'use client';

import { Activity, Calendar, Settings } from 'lucide-react';

export default function StudentDashboard({ user }: { user: any }) {
  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-20">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Strength</h1>
          <p className="text-text-subtle text-sm">Welcome back!</p>
        </div>
        <button className="p-2 rounded-full hover:bg-brand-surface">
          <Settings className="w-6 h-6 text-white" />
        </button>
      </header>

      <section className="space-y-6">
        {/* Today's Workout Card */}
        <div className="bg-brand-surface p-6 rounded-lg border border-gray-800 shadow-elevated">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-brand-primary w-5 h-5" />
            <h2 className="text-lg font-semibold">Today's Session</h2>
          </div>
          <p className="text-white text-xl font-bold mb-1">Upper Body Power A</p>
          <p className="text-text-subtle text-sm mb-6">6 exercises • ~45 mins</p>
          
          <button className="w-full touch-target bg-brand-primary text-black font-bold rounded-md hover:opacity-90 transition-all uppercase">
            Start Workout
          </button>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-accent" />
            Your Week
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase text-text-subtle">{day}</span>
                <div className={`w-8 h-8 rounded-full border ${i === 2 ? 'bg-brand-primary border-brand-primary' : 'border-gray-800 bg-brand-surface'} flex items-center justify-center`}>
                  {i === 2 && <div className="w-2 h-2 bg-black rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-gray-800 p-2 flex justify-around items-center">
        <button className="flex flex-col items-center p-2 text-brand-primary">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] uppercase mt-1">Workout</span>
        </button>
        <button className="flex flex-col items-center p-2 text-text-subtle">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] uppercase mt-1">History</span>
        </button>
      </nav>
    </main>
  );
}
