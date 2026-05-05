import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/lib/utils/validatePassword";

interface UseResetPasswordFormReturn {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  success: boolean;
  handleReset: (e: React.FormEvent) => Promise<void>;
}

export function useResetPasswordForm(): UseResetPasswordFormReturn {
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
      const authErr = err as Error;
      setError(authErr.message);
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    initializing,
    error,
    success,
    handleReset,
  };
}
