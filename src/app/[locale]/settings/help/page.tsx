import React from "react";
import { HelpCenterView } from "@/components/settings/HelpCenterView";

export default function HelpCenterPage(): React.JSX.Element {
  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <HelpCenterView />
    </main>
  );
}
