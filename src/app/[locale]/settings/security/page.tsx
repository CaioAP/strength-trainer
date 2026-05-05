import React from "react";
import { SecurityPrivacyView } from "@/components/settings/SecurityPrivacyView";

export default function SecurityPrivacyPage(): React.JSX.Element {
  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <SecurityPrivacyView />
    </main>
  );
}
