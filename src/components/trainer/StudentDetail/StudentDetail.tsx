"use client";

import React from "react";
import {
  ChevronLeft, Activity,
  Dumbbell, Plus, FileText, ExternalLink,
  BarChart3, Clock, CheckCircle2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PlanAssignmentModal from "@/components/ui/PlanAssignmentModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import { useStudentDetail } from "./useStudentDetail";

interface StudentDetailProps {
  studentId: string;
}

export const StudentDetail = ({ studentId }: StudentDetailProps): React.JSX.Element => {
  const t = useTranslations("Trainer.StudentDetail");
  const {
    student,
    activePlan,
    history,
    trainerTemplates,
    loading,
    assignModalOpen,
    setAssignModalOpen,
    removeModalOpen,
    setRemoveModalOpen,
    actionLoading,
    handleRemovePlan,
    handleAssignTemplate,
    avgRpe,
    completedSessions,
    router,
  } = useStudentDetail(studentId);

  if (loading) return <LoadingScreen label={t("analyzing_stats")} />;

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
          <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label={t("compliance")} value={completedSessions.toString()} color="text-brand-primary" subLabel={t("sessions_done")} />
          <StatCard icon={<Activity className="w-5 h-5" />} label={t("avg_effort")} value={avgRpe} color="text-brand-accent" subLabel={t("overall_rpe")} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              {t("active_assignment")}
            </h2>
            {activePlan && (
              <div className="flex items-center gap-2">
                <button onClick={() => setAssignModalOpen(true)} className="text-[9px] font-black uppercase tracking-widest text-brand-primary hover:opacity-80 transition-all">
                  {t("assign_new")}
                </button>
                <span className="text-gray-800 text-[9px]">|</span>
                <Link href={`/trainer/plan/new?student_id=${studentId}`} className="text-[9px] font-black uppercase tracking-widest text-brand-accent hover:opacity-80 transition-all">
                  {t("custom")}
                </Link>
              </div>
            )}
          </div>

          {activePlan ? (
            <div className="bg-brand-surface p-5 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 flex justify-between items-center group">
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-brand-primary transition-colors">{activePlan.name}</h3>
                <p className="text-[10px] text-text-subtle uppercase font-black tracking-widest mt-1 opacity-60">
                  {t("assigned_on", { date: new Date(activePlan.created_at).toLocaleDateString() })}
                </p>
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
              <p className="text-sm text-text-subtle mb-6 font-medium leading-relaxed">
                {t("no_plan")}<br />{t("no_plan_desc")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setAssignModalOpen(true)}
                  className="flex-1 py-3 bg-brand-surface text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-card"
                >
                  {t("use_template")}
                </button>
                <Link
                  href={`/trainer/plan/new?student_id=${studentId}`}
                  className="flex-1 py-3 bg-brand-primary text-black rounded-md text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> {t("custom_plan")}
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-2 px-1">
            <BarChart3 className="w-3.5 h-3.5" />
            {t("session_history")}
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
                      {new Date(session.started_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
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

            {history.length === 0 && <EmptyState message={t("no_activity")} />}
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
        title={t("remove_plan_title")}
        message={t("remove_plan_message", { name: activePlan?.name || "" })}
        confirmText={t("Common.delete")}
        variant="danger"
        isLoading={actionLoading}
      />
    </main>
  );
};

function StatCard({ icon, label, value, color, subLabel }: { icon: React.ReactNode; label: string; value: string; color: string; subLabel: string }): React.JSX.Element {
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
