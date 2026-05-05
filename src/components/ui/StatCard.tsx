import React from "react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  subLabel?: string;
  className?: string;
}

export const StatCard = ({
  icon,
  label,
  value,
  color = "text-brand-primary",
  subLabel,
  className = "",
}: StatCardProps): React.JSX.Element => {
  return (
    <Card
      variant="interactive"
      className={`flex flex-col items-center justify-center text-center relative overflow-hidden group ${className}`}
    >
      <div className={`${color} mb-2 transition-transform group-hover:scale-110 duration-500`}>
        {icon}
      </div>
      <span className="text-3xl font-black text-white leading-none tracking-tighter italic">
        {value}
      </span>
      <div className="mt-2">
        <span className="text-[9px] uppercase text-white font-black tracking-widest block group-hover:text-brand-primary transition-colors">
          {label}
        </span>
        {subLabel && (
          <span className="text-[8px] uppercase text-text-subtle font-bold tracking-tighter opacity-60 block mt-0.5">
            {subLabel}
          </span>
        )}
      </div>
      <div className={`absolute top-0 right-0 w-8 h-8 ${color} opacity-5 -mr-4 -mt-4 rounded-full blur-xl`} />
    </Card>
  );
};
