"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Activity, Calendar, Settings } from "lucide-react";
import SettingsModal from "@/components/ui/SettingsModal";
import BottomNav from "@/components/ui/BottomNav";
import SuspenseLoader from "@/components/ui/SuspenseLoader";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useSettingsModal } from "@/hooks/useSettingsModal";
import { useStudentDashboard } from "./useStudentDashboard";
import WorkoutView from "./WorkoutView";
import HistoryView from "./HistoryView";
import { Tab, NavTab } from "./StudentDashboard.types";

interface StudentDashboardProps {
  user: {
    id: string;
    email?: string;
  };
}

function StudentDashboardContent({ user }: StudentDashboardProps): React.JSX.Element {
  const t = useTranslations("Student.Tabs");
  const ht = useTranslations("Student.Header");
  const ct = useTranslations("Common");

  const {
    activeTab,
    setActiveTab,
    profile,
    activePlan,
    fullHistory,
    loading,
    hasWorkedOutOn,
  } = useStudentDashboard(user.id);

  const { settingsOpen, setSettingsOpen } = useSettingsModal();

  const NAV_TABS: NavTab[] = [
    { id: "workout", label: t("workout"), icon: <Activity className="w-5 h-5" /> },
    { id: "history", label: t("history"), icon: <Calendar className="w-5 h-5" /> },
  ];

  const welcomeMessage = profile?.full_name 
    ? `${ht("ready_prefix")}${profile.full_name.split(" ")[0]}${ht("ready_suffix")}`
    : `${ht("ready_prefix")}Student${ht("ready_suffix")}`;

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-24">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary leading-tight font-black uppercase italic tracking-tighter">
            {ct("title")}
          </h1>
          <p className="text-text-subtle text-sm font-medium">
            {loading ? ct("synchronizing") : welcomeMessage}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-full hover:bg-brand-surface text-white transition-all active:rotate-45"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {loading && (activeTab === "workout" ? !activePlan : fullHistory.length === 0) ? (
        <LoadingScreen fullPage={false} />
      ) : (
        <div className="flex-1 p-1">
          {activeTab === "workout" ? (
            <WorkoutView activePlan={activePlan} hasWorkedOutOn={hasWorkedOutOn} />
          ) : (
            <HistoryView fullHistory={fullHistory} />
          )}
        </div>
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
        profile={profile}
      />
    </main>
  );
}

export default function StudentDashboard({ user }: StudentDashboardProps): React.JSX.Element {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <StudentDashboardContent user={user} />
    </Suspense>
  );
}
