"use client";

import React, { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Shield, Loader2, Save, CheckCircle2 } from "lucide-react";
import { validatePassword } from "@/lib/utils/validatePassword";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SuspenseLoader from "@/components/ui/SuspenseLoader";
import LoadingScreen from "@/components/ui/LoadingScreen";

function ResetPasswordForm(): React.JSX.Element {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function checkSession(): Promise<void> {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError("Invalid or expired reset link. Please request a new one.");
      }
      setInitializing(false);
    }
    checkSession();
  }, [supabase]);

  const handleReset = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      setLoading(false);
    }
  };

  if (initializing) {
    return <LoadingScreen label="Verifying reset session..." fullPage={false} />;
  }

  if (success) {
    return (
      <div className="w-full max-w-sm space-y-8 bg-brand-surface p-8 rounded-lg shadow-elevated text-center animate-in fade-in zoom-in duration-300">
        <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="text-brand-primary w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Password Reset!</h1>
        <p className="mt-4 text-text-subtle text-xs font-bold uppercase tracking-widest leading-relaxed">Your password has been updated. Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-8 bg-brand-surface p-8 rounded-lg shadow-elevated animate-in fade-in zoom-in duration-300">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="text-brand-primary w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">New Password</h1>
        <p className="mt-2 text-text-subtle text-xs font-bold uppercase tracking-widest">Create a secure new password</p>
      </div>

      <form onSubmit={handleReset} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-text-subtle uppercase tracking-widest mb-1.5 ml-1">
              New Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-text-subtle uppercase tracking-widest mb-1.5 ml-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-gray-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-primary text-black font-black rounded-md hover:opacity-90 disabled:opacity-50 transition-all uppercase text-sm tracking-widest shadow-subtle active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {loading ? "Updating..." : "Set New Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage(): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-brand-secondary min-h-screen">
      <Suspense fallback={<SuspenseLoader />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
