"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import Link from "next/link";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLoginForm } from "./useLoginForm";

export default function LoginForm(): React.JSX.Element {
  const t = useTranslations("Auth.Login");
  const ct = useTranslations("Common");

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    deletionScheduled,
    handleLogin,
  } = useLoginForm();

  return (
    <Card variant="panel" padding="lg" className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-primary italic font-black uppercase tracking-tighter">
          {ct("title")}
        </h1>
        <p className="mt-2 text-text-subtle text-xs font-bold uppercase tracking-widest">
          {t("title")}
        </p>
      </div>

      {deletionScheduled && (
        <div className="bg-brand-primary/10 shadow-card p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <Info className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-tight">
              {t("deactivation_title")}
            </p>
            <p className="text-2.5 text-text-subtle mt-1 leading-relaxed">
              {t("deactivation_desc")}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div className="space-y-4">
          <Input
            label={t("email_label")}
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email_placeholder")}
            disabled={loading}
          />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label 
                htmlFor="password" 
                className="block text-2.5 font-black text-text-subtle uppercase tracking-widest"
              >
                {t("password_label")}
              </label>
              <Link
                href="/forgot-password"
                className="text-2.5 font-black text-brand-primary uppercase tracking-widest hover:opacity-80 transition-opacity"
              >
                {t("forgot_password")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password_placeholder")}
              disabled={loading}
            />
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={loading}
          loadingText={t("submitting")}
        >
          {t("submit")}
        </Button>
      </form>
    </Card>
  );
}
