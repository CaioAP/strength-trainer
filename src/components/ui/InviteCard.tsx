"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";

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
    <Card variant="default" padding="lg">
      <div className="flex items-center gap-3 mb-4">
        <Plus className="text-brand-primary w-5 h-5" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1">
          <Input
            type="email"
            placeholder={placeholder}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="px-6"
        >
          {t("invite")}
        </Button>
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
    </Card>
  );
}
