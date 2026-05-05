import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { validatePassword } from "@/lib/utils/validatePassword";

interface UseChangePasswordFormReturn {
  passwordData: { newPassword: string; confirmPassword: string };
  setPasswordData: (data: { newPassword: string; confirmPassword: string }) => void;
  saving: boolean;
  status: { type: "success" | "error"; message: string } | null;
  handleChangePassword: (e: React.FormEvent) => Promise<void>;
}

export function useChangePasswordForm(): UseChangePasswordFormReturn {
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const supabase = createClient();

  const handleChangePassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setStatus(null);

    const { newPassword, confirmPassword } = passwordData;
    const validationError = validatePassword(newPassword, confirmPassword);
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setStatus({ type: "error", message: updateError.message });
    } else {
      setStatus({ type: "success", message: "Password updated successfully" });
      setPasswordData({ newPassword: "", confirmPassword: "" });
    }
    setSaving(false);
  };

  return {
    passwordData,
    setPasswordData,
    saving,
    status,
    handleChangePassword,
  };
}
