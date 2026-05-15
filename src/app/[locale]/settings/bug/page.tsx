import React from "react";
import SubPageHeader from "@/components/ui/SubPageHeader";
import { ReportBugForm } from "@/components/settings/ReportBugForm";

export default function ReportBugPage(): React.JSX.Element {
  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <SubPageHeader category="Support" title="Report a Bug" backHref="/" />

      <div className="p-4 flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        <ReportBugForm />
      </div>
    </main>
  );
}
