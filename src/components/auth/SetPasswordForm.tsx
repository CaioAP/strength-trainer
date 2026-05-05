"use client";

import React from "react";
import { Shield } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ErrorBanner from "@/components/ui/ErrorBanner";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useSetPasswordForm } from "./useSetPasswordForm";

export const SetPasswordForm = (): React.JSX.Element => {
  const {
    fullName,
    setFullName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    initializing,
    error,
    handleSetPassword,
  } = useSetPasswordForm();

  if (initializing) {
    return <LoadingScreen label="Verifying your link..." fullPage={false} />;
  }

  return (
    <Card variant="panel" padding="lg" className="w-full max-w-sm animate-in fade-in zoom-in duration-300">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="text-brand-primary w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Complete Registration</h1>
        <p className="mt-2 text-text-subtle text-xs font-bold uppercase tracking-widest leading-relaxed">Please set a secure password for your account.</p>
      </div>

      <form onSubmit={handleSetPassword} className="mt-8 space-y-6">
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            disabled={loading}
          />
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
            label="Confirm Password"
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
          disabled={!!error}
        >
          Set Password & Login
        </Button>
      </form>
    </Card>
  );
};
