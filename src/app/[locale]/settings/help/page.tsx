"use client";

import React from "react";
import { ExternalLink, Mail } from "lucide-react";
import SubPageHeader from "@/components/ui/SubPageHeader";

export default function HelpCenterPage(): React.JSX.Element {
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
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <SubPageHeader category="Support" title="Help Center" />

      <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-2.5 font-black uppercase tracking-widest text-text-subtle mb-1">Contact Support</h3>
            <p className="text-2.75 text-text-subtle/60 leading-relaxed italic">Get help directly from our team.</p>
          </div>

          <div className="bg-brand-surface rounded-xl shadow-card overflow-hidden divide-y divide-white/5">
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
                  <p className="text-2.5 text-text-subtle mt-1 leading-normal">Typically replies within 24 hours</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-text-subtle group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
            </a>
          </div>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-2.5 font-black uppercase tracking-widest text-text-subtle mb-1">Frequently Asked Questions</h3>
            <p className="text-2.75 text-text-subtle/60 leading-relaxed italic">Quick answers to common questions.</p>
          </div>

          <div className="bg-brand-surface rounded-xl shadow-card overflow-hidden divide-y divide-white/5">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 hover:bg-white/5 transition-colors group">
                <p className="font-bold text-white text-sm mb-2 group-hover:text-brand-primary transition-colors">{faq.question}</p>
                <p className="text-2.75 text-text-subtle leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
