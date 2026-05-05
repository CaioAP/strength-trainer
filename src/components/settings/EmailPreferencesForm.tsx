"use client";

import React from "react";
import { Save, Check } from "lucide-react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import SubPageHeader from "@/components/ui/SubPageHeader";
import ToggleRow from "@/components/ui/ToggleRow";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEmailPreferences } from "./useEmailPreferences";

export const EmailPreferencesForm = (): React.JSX.Element => {
  const {
    loading,
    saving,
    success,
    preferences,
    handleToggle,
    handleSave,
  } = useEmailPreferences();

  if (loading) return <LoadingScreen label="Loading Preferences..." />;

  const successIndicator = success ? (
    <div className="flex items-center gap-1.5 text-brand-primary animate-in fade-in zoom-in duration-300">
      <Check className="w-4 h-4" />
      <span className="text-2.5 font-black uppercase tracking-widest">Saved</span>
    </div>
  ) : undefined;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <SubPageHeader category="Settings" title="Email Preferences" rightContent={successIndicator} />

      <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-2.5 font-black uppercase tracking-widest text-text-subtle mb-1">System Notifications</h3>
            <p className="text-2.75 text-text-subtle/60 leading-relaxed italic">Essential updates about your account and training sessions.</p>
          </div>

          <Card padding="none" className="divide-y divide-white/5">
            <ToggleRow
              label="Account Activity"
              description="Security alerts and important account updates."
              checked={preferences.email_notifications}
              onToggle={(): void => handleToggle("email_notifications")}
            />
            <ToggleRow
              label="Session Reminders"
              description="Daily reminders for your scheduled workouts."
              checked={preferences.session_reminders}
              onToggle={(): void => handleToggle("session_reminders")}
            />
          </Card>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-2.5 font-black uppercase tracking-widest text-text-subtle mb-1">Training Insights</h3>
            <p className="text-2.75 text-text-subtle/60 leading-relaxed italic">Stay motivated with periodic reports on your progress.</p>
          </div>

          <Card padding="none" className="divide-y divide-white/5">
            <ToggleRow
              label="Weekly Progress Reports"
              description="Summaries of your volume, RPE, and consistency."
              checked={preferences.progress_reports}
              onToggle={(): void => handleToggle("progress_reports")}
            />
          </Card>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-2.5 font-black uppercase tracking-widest text-text-subtle mb-1">Marketing</h3>
            <p className="text-2.75 text-text-subtle/60 leading-relaxed italic">Optional updates about new features and platform news.</p>
          </div>

          <Card padding="none" className="divide-y divide-white/5">
            <ToggleRow
              label="News & Feature Updates"
              description="Be the first to know about new platform features."
              checked={preferences.marketing_emails}
              onToggle={(): void => handleToggle("marketing_emails")}
            />
          </Card>
        </section>
      </div>

      <div className="mt-auto p-4 pb-12">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleSave}
          loading={saving}
          loadingText="Saving Changes..."
        >
          {!saving && <Save className="w-5 h-5 mr-1" />}
          Save Preferences
        </Button>
      </div>
    </div>
  );
};
