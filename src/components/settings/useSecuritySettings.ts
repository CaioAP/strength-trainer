"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export interface SecuritySettings {
  show_history_to_trainer: boolean;
}

export interface UseSecuritySettingsReturn {
  loading: boolean;
  saving: boolean;
  success: boolean;
  privacy: SecuritySettings;
  handlePrivacyToggle: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
}

export function useSecuritySettings(): UseSecuritySettingsReturn {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [privacy, setPrivacy] = useState<SecuritySettings>({ show_history_to_trainer: true });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("show_history_to_trainer")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching privacy settings:", error);
      } else if (profile) {
        setPrivacy({ show_history_to_trainer: profile.show_history_to_trainer ?? true });
      }
      setLoading(false);
    }

    fetchData();
  }, [supabase, router]);

  const handlePrivacyToggle = async (): Promise<void> => {
    const newValue = !privacy.show_history_to_trainer;
    setPrivacy({ show_history_to_trainer: newValue });

    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ show_history_to_trainer: newValue }).eq("id", user?.id);

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleDeleteAccount = async (): Promise<void> => {
    setSaving(true);
    try {
      const { error } = await supabase.rpc("schedule_account_deletion");
      if (error) throw error;

      await supabase.auth.signOut();
      router.push("/login?deletion_scheduled=true");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error scheduling account deletion:", error);
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    success,
    privacy,
    handlePrivacyToggle,
    handleDeleteAccount,
  };
}
