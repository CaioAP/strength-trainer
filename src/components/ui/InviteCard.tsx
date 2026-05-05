"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface InviteCardProps {
  title: string;
  placeholder: string;
  loading: boolean;
  onSubmit: (email: string) => Promise<void>;
}

export default function InviteCard({ title, placeholder, loading, onSubmit }: InviteCardProps): React.JSX.Element {
  const t = useTranslations("Common");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);
    try {
      await onSubmit(email);
      setMessage(t("success"));
      setEmail("");
    } catch (err) {
      const error = err as Error;
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <Plus className="text-brand-primary w-5 h-5" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder={placeholder}
          required
          className="flex-1 bg-brand-secondary shadow-inner rounded-md p-3 text-white outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-primary text-black px-6 rounded-md font-bold text-xs uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-card hover:shadow-card-hover"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            t("invite")
          )}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-xs font-medium animate-in fade-in slide-in-from-top-1 ${
            message === t("success") ? "text-brand-primary" : "text-status-error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
