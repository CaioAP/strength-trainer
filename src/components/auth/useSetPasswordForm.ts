import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { validatePassword } from "@/lib/utils/validatePassword";
import { UseSetPasswordFormReturn } from "./Auth.types";

export function useSetPasswordForm(): UseSetPasswordFormReturn {
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
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (token && type === "invite") {
          const { error: otpError } = await supabase.auth.verifyOtp({ token_hash: token, type: "invite" });
          if (otpError) throw otpError;
        } else if (window.location.hash) {
          // createBrowserClient auto-processes hash tokens and fires SIGNED_IN during
          // initialization — before useEffect runs. Subscribe first, then check
          // getSession() as fallback to avoid missing the already-fired event.
          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(
              () => reject(new Error("Timed out waiting for session from invite link")),
              8000
            );
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, authSession) => {
              if (authSession && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
                clearTimeout(timer);
                subscription.unsubscribe();
                resolve();
              }
            });
            supabase.auth.getSession().then(({ data }) => {
              if (data.session) {
                clearTimeout(timer);
                subscription.unsubscribe();
                resolve();
              }
            });
          });
        }

        const { data: finalData } = await supabase.auth.getSession();
        if (!finalData.session && mounted) {
          const debugInfo = `URL: ${window.location.pathname} | Query: ${window.location.search ? "Yes" : "No"} | Hash: ${window.location.hash ? "Yes" : "No"}`;
          throw new Error(`Auth session missing! ${debugInfo}`);
        }
      } catch (err: unknown) {
        if (mounted) {
          const errMessage = err as Error;
          setError(errMessage.message || "Failed to initialize session");
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
      const authErr = err as Error;
      setError(authErr.message);
      setLoading(false);
    }
  };

  return {
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
  };
}
