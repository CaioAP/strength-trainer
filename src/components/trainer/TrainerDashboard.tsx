'use client';

import { useState, useEffect, Suspense } from 'react';
import { Users, Settings, Dumbbell, ChevronRight, FileText, Trash2, Loader2, Plus } from 'lucide-react';
import { inviteStudent } from '@/app/actions/invite';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SettingsModal from '@/components/ui/SettingsModal';
import InviteCard from '@/components/ui/InviteCard';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';
import BottomNav from '@/components/ui/BottomNav';
import SuspenseLoader from '@/components/ui/SuspenseLoader';
import { useSettingsModal } from '@/hooks/useSettingsModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';

type Tab = 'students' | 'templates';

const NAV_TABS = [
  { id: 'students', label: 'Students', icon: <Users className="w-5 h-5" /> },
  { id: 'templates', label: 'Templates', icon: <FileText className="w-5 h-5" /> },
];

function DashboardContent({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('students');
  const [students, setStudents] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();
  const { settingsOpen, setSettingsOpen } = useSettingsModal();

  const { confirmModal, openModal, closeModal, handleDelete, deletingId } = useDeleteConfirm(
    async (id) => {
      setActionLoading(true);
      const { error } = await supabase.from('plans').delete().eq('id', id);
      if (!error) await fetchTemplates();
      setActionLoading(false);
    }
  );

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    }
    fetchProfile();

    if (activeTab === 'students') fetchStudents();
    else if (activeTab === 'templates') fetchTemplates();
  }, [activeTab]);

  async function fetchStudents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_profiles')
      .select('id, status, profiles:user_id (email, full_name)')
      .order('created_at', { ascending: false });
    if (!error) setStudents(data);
    setLoading(false);
  }

  async function fetchTemplates() {
    setLoading(true);
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_template', true)
      .order('created_at', { ascending: false });
    if (!error) setTemplates(data);
    setLoading(false);
  }

  const handleInvite = async (email: string) => {
    setActionLoading(true);
    try {
      await inviteStudent(email);
      await fetchStudents();
    } finally {
      setActionLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-24">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Strength</h1>
          <p className="text-text-subtle text-sm uppercase tracking-widest font-bold mt-0.5">Trainer Portal</p>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-full hover:bg-brand-surface text-white transition-all active:rotate-45"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {loading && (activeTab === 'students' ? students.length === 0 : templates.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text-subtle text-xs uppercase tracking-widest font-bold">Synchronizing...</p>
        </div>
      ) : (
        <div className="flex-1 p-1">
          {activeTab === 'students' ? (
            <section className="space-y-6 animate-in fade-in duration-300">
              <InviteCard
                title="Invite New Student"
                placeholder="student@email.com"
                loading={actionLoading}
                onSubmit={handleInvite}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-primary" />
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-text-subtle">My Students ({filteredStudents.length})</h2>
                  </div>
                </div>
                
                <SearchInput 
                  placeholder="Search students..." 
                  value={searchQuery} 
                  onChange={setSearchQuery} 
                />

                <div className="grid gap-3">
                  {filteredStudents.map((student) => (
                    <Link
                      key={student.id}
                      href={`/trainer/student/${student.id}`}
                      className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 flex items-center justify-between group overflow-hidden"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center group-hover:bg-brand-primary/10 transition-all font-black text-brand-primary text-xs italic shrink-0">
                          {student.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white tracking-tight group-hover:text-brand-primary transition-colors truncate">{student.profiles?.full_name || 'Pending Name'}</p>
                          <p className="text-[10px] text-text-subtle lowercase truncate">{student.profiles?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                          student.status === 'active'
                            ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                            : 'bg-status-warning/10 text-status-warning border-status-warning/20'
                        }`}>
                          {student.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                  {filteredStudents.length === 0 && <EmptyState message="No students found." />}
                </div>
              </div>
            </section>
          ) : (
            <section className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-primary" />
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-text-subtle">Workout Templates</h2>
                </div>
                <Link
                  href="/trainer/plan/new"
                  className="p-1.5 bg-brand-primary text-black rounded-md hover:opacity-90 transition-all shadow-card hover:shadow-card-hover"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid gap-3">
                {templates.map((template) => (
                  <div key={template.id} className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 flex items-center justify-between group overflow-hidden">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/10 transition-all shrink-0">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white tracking-tight group-hover:text-brand-primary transition-colors truncate">{template.name}</p>
                        <p className="text-[10px] text-text-subtle uppercase tracking-widest font-bold truncate">
                          {new Date(template.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openModal(template.id)}
                      className="p-2 text-text-subtle hover:text-status-error transition-colors shrink-0 ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {templates.length === 0 && <EmptyState message="No templates created yet." />}
              </div>
            </section>
          )}
        </div>
      )}

      <BottomNav tabs={NAV_TABS} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as Tab)} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete Template"
        message="Are you sure you want to delete this workout template? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={actionLoading && deletingId === confirmModal.id}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        profile={profile}
      />
    </main>
  );
}

export default function TrainerDashboard({ user }: { user: any }) {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <DashboardContent user={user} />
    </Suspense>
  );
}
