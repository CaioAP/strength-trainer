"use client";

import React from "react";
import { ExternalLink, Mail } from "lucide-react";
import SubPageHeader from "@/components/ui/SubPageHeader";
import { SettingsSection } from "@/components/ui/SettingsSection";

export const HelpCenterView = (): React.JSX.Element => {
  const faqs = [
    {
      question: "How do I contact my trainer?",
      answer: "You can reach out to your trainer directly via email. In-app messaging will be available in a future update.",
    },
    {
      question: "Can I change my assigned plan?",
      answer: "Your trainer is responsible for assigning and updating your training plans. Please contact them if you need adjustments.",
    },
    {
      question: "How is my RPE calculated?",
      answer: "RPE (Rate of Perceived Exertion) is a subjective measure of how hard an exercise felt on a scale of 1 to 10, where 10 is maximum effort.",
    },
    {
      question: "What happens if I miss a workout?",
      answer: "Missed workouts are simply left unlogged. Your trainer can see your completion history and adjust your plan accordingly if needed.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <SubPageHeader category="Support" title="Help Center" />

      <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        <SettingsSection
          title="Contact Support"
          description="Get help directly from our team."
        >
          <a
            href="mailto:support@strengthtrainer.app"
            className="p-4 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20">
                <Mail className="text-brand-primary w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm group-hover:text-brand-primary transition-colors">Email Support</p>
                <p className="text-xs text-text-subtle mt-1 leading-normal">Typically replies within 24 hours</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-text-subtle group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
          </a>
        </SettingsSection>

        <SettingsSection
          title="Frequently Asked Questions"
          description="Quick answers to common questions."
        >
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 hover:bg-white/5 transition-colors group">
              <p className="font-bold text-white text-sm mb-2 group-hover:text-brand-primary transition-colors">{faq.question}</p>
              <p className="text-xs.75 text-text-subtle leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </SettingsSection>
      </div>
    </div>
  );
};
