import React from "react";
import { useTranslations } from "next-intl";
import { BarChart3, Dumbbell, Users, UserCheck, Shield } from "lucide-react";
import MetricCard from "./MetricCard";
import { AdminMetrics } from "./AdminDashboard.types";

interface OverviewTabProps {
  metrics: AdminMetrics | null;
}

export default function OverviewTab({ metrics }: OverviewTabProps): React.JSX.Element {
  const t = useTranslations("Admin.Metrics");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard 
          icon={<Dumbbell />} 
          label={t("exercises")} 
          value={metrics?.total_exercises || 0} 
          color="text-brand-primary" 
        />
        <MetricCard 
          icon={<Users />} 
          label={t("total_trainers")} 
          value={metrics?.total_trainers || 0} 
          color="text-brand-accent" 
        />
        <MetricCard 
          icon={<UserCheck />} 
          label={t("pending")} 
          value={metrics?.pending_trainers || 0} 
          color="text-status-warning" 
        />
        <MetricCard 
          icon={<Shield />} 
          label={t("students")} 
          value={metrics?.total_students || 0} 
          color="text-status-success" 
        />
      </div>

      <div className="bg-brand-surface p-6 rounded-lg shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-primary" />
          {t("platform_health")}
        </h3>
        <p className="text-sm text-text-subtle">
          {t("platform_health_desc")}
        </p>
      </div>
    </div>
  );
}
