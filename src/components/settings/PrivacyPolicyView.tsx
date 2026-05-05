"use client";

import React from "react";
import { ShieldCheck, Lock, Eye, Server } from "lucide-react";
import SubPageHeader from "@/components/ui/SubPageHeader";
import { SettingsSection } from "@/components/ui/SettingsSection";

export const PrivacyPolicyView = (): React.JSX.Element => {
  const sections = [
    {
      title: "Data Collection",
      icon: <Server className="w-4 h-4 text-brand-primary" />,
      content: "We collect only the data necessary to provide our training services. This includes your name, email address, workout logs, and performance metrics provided by you or your trainer.",
    },
    {
      title: "Information Sharing",
      icon: <Eye className="w-4 h-4 text-brand-primary" />,
      content: "Your training data is shared exclusively with your assigned trainer to help them optimize your plans. You can revoke this access at any time through the Security & Privacy settings.",
    },
    {
      title: "Security Measures",
      icon: <Lock className="w-4 h-4 text-brand-primary" />,
      content: "We use industry-standard encryption and secure authentication protocols to protect your account and personal information from unauthorized access.",
    },
    {
      title: "Account Deletion",
      icon: <ShieldCheck className="w-4 h-4 text-brand-primary" />,
      content: "You have the right to delete your account at any time. We provide a 30-day grace period where you can restore your data before it is permanently removed from our servers.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <SubPageHeader category="Legal" title="Privacy Policy" />

      <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        <div className="px-1">
          <p className="text-2.75 text-text-subtle/80 leading-relaxed italic">Last updated: April 29, 2026. Your privacy is our priority.</p>
        </div>

        {sections.map((section, index) => (
          <SettingsSection 
            key={index} 
            title={section.title} 
            padding="md"
            cardVariant="interactive"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{section.icon}</div>
              <p className="text-2.75 text-text-subtle leading-relaxed">{section.content}</p>
            </div>
          </SettingsSection>
        ))}

        <section className="space-y-4 pt-4">
          <p className="text-2.5 text-text-subtle/40 text-center leading-relaxed px-4 italic">
            By using Strength, you agree to the collection and use of information in accordance with this policy. If you have questions, please contact us at support@strengthtrainer.app.
          </p>
        </section>
      </div>
    </div>
  );
};
