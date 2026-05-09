import React from "react";
import { Card } from "./Card";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  titleVariant?: "subtle" | "primary" | "danger";
  padding?: "none" | "sm" | "md" | "lg";
  cardVariant?: "default" | "interactive" | "modal" | "panel";
  cardClassName?: string;
}

export const SettingsSection = ({
  title,
  description,
  children,
  className = "",
  titleVariant = "subtle",
  padding = "none",
  cardVariant = "default",
  cardClassName = "",
}: SettingsSectionProps): React.JSX.Element => {
  const titleColors = {
    subtle: "text-text-subtle mb-1",
    primary: "text-brand-primary mb-4",
    danger: "text-status-error mb-1",
  };

  return (
    <section className={`space-y-4 ${className}`}>
      <div className="px-1">
        <h3 className={`text-xs font-bold uppercase tracking-widest ${titleColors[titleVariant]}`}>
          {title}
        </h3>
        {description && (
          <p className="text-xs.75 text-text-subtle/60 leading-relaxed italic">
            {description}
          </p>
        )}
      </div>

      <Card padding={padding} variant={cardVariant} className={`divide-y divide-white/5 ${cardClassName}`}>
        {children}
      </Card>
    </section>
  );
};
