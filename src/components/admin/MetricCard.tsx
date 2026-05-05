import React, { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
}

export default function MetricCard({ 
  icon, 
  label, 
  value, 
  color 
}: MetricCardProps): React.JSX.Element {
  return (
    <div className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.02] flex flex-col items-center justify-center text-center group transition-all duration-300 overflow-hidden">
      <div className={`${color} mb-2 group-hover:scale-110 transition-transform shrink-0`}>
        {icon}
      </div>
      <span className="text-2xl font-bold text-white leading-none truncate w-full px-1">
        {value}
      </span>
      <span className="text-[10px] uppercase text-text-subtle mt-1 font-bold tracking-wider group-hover:text-brand-primary transition-colors truncate w-full px-1">
        {label}
      </span>
    </div>
  );
}
