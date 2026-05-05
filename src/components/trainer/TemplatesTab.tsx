import React from "react";
import { useTranslations } from "next-intl";
import { FileText, Plus, Dumbbell, Trash2 } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
          <h2 className="text-2.5 font-black uppercase tracking-widest text-text-subtle">
            {t("title")}
          </h2>
        </div>
        <Link href="/trainer/plan/new">
          <Button variant="primary" size="sm" className="p-1.5">
            <Plus className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-3">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            variant="interactive"
            padding="sm"
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/10 transition-all shrink-0">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white tracking-tight group-hover:text-brand-primary transition-colors truncate">
                  {template.name}
                </p>
                <p className="text-2.5 text-text-subtle uppercase tracking-widest font-bold truncate">
                  {new Date(template.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(template.id)}
              className="text-text-subtle hover:text-status-error ml-4"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
        {templates.length === 0 && <EmptyState message={t("no_templates")} />}
      </div>
    </section>
  );
}
