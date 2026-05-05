'use client';

import { useState, useEffect, Suspense } from 'react';
import {
  Database, Plus, Settings, Dumbbell, Trash2,
  Users, UserCheck, Shield, BarChart3,
  CheckCircle2, XCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import CustomSelect from '@/components/ui/CustomSelect';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SettingsModal from '@/components/ui/SettingsModal';
import InviteCard from '@/components/ui/InviteCard';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';
import BottomNav from '@/components/ui/BottomNav';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SuspenseLoader from '@/components/ui/SuspenseLoader';
import { useSettingsModal } from '@/hooks/useSettingsModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { inviteTrainer } from '@/app/actions/invite';

type Tab = 'overview' | 'trainers' | 'students' | 'exercises';

const NAV_TABS = [
  { id: 'overview', label: 'Metrics', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'trainers', label: 'Trainers', icon: <Users className="w-5 h-5" /> },
  { id: 'students', label: 'Roster', icon: <Shield className="w-5 h-5" /> },
  { id: 'exercises', label: 'Library', icon: <Database className="w-5 h-5" /> },
];

function AdminDashboardContent({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();
  const { settingsOpen, setSettingsOpen } = useSettingsModal();

  const [metrics, setMetrics] = useState<any>(null);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exerciseFilter, setExerciseFilter] = useState('');

  const { confirmModal, openModal, closeModal, handleDelete, deletingId } = useDeleteConfirm(
    async (id) => {
      setActionLoading(true);
      const { error } = await supabase.from('exercise_master').delete().eq('id', id);
      if (!error) await fetchExercises();
      setActionLoading(false);
    }
  );

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
      .select('*, profiles:user_id (email, full_name)')
      .order('created_at', { ascending: false });
    if (!error) setTrainers(data);
  }

  async function fetchStudents() {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*, profiles:user_id (email, full_name), trainer:trainer_id (profiles:user_id (email, full_name))')
      .order('created_at', { ascending: false });
    if (!error) setStudents(data);
  }

  async function fetchExercises() {
    const [exercisesRes, groupsRes] = await Promise.all([
      supabase.from('exercise_master').select('*').order('name'),
      supabase.from('muscle_groups').select('*').order('name'),
    ]);
    if (!exercisesRes.error) setExercises(exercisesRes.data);
    if (!groupsRes.error) setMuscleGroups(groupsRes.data);
  }

  async function handleApproveTrainer(targetUserId: string) {
    setActionLoading(true);
    const { error } = await supabase.rpc('approve_trainer', { target_user_id: targetUserId });
    if (!error) await fetchTrainers();
    setActionLoading(false);
  }

  async function handleRevokeTrainer(targetUserId: string) {
    setActionLoading(true);
    const { error } = await supabase.rpc('revoke_trainer', { target_user_id: targetUserId });
    if (!error) await fetchTrainers();
    setActionLoading(false);
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard icon={<Dumbbell />} label="Exercises" value={metrics?.total_exercises || 0} color="text-brand-primary" />
        <MetricCard icon={<Users />} label="Total Trainers" value={metrics?.total_trainers || 0} color="text-brand-accent" />
        <MetricCard icon={<UserCheck />} label="Pending" value={metrics?.pending_trainers || 0} color="text-status-warning" />
        <MetricCard icon={<Shield />} label="Students" value={metrics?.total_students || 0} color="text-status-success" />
      </div>

      <div className="bg-brand-surface p-6 rounded-lg shadow-card">
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

  const TrainersTab = () => {
    async function handleInvite(email: string) {
      setActionLoading(true);
      try {
        await inviteTrainer(email);
        await fetchTrainers();
      } finally {
        setActionLoading(false);
      }
    }

    return (
      <div className="space-y-6">
        <InviteCard
          title="Invite New Trainer"
          placeholder="trainer@email.com"
          loading={actionLoading}
          onSubmit={handleInvite}
        />

        <div className="space-y-4">
          <SearchInput
            placeholder="Search trainers..."
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className="grid gap-3">
            {trainers.filter((t) => t.profiles.email.toLowerCase().includes(searchQuery.toLowerCase())).map((t) => (
              <div key={t.id} className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] flex justify-between items-center group transition-all duration-300 overflow-hidden">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white group-hover:text-brand-primary transition-colors truncate">{t.profiles.email}</h3>
                    {!t.is_approved && <span className="bg-status-warning/20 text-status-warning text-[9px] px-2 py-0.5 rounded-full uppercase font-bold shrink-0">Pending</span>}
                    {!t.is_active && <span className="bg-status-error/20 text-status-error text-[9px] px-2 py-0.5 rounded-full uppercase font-bold shrink-0">Revoked</span>}
                  </div>
                  <p className="text-[10px] text-text-subtle mt-1 uppercase tracking-wider font-medium">Trainer ID: {t.id.slice(0, 8)}</p>
                </div>
                <div className="flex gap-1">
                  {!t.is_approved && (
                    <button onClick={() => handleApproveTrainer(t.user_id)} disabled={actionLoading} className="p-2 text-status-success hover:bg-status-success/10 rounded-md transition-all disabled:opacity-50" title="Approve">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  {t.is_active && (
                    <button onClick={() => handleRevokeTrainer(t.user_id)} disabled={actionLoading} className="p-2 text-status-error hover:bg-status-error/10 rounded-md transition-all disabled:opacity-50" title="Revoke Access">
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {trainers.length === 0 && <EmptyState message="No trainers registered yet." />}
          </div>
        </div>
      </div>
    );
  };

  const StudentsTab = () => (
    <div className="space-y-4">
      <SearchInput
        placeholder="Search students..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="space-y-3">
        {students.filter((s) => s.profiles.email.includes(searchQuery)).map((s) => (
          <div key={s.id} className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] flex justify-between items-center group transition-all duration-300 overflow-hidden">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-white group-hover:text-brand-primary transition-colors truncate">{s.profiles.email}</h3>
              <p className="text-[10px] text-text-subtle mt-1 uppercase tracking-wider truncate">
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
      setActionLoading(true);
      const { error } = await supabase.from('exercise_master').insert([newEx]);
      if (!error) {
        setNewEx({ name: '', muscle_group: '', description: '' });
        await fetchExercises();
      }
      setActionLoading(false);
    }

    return (
      <div className="space-y-6">
        <form onSubmit={handleAdd} className="bg-brand-surface p-6 rounded-lg shadow-card space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Plus className="text-brand-primary w-5 h-5" />
            <h2 className="text-lg font-semibold">New Master Exercise</h2>
          </div>
          <div className="space-y-3">
            <input
              placeholder="Name (e.g. Deadlift)"
              className="w-full bg-brand-secondary shadow-inner rounded-md p-3 text-white outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
              value={newEx.name}
              onChange={(e) => setNewEx({ ...newEx, name: e.target.value })}
              required
              disabled={actionLoading}
            />
            <CustomSelect
              options={muscleGroups.map(g => ({ name: g.name }))}
              value={newEx.muscle_group}
              onChange={(val) => setNewEx({ ...newEx, muscle_group: val })}
              placeholder="Select Muscle Group"
              disabled={actionLoading}
            />
            <textarea
              placeholder="Description (Optional)"
              className="w-full bg-brand-secondary shadow-inner rounded-md p-3 text-white outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50 min-h-[100px] text-sm"
              value={newEx.description}
              onChange={(e) => setNewEx({ ...newEx, description: e.target.value })}
              disabled={actionLoading}
            />
          </div>
          <button
            type="submit"
            disabled={actionLoading}
            className="w-full bg-brand-primary text-black py-3 rounded-md font-bold uppercase text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-subtle hover:opacity-90 transition-opacity"
          >
            {actionLoading ? (
              <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Processing...</>
            ) : 'Add to Library'}
          </button>
        </form>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-brand-primary" />
              Library
            </h2>
            <CustomSelect
              options={[{ name: 'All Groups' }, ...muscleGroups]}
              value={exerciseFilter || 'All Groups'}
              onChange={(val) => setExerciseFilter(val === 'All Groups' ? '' : val)}
              className="w-44"
              placeholder="Filter"
            />
          </div>
          <div className="grid gap-3">
            {exercises.filter((ex) => !exerciseFilter || ex.muscle_group === exerciseFilter).map((ex) => (
              <div key={ex.id} className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] flex justify-between items-center group transition-all duration-300 overflow-hidden">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors truncate">{ex.name}</h3>
                    <span className="text-[8px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded uppercase font-bold tracking-widest whitespace-nowrap">{ex.muscle_group}</span>
                  </div>
                  {ex.description && <p className="text-[10px] text-text-subtle line-clamp-1 mt-1">{ex.description}</p>}
                </div>
                <div className="flex items-center shrink-0">
                  {deletingId === ex.id ? (
                    <div className="p-2">
                      <div className="w-4 h-4 border-2 border-status-error border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <button
                      onClick={() => openModal(ex.id)}
                      disabled={actionLoading}
                      className="p-2 text-status-error hover:bg-status-error/10 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                      title="Delete Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={closeModal}
          onConfirm={handleDelete}
          isLoading={actionLoading}
          title="Delete Exercise"
          message="Are you sure you want to remove this exercise from the master library? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-24">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Strength</h1>
          <p className="text-text-subtle text-sm uppercase tracking-widest font-bold mt-0.5">Admin Panel</p>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-full hover:bg-brand-surface text-white transition-all active:rotate-45"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {loading ? (
        <LoadingScreen fullPage={false} />
      ) : (
        <section className="animate-in fade-in duration-300">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'trainers' && <TrainersTab />}
          {activeTab === 'students' && <StudentsTab />}
          {activeTab === 'exercises' && <ExercisesTab />}
        </section>
      )}

      <BottomNav tabs={NAV_TABS} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as Tab)} />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        profile={{ role: 'admin', full_name: 'System Admin' }}
      />
    </main>
  );
}

export default function AdminDashboard({ user }: { user: any }) {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <AdminDashboardContent user={user} />
    </Suspense>
  );
}

function MetricCard({ icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.02] flex flex-col items-center justify-center text-center group transition-all duration-300 overflow-hidden">
      <div className={`${color} mb-2 group-hover:scale-110 transition-transform shrink-0`}>{icon}</div>
      <span className="text-2xl font-bold text-white leading-none truncate w-full px-1">{value}</span>
      <span className="text-[10px] uppercase text-text-subtle mt-1 font-bold tracking-wider group-hover:text-brand-primary transition-colors truncate w-full px-1">{label}</span>
    </div>
  );
}
