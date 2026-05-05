import React from "react";
import { PrivacyPolicyView } from "@/components/settings/PrivacyPolicyView";

export default function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <PrivacyPolicyView />
    </main>
  );
}
