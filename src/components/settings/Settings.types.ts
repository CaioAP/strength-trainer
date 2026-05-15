import React from "react";

export interface EmailPreferences {
  email_notifications: boolean;
  marketing_emails: boolean;
  session_reminders: boolean;
  progress_reports: boolean;
}

export interface SecuritySettings {
  show_history_to_trainer: boolean;
}

export interface UseEmailPreferencesReturn {
  loading: boolean;
  saving: boolean;
  success: boolean;
  preferences: EmailPreferences;
  handleToggle: (key: keyof EmailPreferences) => void;
  handleSave: () => Promise<void>;
}

export interface UseSecuritySettingsReturn {
  loading: boolean;
  saving: boolean;
  success: boolean;
  privacy: SecuritySettings;
  handlePrivacyToggle: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
}

export interface UseChangePasswordFormReturn {
  passwordData: { newPassword: string; confirmPassword: string };
  setPasswordData: (data: { newPassword: string; confirmPassword: string }) => void;
  saving: boolean;
  status: { type: "success" | "error"; message: string } | null;
  handleChangePassword: (e: React.FormEvent) => Promise<void>;
}

export interface UseReportBugFormReturn {
  formData: { title: string; description: string; severity: string };
  setSeverity: (severity: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  loading: boolean;
  success: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
