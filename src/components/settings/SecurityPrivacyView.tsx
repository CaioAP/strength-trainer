"use client";

import React, { useState } from "react";
import { Trash2, Check } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import SubPageHeader from "@/components/ui/SubPageHeader";
import ToggleRow from "@/components/ui/ToggleRow";
import { SettingsSection } from "@/components/ui/SettingsSection";
import { Button } from "@/components/ui/Button";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { useSecuritySettings } from "./useSecuritySettings";

export const SecurityPrivacyView = (): React.JSX.Element => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {
    loading,
    saving,
    success,
    privacy,
    handlePrivacyToggle,
    handleDeleteAccount,
  } = useSecuritySettings();

  if (loading) return <LoadingScreen label="Loading Security..." />;

  const successIndicator = success ? (
    <div className="flex items-center gap-1.5 text-brand-primary animate-in fade-in zoom-in duration-300">
      <Check className="w-4 h-4" />
      <span className="text-xs font-bold uppercase tracking-widest">Updated</span>
    </div>
  ) : undefined;

  return (
    <div className="flex-1 flex flex-col">
      <SubPageHeader category="Settings" title="Security & Privacy" rightContent={successIndicator} />

      <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        <SettingsSection
          title="Privacy Controls"
          description="Manage who can see your training data and history."
        >
          <ToggleRow
            label="Trainer Visibility"
            description="Allow your assigned trainer to view your full session history and RPE stats."
            checked={privacy.show_history_to_trainer}
            onToggle={handlePrivacyToggle}
          />
        </SettingsSection>

        <ChangePasswordForm />

        <SettingsSection
          title="Danger Zone"
          titleVariant="danger"
          description="Irreversible actions regarding your account data."
          className="pt-4"
        >
          <Button
            variant="danger-subtle"
            size="none"
            onClick={(): void => setShowDeleteModal(true)}
            className="w-full p-4 flex items-center justify-between group rounded-none border-none"
          >
            <div className="text-left normal-case tracking-normal">
              <p className="font-bold text-sm">Delete Account</p>
              <p className="text-xs opacity-60 mt-0.5 font-normal">Permanently remove your profile and all training data.</p>
            </div>
            <Trash2 className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
          </Button>
        </SettingsSection>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={(): void => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Schedule Account Deletion?"
        message="Your account will be deactivated and scheduled for permanent deletion in 30 days. During this period, you can cancel the deletion at any time simply by logging back in. If you do not log in within 30 days, all your training history, plans, and data will be permanently and irreversibly removed."
        confirmText="Schedule Deletion"
        variant="danger"
        isLoading={saving}
      />
    </div>
  );
};
