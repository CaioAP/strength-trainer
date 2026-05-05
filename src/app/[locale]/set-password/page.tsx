"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";
import { validatePassword } from "@/lib/utils/validatePassword";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SuspenseLoader from "@/components/ui/SuspenseLoader";
import LoadingScreen from "@/components/ui/LoadingScreen";

function SetPasswordForm(): React.JSX.Element {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let mounted = true;

    async function initializeSession(): Promise<void> {
      try {
        const code = searchParams.get("code");
        const token = searchParams.get("token");
        const type = searchParams.get("type") as "invite" | "recovery" | "signup" | "email_change" | "email" | null;

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (token && type === "invite") {
          const { error } = await supabase.auth.verifyOtp({ token_hash: token, type: "invite" });
          if (error) throw error;
        } else if (window.location.hash) {
          const hash = window.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (setSessionError) throw setSessionError;
          }
        }

        let session = null;
        for (let i = 0; i < 5; i++) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            session = data.session;
            break;
          }
          await new Promise((r) => setTimeout(r, 500));
        }

        if (!session && mounted) {
          const debugInfo = `URL: ${window.location.pathname} | Query: ${window.location.search ? "Yes" : "No"} | Hash: ${window.location.hash ? "Yes" : "No"}`;
          throw new Error(`Auth session missing! ${debugInfo}`);
        }
      } catch (err: unknown) {
        if (mounted) {
          const error = err as Error;
          setError(error.message || "Failed to initialize session");
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    }

    initializeSession();
    return (): void => {
      mounted = false;
    };
  }, [supabase, searchParams]);

  const handleSetPassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profError } = await supabase
          .from("profiles")
          .update({ full_name: fullName })
          .eq("id", user.id);
        if (profError) throw profError;
      }

      router.push("/");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      setLoading(false);
    }
  };

  if (initializing) {
    return <LoadingScreen label="Verifying your link..." fullPage={false} />;
  }

  return (
    <div className="w-full max-w-sm space-y-8 bg-brand-surface p-8 rounded-lg shadow-elevated">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="text-brand-primary w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Complete Registration</h1>
        <p className="mt-2 text-text-subtle text-sm">Please set a secure password for your account.</p>
      </div>

      <form onSubmit={handleSetPassword} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-text-subtle uppercase tracking-widest mb-1.5 ml-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-gray-700"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-text-subtle uppercase tracking-widest mb-1.5 ml-1">
              New Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-text-subtle uppercase tracking-widest mb-1.5 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={loading || !!error}
          className="w-full touch-target bg-brand-primary text-black font-bold rounded-md hover:opacity-90 disabled:opacity-50 transition-all uppercase text-sm"
        >
          {loading ? "Updating..." : "Set Password & Login"}
        </button>
      </form>
    </div>
  );
}

export default function SetPasswordPage(): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-brand-secondary min-h-screen">
      <Suspense fallback={<SuspenseLoader />}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}
