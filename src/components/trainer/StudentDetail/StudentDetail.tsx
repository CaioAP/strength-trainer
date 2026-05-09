"use client";

import React from "react";
import {
  ChevronLeft, Activity,
  Dumbbell, Plus, FileText, ChevronRight,
  BarChart3, Clock, CheckCircle2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PlanAssignmentModal from "@/components/ui/PlanAssignmentModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import EmptyState from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { useStudentDetail } from "./useStudentDetail";

interface StudentDetailProps {
  studentId: string;
}

export const StudentDetail = ({ studentId }: StudentDetailProps): React.JSX.Element => {
  const t = useTranslations("Trainer.StudentDetail");
  const ct = useTranslations("Common");
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
          <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">{student?.profiles?.email}</p>
        </div>
      </header>

      <section className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            icon={<CheckCircle2 className="w-5 h-5" />} 
            label={t("compliance")} 
            value={completedSessions.toString()} 
            color="text-brand-primary" 
            subLabel={t("sessions_done")} 
          />
          <StatCard 
            icon={<Activity className="w-5 h-5" />} 
            label={t("avg_effort")} 
            value={avgRpe} 
            color="text-brand-accent" 
            subLabel={t("overall_rpe")} 
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-subtle flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              {t("active_assignment")}
            </h2>
          </div>

          {activePlan ? (
            <div className="space-y-4">
              <Link
                href={`/trainer/plan/new?plan_id=${activePlan.id}&student_id=${studentId}`}
                className="block group w-full min-w-0"
              >
                <Card variant="interactive" padding="sm" className="flex justify-between items-center group w-full min-w-0">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-brand-primary transition-colors truncate">{activePlan.name}</h3>
                    <p className="text-xs text-text-subtle uppercase font-bold tracking-widest mt-1 opacity-60">
                      {t("assigned_on", { date: new Date(activePlan.created_at).toLocaleDateString() })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setRemoveModalOpen(true);
                      }}
                      className="bg-brand-secondary text-status-error hover:bg-status-error/10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <Button 
                    variant="secondary" 
                    fullWidth
                    onClick={() => setAssignModalOpen(true)} 
                  >
                    {t("assign_new")}
                  </Button>
                </div>
                <Link href={`/trainer/plan/new?student_id=${studentId}`} className="flex-1">
                  <Button variant="primary" fullWidth>
                    {t("custom")}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <Card variant="default" padding="lg" className="text-center">
              <div className="w-12 h-12 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-primary/10">
                <Dumbbell className="w-6 h-6 text-brand-primary opacity-40" />
              </div>
              <p className="text-sm text-text-subtle mb-6 font-medium leading-relaxed">
                {t("no_plan")}<br />{t("no_plan_desc")}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setAssignModalOpen(true)}
                >
                  {t("use_template")}
                </Button>
                <Link
                  href={`/trainer/plan/new?student_id=${studentId}`}
                  className="flex-1"
                >
                  <Button variant="primary" fullWidth className="gap-2">
                    <Plus className="w-3.5 h-3.5" /> {t("custom_plan")}
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4 pb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-subtle flex items-center gap-2 px-1">
            <BarChart3 className="w-3.5 h-3.5" />
            {t("session_history")}
          </h2>

          <div className="space-y-3">
            {history.map((session) => (
              <Card key={session.id} variant="interactive" padding="sm" className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-text-subtle" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm tracking-tight group-hover:text-brand-primary transition-colors">{session.workout?.name}</h3>
                      {session.workout?.plan?.name && (
                        <span className="text-xs px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded font-bold uppercase tracking-widest">
                          {session.workout.plan.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-subtle uppercase font-bold mt-1 opacity-60 tracking-wider">
                      {new Date(session.started_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                {session.effort_rpe && (
                  <div className="text-right">
                    <span className="text-brand-primary font-black text-sm">RPE {session.effort_rpe}</span>
                  </div>
                )}
              </Card>
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
        confirmText={ct("delete")}
        variant="danger"
        isLoading={actionLoading}
      />
    </main>
  );
};
