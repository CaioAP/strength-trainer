"use client";

import React from "react";
import { Mail, ChevronLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useForgotPasswordForm } from "./useForgotPasswordForm";

export const ForgotPasswordForm = (): React.JSX.Element => {
  const {
    email,
    setEmail,
    loading,
    success,
    error,
    handleResetRequest,
  } = useForgotPasswordForm();

  return (
    <Card variant="panel" padding="lg" className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="text-brand-primary w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Reset Password</h1>
        <p className="mt-2 text-text-subtle text-xs font-bold uppercase tracking-widest">Enter your email for a reset link</p>
      </div>

      {success ? (
        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-brand-primary/10 shadow-card p-4 rounded-lg flex flex-col items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-brand-primary" />
            <p className="text-white text-sm font-bold">Check your inbox!</p>
            <p className="text-2.5 text-text-subtle leading-relaxed">If an account exists for {email}, you will receive a password reset link shortly.</p>
          </div>
          <Link href="/login" className="block">
            <Button variant="primary" fullWidth size="lg">
              Back to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleResetRequest} className="mt-8 space-y-6">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={loading}
          />

          {error && <ErrorBanner message={error} />}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            loading={loading}
            disabled={!email}
          >
            Send Reset Link
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-2.5 font-black uppercase tracking-widest text-text-subtle hover:text-brand-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </form>
      )}
    </Card>
  );
};
