import React from "react";
import { Settings } from "lucide-react";
import { Button } from "./Button";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onSettingsClick: () => void;
  titleClassName?: string;
}

export const DashboardHeader = ({
  title,
  subtitle,
  onSettingsClick,
  titleClassName = "",
}: DashboardHeaderProps): React.JSX.Element => {
  return (
    <header className="flex justify-between items-start mb-8">
      <div>
        <h1 className={`text-2xl font-bold text-brand-primary ${titleClassName}`}>
          {title}
        </h1>
        <p className="text-text-subtle text-sm font-bold uppercase tracking-widest mt-0.5">
          {subtitle}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onSettingsClick}
        className="p-2 rounded-full text-white active:rotate-45 transition-all"
      >
        <Settings className="w-6 h-6" />
      </Button>
    </header>
  );
};
