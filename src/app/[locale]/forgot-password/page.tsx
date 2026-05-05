"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import ErrorBanner from "@/components/ui/ErrorBanner";

export default function ForgotPasswordPage(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col justify-center items-center p-6 bg-brand-secondary min-h-screen">
      <div className="w-full max-w-sm space-y-8 bg-brand-surface p-8 rounded-lg shadow-elevated animate-in fade-in zoom-in duration-300">
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
              <p className="text-[10px] text-text-subtle leading-relaxed">If an account exists for {email}, you will receive a password reset link shortly.</p>
            </div>
            <Link
              href="/login"
              className="block w-full py-4 bg-brand-primary text-black font-black rounded-md uppercase text-sm tracking-widest shadow-subtle active:scale-[0.98]"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[10px] font-black text-text-subtle mb-1.5 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {error && <ErrorBanner message={error} />}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 bg-brand-primary text-black font-black rounded-md hover:opacity-90 disabled:opacity-50 transition-all uppercase text-sm tracking-widest shadow-subtle active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Send Reset Link"}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-subtle hover:text-brand-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
