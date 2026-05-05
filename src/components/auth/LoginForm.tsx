"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import Link from "next/link";
import ErrorBanner from "@/components/ui/ErrorBanner";
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
    <div className="w-full max-w-sm space-y-8 bg-brand-surface p-8 rounded-lg shadow-elevated">
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
            <p className="text-[10px] text-text-subtle mt-1 leading-relaxed">
              {t("deactivation_desc")}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-[10px] font-black text-text-subtle mb-1.5 uppercase tracking-widest ml-1"
            >
              {t("email_label")}
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email_placeholder")}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label 
                htmlFor="password" 
                className="block text-[10px] font-black text-text-subtle uppercase tracking-widest"
              >
                {t("password_label")}
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:opacity-80 transition-opacity"
              >
                {t("forgot_password")}
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password_placeholder")}
            />
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-primary text-black font-black rounded-md hover:opacity-90 disabled:opacity-50 transition-all uppercase text-sm tracking-widest shadow-subtle active:scale-[0.98]"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}
