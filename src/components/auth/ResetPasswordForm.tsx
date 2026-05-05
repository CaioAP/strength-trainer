"use client";

import React from "react";
import { Shield, Save, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ErrorBanner from "@/components/ui/ErrorBanner";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useResetPasswordForm } from "./useResetPasswordForm";

export const ResetPasswordForm = (): React.JSX.Element => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    initializing,
    error,
    success,
    handleReset,
  } = useResetPasswordForm();

  if (initializing) {
    return <LoadingScreen label="Verifying reset session..." fullPage={false} />;
  }

  if (success) {
    return (
      <Card variant="panel" padding="lg" className="w-full max-w-sm text-center animate-in fade-in zoom-in duration-300">
        <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="text-brand-primary w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Password Reset!</h1>
        <p className="mt-4 text-text-subtle text-xs font-bold uppercase tracking-widest leading-relaxed">Your password has been updated. Redirecting you to login...</p>
      </Card>
    );
  }

  return (
    <Card variant="panel" padding="lg" className="w-full max-w-sm animate-in fade-in zoom-in duration-300">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="text-brand-primary w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">New Password</h1>
        <p className="mt-2 text-text-subtle text-xs font-bold uppercase tracking-widest">Create a secure new password</p>
      </div>

      <form onSubmit={handleReset} className="mt-8 space-y-6">
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {error && <ErrorBanner message={error} />}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={loading}
          loadingText="Updating..."
        >
          {!loading && <Save className="w-5 h-5 mr-2" />}
          Set New Password
        </Button>
      </form>
    </Card>
  );
};
