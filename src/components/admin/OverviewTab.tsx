import React from "react";
import { useTranslations } from "next-intl";
import { BarChart3, Dumbbell, Users, UserCheck, Shield } from "lucide-react";
import { AdminMetrics } from "./AdminDashboard.types";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";

interface OverviewTabProps {
  metrics: AdminMetrics | null;
}

export default function OverviewTab({ metrics }: OverviewTabProps): React.JSX.Element {
  const t = useTranslations("Admin.Metrics");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Dumbbell className="w-6 h-6" />} 
          label={t("exercises")} 
          value={metrics?.total_exercises || 0} 
        />
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          label={t("total_trainers")} 
          value={metrics?.total_trainers || 0} 
        />
        <StatCard 
          icon={<UserCheck className="w-6 h-6" />} 
          label={t("pending")} 
          value={metrics?.pending_trainers || 0} 
        />
        <StatCard 
          icon={<Shield className="w-6 h-6" />} 
          label={t("students")} 
          value={metrics?.total_students || 0} 
        />
      </div>

      <Card variant="default" padding="lg">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-primary" />
          {t("platform_health")}
        </h3>
        <p className="text-sm text-text-subtle leading-relaxed">
          {t("platform_health_desc")}
        </p>
      </Card>
    </div>
  );
}
