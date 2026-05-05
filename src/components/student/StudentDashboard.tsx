'use client';

import { Activity, Calendar, Settings, Dumbbell, Trophy, Loader2, Clock } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import SettingsModal from '@/components/ui/SettingsModal';
import EmptyState from '@/components/ui/EmptyState';
import BottomNav from '@/components/ui/BottomNav';
import SuspenseLoader from '@/components/ui/SuspenseLoader';
import Link from 'next/link';
import { useSettingsModal } from '@/hooks/useSettingsModal';
import { formatDuration } from '@/lib/utils/time';

type Tab = 'workout' | 'history';

const NAV_TABS = [
  { id: 'workout', label: 'Workout', icon: <Activity className="w-5 h-5" /> },
  { id: 'history', label: 'History', icon: <Calendar className="w-5 h-5" /> },
];

function DashboardContent({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('workout');
  const [profile, setProfile] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [weeklyExecutions, setWeeklyExecutions] = useState<any[]>([]);
  const [fullHistory, setFullHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const { settingsOpen, setSettingsOpen } = useSettingsModal();

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profileData) setProfile(profileData);

        const { data: sProf } = await supabase.from('student_profiles').select('id').eq('user_id', user.id).single();
        if (sProf) {
          if (activeTab === 'workout') {
            const { data: plan } = await supabase
              .from('plans')
              .select('id, name, workouts (id, name, plan_exercises (id))')
              .eq('student_id', sProf.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            if (plan) setActivePlan(plan);

            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
            startOfWeek.setHours(0, 0, 0, 0);

            const { data: executions } = await supabase
              .from('workout_executions')
              .select('started_at')
              .eq('student_id', sProf.id)
              .gte('started_at', startOfWeek.toISOString());

            if (executions) setWeeklyExecutions(executions);
          } else {
            const { data: history } = await supabase
              .from('workout_executions')
              .select('id, started_at, completed_at, effort_rpe, workout:workout_id (name, plan:plan_id (name))')
              .eq('student_id', sProf.id)
              .order('started_at', { ascending: false });

            if (history) setFullHistory(history);
          }
        }
      } catch (err) {
        console.error('Error initializing student dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [supabase, user.id, activeTab]);

  const hasWorkedOutOn = (dayIndex: number) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));

    return weeklyExecutions.some((ex) => {
      const exDate = new Date(ex.started_at);
      return (
        exDate.getDate() === startOfWeek.getDate() + dayIndex &&
        exDate.getMonth() === startOfWeek.getMonth()
      );
    });
  };

  const WorkoutView = () => (
    <section className="space-y-8 animate-in fade-in duration-500">
      {activePlan ? (
        <div className="space-y-6">
          <div className="px-1">
            <div className="flex items-center gap-3 mb-1">
              <Activity className="text-brand-primary w-4 h-4" />
              <h2 className="text-[10px] uppercase font-black tracking-widest text-text-subtle">Active Plan</h2>
            </div>
            <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">{activePlan.name}</h1>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-text-subtle px-1">Available Workouts</h3>
            <div className="grid gap-4">
              {activePlan.workouts?.map((workout: any) => (
                <Link
                  key={workout.id}
                  href={`/student/session?workout_id=${workout.id}`}
                  className="bg-brand-surface p-5 rounded-lg shadow-card hover:shadow-card-hover group hover:scale-[1.01] transition-all duration-300 active:scale-[0.98] overflow-hidden"
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="text-white text-lg font-bold tracking-tight group-hover:text-brand-primary transition-colors truncate">{workout.name}</p>
                      <p className="text-brand-accent text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-2 opacity-70 truncate">
                        <Dumbbell className="w-3 h-3 shrink-0" />
                        {workout.plan_exercises?.length || 0} exercises
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center group-hover:bg-brand-primary/10 transition-all shrink-0">
                      <Activity className="w-4 h-4 text-brand-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-brand-surface rounded-lg shadow-card animate-in fade-in duration-700">
          <Dumbbell className="w-12 h-12 text-gray-700 mb-4" />
          <p className="text-text-subtle font-black uppercase tracking-widest text-sm text-center px-8 leading-relaxed">No plan assigned.<br />Contact your trainer to start.</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-[10px] uppercase font-black tracking-widest text-text-subtle px-1">Weekly Progress</h3>
        <div className="bg-brand-surface p-5 rounded-lg grid grid-cols-7 gap-2 shadow-card hover:shadow-card-hover transition-all duration-300">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[8px] font-black text-text-subtle uppercase">{day}</span>
              <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-500 ${
                hasWorkedOutOn(i) ? 'bg-brand-primary shadow-[0_0_10px_rgba(206,255,5,0.3)]' : 'bg-brand-secondary'
              }`}>
                {hasWorkedOutOn(i) && <Trophy className="w-4 h-4 text-black" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const HistoryView = () => (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="px-1">
        <h2 className="text-[10px] uppercase font-black tracking-widest text-brand-primary mb-1">Session History</h2>
        <p className="text-2xl font-black text-white italic uppercase tracking-tighter">Your Journey</p>
      </div>

      <div className="grid gap-4 pb-8">
        {fullHistory.map((session) => (
          <div key={session.id} className="bg-brand-surface p-4 rounded-lg flex justify-between items-center group shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 overflow-hidden">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white tracking-tight truncate">{session.workout?.name}</h3>
                  {session.workout?.plan?.name && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded font-black uppercase tracking-widest whitespace-nowrap shrink-0">
                      {session.workout.plan.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-[10px] text-text-subtle uppercase font-black tracking-widest whitespace-nowrap">
                    {new Date(session.started_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-gray-700 shrink-0" />
                  <p className="text-[10px] text-brand-accent uppercase font-black tracking-widest whitespace-nowrap">
                    {formatDuration(session.started_at, session.completed_at)}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              {session.effort_rpe ? (
                <div className="flex flex-col items-end">
                  <span className="text-brand-primary font-black text-xs">RPE {session.effort_rpe}</span>
                  <span className="text-[8px] text-text-subtle uppercase font-bold tracking-tighter">Effort</span>
                </div>
              ) : (
                <span className="text-[10px] text-status-warning uppercase font-bold tracking-widest italic opacity-50">Incomplete</span>
              )}
            </div>
          </div>
        ))}

        {fullHistory.length === 0 && <EmptyState message="No sessions logged yet." />}
      </div>
    </section>
  );

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-24">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary leading-tight font-black uppercase italic tracking-tighter">Strength</h1>
          <p className="text-text-subtle text-sm font-medium">
            {loading ? 'Synchronizing...' : `Ready, ${profile?.full_name?.split(' ')[0] || 'Student'}?`}
          </p>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-full hover:bg-brand-surface text-white transition-all active:rotate-45"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {loading && (activeTab === 'workout' ? !activePlan : fullHistory.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text-subtle text-xs uppercase tracking-widest font-bold">Synchronizing...</p>
        </div>
      ) : (
        <div className="flex-1 p-1">
          {activeTab === 'workout' ? <WorkoutView /> : <HistoryView />}
        </div>
      )}

      <BottomNav tabs={NAV_TABS} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as Tab)} />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        profile={profile}
      />
    </main>
  );
}

export default function StudentDashboard({ user }: { user: any }) {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <DashboardContent user={user} />
    </Suspense>
  );
}
