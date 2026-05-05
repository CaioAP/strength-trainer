"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import SubPageHeader from "@/components/ui/SubPageHeader";
import ToggleRow from "@/components/ui/ToggleRow";

export default function EmailPreferencesPage(): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    marketing_emails: false,
    session_reminders: true,
    progress_reports: true,
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchPreferences(): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("email_notifications, marketing_emails, session_reminders, progress_reports")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching preferences:", error);
      } else if (profile) {
        setPreferences({
          email_notifications: profile.email_notifications ?? true,
          marketing_emails: profile.marketing_emails ?? false,
          session_reminders: profile.session_reminders ?? true,
          progress_reports: profile.progress_reports ?? true,
        });
      }
      setLoading(false);
    }

    fetchPreferences();
  }, [supabase, router]);

  const handleToggle = (key: keyof typeof preferences): void => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setSuccess(false);
  };

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("profiles").update(preferences).eq("id", user?.id);

    if (error) {
      console.error("Error saving preferences:", error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  if (loading) return <LoadingScreen label="Loading Preferences..." />;

  const successIndicator = success ? (
    <div className="flex items-center gap-1.5 text-brand-primary animate-in fade-in zoom-in duration-300">
      <Check className="w-4 h-4" />
      <span className="text-2.5 font-black uppercase tracking-widest">Saved</span>
    </div>
  ) : undefined;

  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <SubPageHeader category="Settings" title="Email Preferences" rightContent={successIndicator} />

      <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-2.5 font-black uppercase tracking-widest text-text-subtle mb-1">System Notifications</h3>
            <p className="text-2.75 text-text-subtle/60 leading-relaxed italic">Essential updates about your account and training sessions.</p>
          </div>

          <div className="bg-brand-surface rounded-xl shadow-card overflow-hidden divide-y divide-white/5">
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
          </div>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-2.5 font-black uppercase tracking-widest text-text-subtle mb-1">Training Insights</h3>
            <p className="text-2.75 text-text-subtle/60 leading-relaxed italic">Stay motivated with periodic reports on your progress.</p>
          </div>

          <div className="bg-brand-surface rounded-xl shadow-card overflow-hidden divide-y divide-white/5">
            <ToggleRow
              label="Weekly Progress Reports"
              description="Summaries of your volume, RPE, and consistency."
              checked={preferences.progress_reports}
              onToggle={(): void => handleToggle("progress_reports")}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-2.5 font-black uppercase tracking-widest text-text-subtle mb-1">Marketing</h3>
            <p className="text-2.75 text-text-subtle/60 leading-relaxed italic">Optional updates about new features and platform news.</p>
          </div>

          <div className="bg-brand-surface rounded-xl shadow-card overflow-hidden divide-y divide-white/5">
            <ToggleRow
              label="News & Feature Updates"
              description="Be the first to know about new platform features."
              checked={preferences.marketing_emails}
              onToggle={(): void => handleToggle("marketing_emails")}
            />
          </div>
        </section>
      </div>

      <div className="mt-auto p-4 pb-12">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-brand-primary text-black rounded-md font-black uppercase text-sm tracking-widest shadow-elevated transition-all active:scale-98 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving Changes..." : "Save Preferences"}
        </button>
      </div>
    </main>
  );
}
