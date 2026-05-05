"use client";

import React, { useState } from "react";
import { X, FileText, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { WorkoutTemplate } from "@/lib/types/common.types";
import { Card } from "./Card";
import { Button } from "./Button";

interface PlanAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: WorkoutTemplate[];
  onAssign: (templateId: string) => void;
  isLoading: boolean;
}

export default function PlanAssignmentModal({
  isOpen,
  onClose,
  templates,
  onAssign,
  isLoading
}: PlanAssignmentModalProps): React.JSX.Element | null {
  const t = useTranslations("Common");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card variant="modal" padding="none" className="w-full max-w-sm flex flex-col max-h-80vh animate-in zoom-in-95 duration-200">
        <header className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
          <div>
            <h3 className="text-xl font-bold text-white">{t("assign_template")}</h3>
            <p className="text-2.5 text-text-subtle uppercase font-black tracking-widest mt-1">{t("pick_starting_plan")}</p>
          </div>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {templates.map((template) => (
            <Card 
              key={template.id}
              variant="interactive"
              padding="sm"
              onClick={() => !isLoading && setSelectedId(template.id)}
              className={`border transition-all flex justify-between items-center ${
                selectedId === template.id 
                ? "bg-brand-primary/10 border-brand-primary" 
                : "bg-brand-secondary border-gray-800"
              }`}
            >
              <div>
                <h4 className="font-bold text-white text-sm">{template.name}</h4>
                <p className="text-2.5 text-text-subtle mt-1 line-clamp-1">{template.description || t("standard_template")}</p>
              </div>
              {selectedId === template.id && (
                <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
            </Card>
          ))}

          {templates.length === 0 && (
            <div className="text-center py-12 opacity-50">
              <FileText className="w-8 h-8 mx-auto mb-3 text-gray-700" />
              <p className="text-xs text-text-subtle uppercase font-black tracking-widest">{t("no_templates_found")}</p>
            </div>
          )}
        </div>

        <footer className="p-4 bg-gray-800/20 border-t border-gray-800 flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => selectedId && onAssign(selectedId)}
            loading={isLoading}
            disabled={!selectedId}
          >
            {t("confirm")}
          </Button>
        </footer>
      </Card>
    </div>
  );
}
