"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";
import {
  Database,
  Settings,
  Users,
  Shield,
  BarChart3,
} from "lucide-react";
import SettingsModal from "@/components/ui/SettingsModal";
import BottomNav from "@/components/ui/BottomNav";
import LoadingScreen from "@/components/ui/LoadingScreen";
import SuspenseLoader from "@/components/ui/SuspenseLoader";
import { useSettingsModal } from "@/hooks/useSettingsModal";
import { useAdminDashboard } from "./useAdminDashboard";
import OverviewTab from "./OverviewTab";
import TrainersTab from "./TrainersTab";
import StudentsTab from "./StudentsTab";
import ExercisesTab from "./ExercisesTab";
import { Tab, NavTab } from "./AdminDashboard.types";

interface AdminDashboardProps {
  user: {
    id: string;
    email?: string;
  };
}

function AdminDashboardContent({ user }: AdminDashboardProps): React.JSX.Element {
  const t = useTranslations("Admin.Tabs");
  const ct = useTranslations("Common");
  
  const {
    activeTab,
    setActiveTab,
    loading,
    actionLoading,
    metrics,
    trainers,
    students,
    exercises,
    muscleGroups,
    searchQuery,
    setSearchQuery,
    exerciseFilter,
    setExerciseFilter,
    newEx,
    setNewEx,
    handleApproveTrainer,
    handleRevokeTrainer,
    handleInviteTrainer,
    handleAddExercise,
    confirmModal,
    openModal,
    closeModal,
    handleDelete,
    deletingId,
  } = useAdminDashboard();

  const { settingsOpen, setSettingsOpen } = useSettingsModal();

  const NAV_TABS: NavTab[] = [
    { id: "overview", label: t("metrics"), icon: <BarChart3 className="w-5 h-5" /> },
    { id: "trainers", label: t("trainers"), icon: <Users className="w-5 h-5" /> },
    { id: "students", label: t("roster"), icon: <Shield className="w-5 h-5" /> },
    { id: "exercises", label: t("library"), icon: <Database className="w-5 h-5" /> },
  ];

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-24">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">{ct("title")}</h1>
          <p className="text-text-subtle text-sm uppercase tracking-widest font-bold mt-0.5">
            {ct("admin_panel")}
          </p>
        </div>
        <button
          type="button"
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
          {activeTab === "overview" && <OverviewTab metrics={metrics} />}
          {activeTab === "trainers" && (
            <TrainersTab 
              trainers={trainers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              actionLoading={actionLoading}
              onInvite={handleInviteTrainer}
              onApprove={handleApproveTrainer}
              onRevoke={handleRevokeTrainer}
            />
          )}
          {activeTab === "students" && (
            <StudentsTab 
              students={students}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}
          {activeTab === "exercises" && (
            <ExercisesTab 
              exercises={exercises}
              muscleGroups={muscleGroups}
              exerciseFilter={exerciseFilter}
              setExerciseFilter={setExerciseFilter}
              newEx={newEx}
              setNewEx={setNewEx}
              actionLoading={actionLoading}
              deletingId={deletingId}
              onAdd={handleAddExercise}
              onDelete={openModal}
              confirmModal={confirmModal}
              closeModal={closeModal}
              handleConfirmDelete={handleDelete}
            />
          )}
        </section>
      )}

      <BottomNav 
        tabs={NAV_TABS} 
        activeTab={activeTab} 
        onTabChange={(id: string) => setActiveTab(id as Tab)} 
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        profile={{ role: "admin", full_name: "System Admin" }}
      />
    </main>
  );
}

export default function AdminDashboard({ user }: AdminDashboardProps): React.JSX.Element {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <AdminDashboardContent user={user} />
    </Suspense>
  );
}
