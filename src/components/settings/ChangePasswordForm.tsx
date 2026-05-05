"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SettingsSection } from "@/components/ui/SettingsSection";
import { useChangePasswordForm } from "./useChangePasswordForm";

export const ChangePasswordForm = (): React.JSX.Element => {
  const {
    passwordData,
    setPasswordData,
    saving,
    status,
    handleChangePassword,
  } = useChangePasswordForm();

  return (
    <SettingsSection
      title="Update Password"
      description="Secure your account with a strong, unique password."
      padding="md"
    >
      <form onSubmit={handleChangePassword} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          required
          value={passwordData.newPassword}
          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          placeholder="••••••••"
          disabled={saving}
        />
        <Input
          label="Confirm New Password"
          type="password"
          required
          value={passwordData.confirmPassword}
          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          placeholder="••••••••"
          disabled={saving}
        />

        {status && (
          <div className={`p-3 rounded text-2.5 font-bold uppercase tracking-widest text-center ${
            status.type === "success"
              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
              : "bg-status-error/10 text-status-error border border-status-error/20"
          }`}>
            {status.message}
          </div>
        )}

        <Button
          type="submit"
          variant="secondary"
          fullWidth
          loading={saving}
          loadingText="Updating..."
          disabled={!passwordData.newPassword}
        >
          Update Password
        </Button>
      </form>
    </SettingsSection>
  );
};
