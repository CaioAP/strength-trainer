"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
    <section className="space-y-4">
      <div className="px-1">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-text-subtle mb-1">Update Password</h3>
        <p className="text-[11px] text-text-subtle/60 leading-relaxed italic">Secure your account with a strong, unique password.</p>
      </div>

      <form onSubmit={handleChangePassword}>
        <Card variant="default" className="p-5 space-y-4">
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
            <div className={`p-3 rounded text-[10px] font-bold uppercase tracking-widest text-center ${
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
        </Card>
      </form>
    </section>
  );
};
