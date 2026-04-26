'use client';

import { useState, useEffect } from 'react';
import { 
  Database, Plus, Settings, Dumbbell, Trash2, 
  Users, UserCheck, Shield, BarChart3, Search, 
  CheckCircle2, XCircle, MoreVertical
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Tab = 'overview' | 'trainers' | 'students' | 'exercises';

export default function AdminDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exerciseFilter, setExerciseFilter] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    if (activeTab === 'overview') await fetchMetrics();
    else if (activeTab === 'trainers') await fetchTrainers();
    else if (activeTab === 'students') await fetchStudents();
    else if (activeTab === 'exercises') await fetchExercises();
    setLoading(false);
  }

  async function fetchMetrics() {
    const { data, error } = await supabase.rpc('get_admin_metrics');
    if (!error) setMetrics(data);
  }

  async function fetchTrainers() {
    const { data, error } = await supabase
      .from('trainer_profiles')
      .select(`
        *,
        profiles:user_id (email, full_name)
      `)
      .order('created_at', { ascending: false });
    
    if (!error) setTrainers(data);
  }

  async function fetchStudents() {
    const { data, error } = await supabase
      .from('student_profiles')
      .select(`
        *,
        profiles:user_id (email, full_name),
        trainer:trainer_id (
          profiles:user_id (email, full_name)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (!error) setStudents(data);
  }

  async function fetchExercises() {
    const { data, error } = await supabase
      .from('exercise_master')
      .select('*')
      .order('name');
    
    if (!error) setExercises(data);
  }

  async function handleApproveTrainer(targetUserId: string) {
    const { error } = await supabase.rpc('approve_trainer', { target_user_id: targetUserId });
    if (!error) fetchTrainers();
  }

  async function handleRevokeTrainer(targetUserId: string) {
    const { error } = await supabase.rpc('revoke_trainer', { target_user_id: targetUserId });
    if (!error) fetchTrainers();
  }

  // --- Sub-components for Tabs ---

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard icon={<Dumbbell />} label="Exercises" value={metrics?.total_exercises || 0} color="text-brand-primary" />
        <MetricCard icon={<Users />} label="Total Trainers" value={metrics?.total_trainers || 0} color="text-brand-accent" />
        <MetricCard icon={<UserCheck />} label="Pending" value={metrics?.pending_trainers || 0} color="text-status-warning" />
        <MetricCard icon={<Shield />} label="Students" value={metrics?.total_students || 0} color="text-status-success" />
      </div>

      <div className="bg-brand-surface p-6 rounded-lg border border-gray-800">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-primary" />
          Platform Health
        </h3>
        <p className="text-sm text-text-subtle">
          Standardized exercises and secure trainer onboarding are scaling as expected. 
          Audit logs track all critical administrative overrides.
        </p>
      </div>
    </div>
  );

  const TrainersTab = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
        <input 
          placeholder="Search trainers..."
          className="w-full bg-brand-surface border border-gray-800 rounded-md py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-brand-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {trainers.filter(t => t.profiles.email.includes(searchQuery)).map(t => (
          <div key={t.id} className="bg-brand-surface p-4 rounded-lg border border-gray-800 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">{t.profiles.email}</h3>
                {!t.is_approved && <span className="bg-status-warning/20 text-status-warning text-[10px] px-2 py-0.5 rounded-full uppercase">Pending</span>}
                {!t.is_active && <span className="bg-status-error/20 text-status-error text-[10px] px-2 py-0.5 rounded-full uppercase">Revoked</span>}
              </div>
              <p className="text-[10px] text-text-subtle mt-1 uppercase tracking-wider">Trainer ID: {t.id.slice(0,8)}...</p>
            </div>
            <div className="flex gap-2">
              {!t.is_approved && (
                <button 
                  onClick={() => handleApproveTrainer(t.user_id)}
                  className="p-2 text-status-success hover:bg-status-success/10 rounded"
                  title="Approve"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
              {t.is_active && (
                <button 
                  onClick={() => handleRevokeTrainer(t.user_id)}
                  className="p-2 text-status-error hover:bg-status-error/10 rounded"
                  title="Revoke"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StudentsTab = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
        <input 
          placeholder="Search students..."
          className="w-full bg-brand-surface border border-gray-800 rounded-md py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-brand-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {students.filter(s => s.profiles.email.includes(searchQuery)).map(s => (
          <div key={s.id} className="bg-brand-surface p-4 rounded-lg border border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-white">{s.profiles.email}</h3>
              <p className="text-[10px] text-text-subtle mt-1 uppercase tracking-wider">
                Trainer: {s.trainer?.profiles?.email || 'Unassigned'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ExercisesTab = () => {
    const [newEx, setNewEx] = useState({ name: '', muscle_group: '', description: '' });

    async function handleAdd(e: React.FormEvent) {
      e.preventDefault();
      const { error } = await supabase.from('exercise_master').insert([newEx]);
      if (!error) {
        setNewEx({ name: '', muscle_group: '', description: '' });
        fetchExercises();
      }
    }

    return (
      <div className="space-y-6">
        <form onSubmit={handleAdd} className="bg-brand-surface p-6 rounded-lg border border-gray-800 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <Plus className="text-brand-primary w-5 h-5" />
            <h2 className="text-lg font-semibold">New Master Exercise</h2>
          </div>
          <input
            placeholder="Name (e.g. Deadlift)"
            className="w-full bg-brand-secondary border border-gray-800 rounded-md p-2 text-white outline-none focus:ring-1 focus:ring-brand-primary"
            value={newEx.name}
            onChange={(e) => setNewEx({ ...newEx, name: e.target.value })}
            required
          />
          <input
            placeholder="Muscle Group (e.g. Legs)"
            className="w-full bg-brand-secondary border border-gray-800 rounded-md p-2 text-white outline-none focus:ring-1 focus:ring-brand-primary"
            value={newEx.muscle_group}
            onChange={(e) => setNewEx({ ...newEx, muscle_group: e.target.value })}
          />
          <button type="submit" className="w-full bg-brand-primary text-black py-2 rounded-md font-bold uppercase text-sm">
            Add to Library
          </button>
        </form>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Library</h2>
            <select 
              className="bg-brand-surface border border-gray-800 rounded p-1 text-xs outline-none"
              value={exerciseFilter}
              onChange={(e) => setExerciseFilter(e.target.value)}
            >
              <option value="">All Groups</option>
              {Array.from(new Set(exercises.map(ex => ex.muscle_group).filter(Boolean))).map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-3">
            {exercises.filter(ex => !exerciseFilter || ex.muscle_group === exerciseFilter).map((ex) => (
              <div key={ex.id} className="bg-brand-surface p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white">{ex.name}</h3>
                  <p className="text-[10px] text-text-subtle uppercase tracking-wider">{ex.muscle_group || 'Uncategorized'}</p>
                </div>
                <button className="p-2 text-status-error hover:bg-status-error/10 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-24">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Strength</h1>
          <p className="text-text-subtle text-sm uppercase tracking-widest font-medium">Admin Panel</p>
        </div>
        <button className="p-2 rounded-full hover:bg-brand-surface">
          <Settings className="w-6 h-6 text-white" />
        </button>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <section className="animate-in fade-in duration-300">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'trainers' && <TrainersTab />}
          {activeTab === 'students' && <StudentsTab />}
          {activeTab === 'exercises' && <ExercisesTab />}
        </section>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-gray-800 p-2 flex justify-around items-center z-50 shadow-2xl">
        <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BarChart3 />} label="Metrics" />
        <NavButton active={activeTab === 'trainers'} onClick={() => setActiveTab('trainers')} icon={<Users />} label="Trainers" />
        <NavButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Shield />} label="Roster" />
        <NavButton active={activeTab === 'exercises'} onClick={() => setActiveTab('exercises')} icon={<Database />} label="Library" />
      </nav>
    </main>
  );
}

function MetricCard({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <div className="bg-brand-surface p-4 rounded-lg border border-gray-800 flex flex-col items-center justify-center text-center">
      <div className={`${color} mb-2`}>{icon}</div>
      <span className="text-2xl font-bold text-white leading-none">{value}</span>
      <span className="text-[10px] uppercase text-text-subtle mt-1 font-bold tracking-wider">{label}</span>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center p-2 transition-colors ${active ? 'text-brand-primary' : 'text-text-subtle'}`}
    >
      {icon}
      <span className="text-[9px] uppercase mt-1 font-bold">{label}</span>
    </button>
  );
}
