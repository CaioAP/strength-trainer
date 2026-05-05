"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Users, FileText } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SettingsModal from "@/components/ui/SettingsModal";
import BottomNav from "@/components/ui/BottomNav";
import SuspenseLoader from "@/components/ui/SuspenseLoader";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { useSettingsModal } from "@/hooks/useSettingsModal";
import { useTrainerDashboard } from "./useTrainerDashboard";
import StudentsTab from "./StudentsTab";
import TemplatesTab from "./TemplatesTab";
import { Tab, NavTab } from "./TrainerDashboard.types";

interface TrainerDashboardProps {
  user: {
    id: string;
    email?: string;
  };
}

function TrainerDashboardContent({ user }: TrainerDashboardProps): React.JSX.Element {
  const t = useTranslations("Trainer.Tabs");
  const pt = useTranslations("Trainer");
  const ct = useTranslations("Common");

  const {
    activeTab,
    setActiveTab,
    students,
    templates,
    profile,
    loading,
    actionLoading,
    searchQuery,
    setSearchQuery,
    handleInviteStudent,
    confirmModal,
    openModal,
    closeModal,
    handleDelete,
    deletingId,
  } = useTrainerDashboard(user.id);

  const { settingsOpen, setSettingsOpen } = useSettingsModal();

  const NAV_TABS: NavTab[] = [
    { id: "students", label: t("students"), icon: <Users className="w-5 h-5" /> },
    { id: "templates", label: t("templates"), icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-24">
      <DashboardHeader
        title={ct("title")}
        subtitle={pt("Portal")}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      {loading && (activeTab === "students" ? students.length === 0 : templates.length === 0) ? (
        <LoadingScreen fullPage={false} />
      ) : (
        <div className="flex-1 p-1">
          {activeTab === "students" ? (
            <StudentsTab 
              students={students}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              actionLoading={actionLoading}
              onInvite={handleInviteStudent}
            />
          ) : (
            <TemplatesTab 
              templates={templates}
              onDelete={openModal}
            />
          )}
        </div>
      )}

      <BottomNav 
        tabs={NAV_TABS} 
        activeTab={activeTab} 
        onTabChange={(id: string) => setActiveTab(id as Tab)} 
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title={pt("Templates.delete_confirm_title")}
        message={pt("Templates.delete_confirm_msg")}
        confirmText={ct("delete")}
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

export default function TrainerDashboard({ user }: TrainerDashboardProps): React.JSX.Element {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <TrainerDashboardContent user={user} />
    </Suspense>
  );
}
