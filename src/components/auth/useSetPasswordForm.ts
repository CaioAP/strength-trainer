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
