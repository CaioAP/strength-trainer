import React from "react";
import { EmailPreferencesForm } from "@/components/settings/EmailPreferencesForm";

export default function EmailPreferencesPage(): React.JSX.Element {
  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <EmailPreferencesForm />
    </main>
  );
}
