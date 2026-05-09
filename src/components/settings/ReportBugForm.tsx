"use client";

import React from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { SettingsSection } from "@/components/ui/SettingsSection";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useReportBugForm } from "./useReportBugForm";

export const ReportBugForm = (): React.JSX.Element => {
  const {
    formData,
    setSeverity,
    setTitle,
    setDescription,
    loading,
    success,
    error,
    handleSubmit,
  } = useReportBugForm();

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20">
          <CheckCircle2 className="w-10 h-10 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Report Received!</h2>
          <p className="text-text-subtle text-xs mt-2 font-bold uppercase tracking-widest leading-relaxed">Thank you for helping us improve Strength.<br />Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <SettingsSection
          title="Issue Details"
          description="Describe what happened so our team can investigate."
          padding="md"
          cardClassName="space-y-6"
        >
          <Input
            label="Title"
            required
            placeholder="Briefly describe the issue"
            value={formData.title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />

          <TextArea
            label="Description"
            required
            placeholder="Steps to reproduce, expected vs actual behavior..."
            rows={5}
            value={formData.description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-subtle uppercase tracking-widest ml-1">Severity</label>
            <div className="grid grid-cols-2 gap-2">
              {["low", "medium", "high", "critical"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(): void => setSeverity(s)}
                  className={`py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                    formData.severity === s
                      ? "bg-brand-primary text-black shadow-[0_0_15px_rgba(206,255,5,0.4)] scale-102"
                      : "bg-brand-secondary text-text-subtle shadow-card hover:bg-white/5 hover:scale-102"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>
      </div>

      {error && <ErrorBanner message={error} />}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        size="lg"
        loading={loading}
        loadingText="Submitting..."
        disabled={!formData.title || !formData.description}
      >
        {!loading && <Send className="w-5 h-5 mr-3" />}
        Submit Report
      </Button>
    </form>
  );
};
