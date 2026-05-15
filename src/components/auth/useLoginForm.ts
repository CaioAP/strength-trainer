import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { UseLoginFormReturn } from "./Auth.types";

export function useLoginForm(): UseLoginFormReturn {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deletionScheduled = searchParams.get("deletion_scheduled");

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    deletionScheduled,
    handleLogin,
  };
}
