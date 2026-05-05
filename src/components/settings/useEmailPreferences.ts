"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export interface EmailPreferences {
  email_notifications: boolean;
  marketing_emails: boolean;
  session_reminders: boolean;
  progress_reports: boolean;
}

export interface UseEmailPreferencesReturn {
  loading: boolean;
  saving: boolean;
  success: boolean;
  preferences: EmailPreferences;
  handleToggle: (key: keyof EmailPreferences) => void;
  handleSave: () => Promise<void>;
}

export function useEmailPreferences(): UseEmailPreferencesReturn {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preferences, setPreferences] = useState<EmailPreferences>({
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

  return {
    loading,
    saving,
    success,
    preferences,
    handleToggle,
    handleSave,
  };
}
