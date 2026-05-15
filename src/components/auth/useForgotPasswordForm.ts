import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UseForgotPasswordFormReturn } from "./Auth.types";

export function useForgotPasswordForm(): UseForgotPasswordFormReturn {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    success,
    error,
    handleResetRequest,
  };
}
