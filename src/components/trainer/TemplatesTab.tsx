import React from "react";
import { useTranslations } from "next-intl";
import { FileText, Plus, Dumbbell, Trash2 } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { WorkoutTemplate } from "./TrainerDashboard.types";

interface TemplatesTabProps {
  templates: WorkoutTemplate[];
  onDelete: (id: string) => void;
}

export default function TemplatesTab({
  templates,
  onDelete,
}: TemplatesTabProps): React.JSX.Element {
  const t = useTranslations("Trainer.Templates");

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-primary" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
            {t("title")}
          </h2>
        </div>
        <Link
          href="/trainer/plan/new"
          className="p-1.5 bg-brand-primary text-black rounded-md hover:opacity-90 transition-all shadow-card hover:shadow-card-hover"
        >
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid gap-3">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 flex items-center justify-between group overflow-hidden"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/10 transition-all shrink-0">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white tracking-tight group-hover:text-brand-primary transition-colors truncate">
                  {template.name}
                </p>
                <p className="text-[10px] text-text-subtle uppercase tracking-widest font-bold truncate">
                  {new Date(template.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDelete(template.id)}
              className="p-2 text-text-subtle hover:text-status-error transition-colors shrink-0 ml-4"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {templates.length === 0 && <EmptyState message={t("no_templates")} />}
      </div>
    </section>
  );
}
