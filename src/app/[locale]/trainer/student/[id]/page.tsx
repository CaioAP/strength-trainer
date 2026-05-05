'use client';

import { useState, useEffect, use } from 'react';
import {
  ChevronLeft, Activity, Trophy,
  Dumbbell, Plus, FileText, ExternalLink,
  BarChart3, Clock, CheckCircle2,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import PlanAssignmentModal from '@/components/ui/PlanAssignmentModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import LoadingScreen from '@/components/ui/LoadingScreen';
import EmptyState from '@/components/ui/EmptyState';

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [student, setStudent] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [trainerTemplates, setTrainerTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [supabase, studentId]);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: sData } = await supabase
        .from('student_profiles')
        .select('id, status, profiles:user_id (email, full_name)')
        .eq('id', studentId)
        .single();
      if (sData) setStudent(sData);

      const { data: plan } = await supabase
        .from('plans')
        .select('id, name, created_at')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setActivePlan(plan);

      const { data: executions } = await supabase
        .from('workout_executions')
        .select('id, started_at, completed_at, effort_rpe, workout:workout_id (name, plan:plan_id (name))')
        .eq('student_id', studentId)
        .order('started_at', { ascending: false });
      if (executions) setHistory(executions);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: templates } = await supabase
          .from('plans')
          .select('id, name, description')
          .eq('is_template', true)
          .order('name');
        if (templates) setTrainerTemplates(templates);
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleRemovePlan = async () => {
    if (!activePlan) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from('plans').delete().eq('id', activePlan.id);
      if (error) throw error;
      await fetchData();
      setRemoveModalOpen(false);
    } catch (err) {
      console.error('Error removing plan:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTemplate = async (templateId: string) => {
    setActionLoading(true);
    try {
      const { data: template, error: tErr } = await supabase
        .from('plans')
        .select('name, workouts (name, order_index, plan_exercises (exercise_id, sets, reps, load, rest_seconds, order_index))')
        .eq('id', templateId)
        .single();
      if (tErr) throw tErr;

      const { data: { user } } = await supabase.auth.getUser();
      const { data: trainerProf } = await supabase.from('trainer_profiles').select('id').eq('user_id', user?.id).single();

      const { data: newPlan, error: pErr } = await supabase
        .from('plans')
        .insert([{ name: template.name, trainer_id: trainerProf?.id, student_id: studentId, is_template: false }])
        .select()
        .single();
      if (pErr) throw pErr;

      for (const w of template.workouts) {
        const { data: newWorkout, error: wErr } = await supabase
          .from('workouts')
          .insert([{ plan_id: newPlan.id, name: w.name, order_index: w.order_index }])
          .select()
          .single();
        if (wErr) throw wErr;

        await supabase.from('plan_exercises').insert(
          w.plan_exercises.map((ex: any) => ({ ...ex, workout_id: newWorkout.id }))
        );
      }

      await fetchData();
      setAssignModalOpen(false);
    } catch (err) {
      console.error('Error cloning template:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const avgRpe = history.length > 0
    ? (history.reduce((acc, curr) => acc + (curr.effort_rpe || 0), 0) / history.filter((h) => h.effort_rpe).length).toFixed(1)
    : '--';

  const completedSessions = history.filter((h) => h.completed_at).length;

  if (loading) return <LoadingScreen label="Analyzing stats..." />;

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-20">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 hover:bg-brand-surface rounded-full transition-colors group">
          <ChevronLeft className="w-6 h-6 text-text-subtle group-hover:text-white transition-colors" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight italic">{student?.profiles?.full_name}</h1>
          <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{student?.profiles?.email}</p>
        </div>
      </header>

      <section className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Compliance" value={completedSessions.toString()} color="text-brand-primary" subLabel="Sessions done" />
          <StatCard icon={<Activity className="w-5 h-5" />} label="Avg. Effort" value={avgRpe} color="text-brand-accent" subLabel="Overall RPE" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Active Assignment
            </h2>
            {activePlan && (
              <div className="flex items-center gap-2">
                <button onClick={() => setAssignModalOpen(true)} className="text-[9px] font-black uppercase tracking-widest text-brand-primary hover:opacity-80 transition-all">
                  Assign New
                </button>
                <span className="text-gray-800 text-[9px]">|</span>
                <Link href={`/trainer/plan/new?student_id=${studentId}`} className="text-[9px] font-black uppercase tracking-widest text-brand-accent hover:opacity-80 transition-all">
                  Custom
                </Link>
              </div>
            )}
          </div>

          {activePlan ? (
            <div className="bg-brand-surface p-5 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 flex justify-between items-center group">
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-brand-primary transition-colors">{activePlan.name}</h3>
                <p className="text-[10px] text-text-subtle uppercase font-black tracking-widest mt-1 opacity-60">Assigned {new Date(activePlan.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/trainer/plan/new?plan_id=${activePlan.id}&student_id=${studentId}`)}
                  className="p-3 bg-brand-secondary rounded-md text-brand-primary shadow-card hover:shadow-card-hover transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRemoveModalOpen(true)}
                  className="p-3 bg-brand-secondary rounded-md text-status-error shadow-card hover:shadow-card-hover hover:bg-status-error/10 transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-brand-surface p-8 rounded-lg shadow-card text-center">
              <div className="w-12 h-12 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-primary/10">
                <Dumbbell className="w-6 h-6 text-brand-primary opacity-40" />
              </div>
              <p className="text-sm text-text-subtle mb-6 font-medium leading-relaxed">No plan assigned yet.<br />Start training by picking a starting point.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setAssignModalOpen(true)}
                  className="flex-1 py-3 bg-brand-surface text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-card"
                >
                  Use Template
                </button>
                <Link
                  href={`/trainer/plan/new?student_id=${studentId}`}
                  className="flex-1 py-3 bg-brand-primary text-black rounded-md text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Custom Plan
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-2 px-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Session History
          </h2>

          <div className="space-y-3">
            {history.map((session) => (
              <div key={session.id} className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-text-subtle" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm tracking-tight group-hover:text-brand-primary transition-colors">{session.workout?.name}</h3>
                      {session.workout?.plan?.name && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded font-black uppercase tracking-widest">
                          {session.workout.plan.name}
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-text-subtle uppercase font-black mt-1 opacity-60 tracking-wider">
                      {new Date(session.started_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {session.effort_rpe && (
                  <div className="text-right">
                    <span className="text-brand-primary font-black text-sm">RPE {session.effort_rpe}</span>
                  </div>
                )}
              </div>
            ))}

            {history.length === 0 && <EmptyState message="No activity recorded." />}
          </div>
        </div>
      </section>

      <PlanAssignmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        templates={trainerTemplates}
        onAssign={handleAssignTemplate}
        isLoading={actionLoading}
      />

      <ConfirmationModal
        isOpen={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        onConfirm={handleRemovePlan}
        title="Remove Plan"
        message={`Are you sure you want to remove the plan "${activePlan?.name}"? This action cannot be undone.`}
        confirmText="Remove"
        variant="danger"
        isLoading={actionLoading}
      />
    </main>
  );
}

function StatCard({ icon, label, value, color, subLabel }: { icon: any; label: string; value: string; color: string; subLabel: string }) {
  return (
    <div className="bg-brand-surface p-5 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.02] flex flex-col items-center justify-center text-center relative overflow-hidden group transition-all duration-300">
      <div className={`${color} mb-2 transition-transform group-hover:scale-110 duration-500`}>{icon}</div>
      <span className="text-3xl font-black text-white leading-none tracking-tighter italic">{value}</span>
      <div className="mt-2">
        <span className="text-[9px] uppercase text-white font-black tracking-widest block group-hover:text-brand-primary transition-colors">{label}</span>
        <span className="text-[8px] uppercase text-text-subtle font-bold tracking-tighter opacity-60 block mt-0.5">{subLabel}</span>
      </div>
      <div className={`absolute top-0 right-0 w-8 h-8 ${color} opacity-5 -mr-4 -mt-4 rounded-full blur-xl`} />
    </div>
  );
}
