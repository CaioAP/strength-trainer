import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface UseReportBugFormReturn {
  formData: { title: string; description: string; severity: string };
  setSeverity: (severity: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  loading: boolean;
  success: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useReportBugForm(): UseReportBugFormReturn {
  const [formData, setFormData] = useState({ title: "", description: "", severity: "medium" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: submitError } = await supabase.from("bug_reports").insert([{
        user_id: user?.id,
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
      }]);

      if (submitError) throw submitError;

      setSuccess(true);
      setTimeout(() => router.back(), 3000);
    } catch (err: unknown) {
      const submitErr = err as Error;
      setError(submitErr.message || "Failed to submit report. Please try again.");
      setLoading(false);
    }
  };

  return {
    formData,
    setSeverity: (severity) => setFormData(prev => ({ ...prev, severity })),
    setTitle: (title) => setFormData(prev => ({ ...prev, title })),
    setDescription: (description) => setFormData(prev => ({ ...prev, description })),
    loading,
    success,
    error,
    handleSubmit,
  };
}
