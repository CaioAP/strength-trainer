import React from "react";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

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
      <Text
        as="span"
        size="3xl"
        weight="black"
        italic
        tracking="tight"
        className="leading-none"
      >
        {value}
      </Text>
      <div className="mt-2">
        <Text
          as="span"
          size="xs"
          weight="bold"
          uppercase
          tracking="widest"
          className="block group-hover:text-brand-primary transition-colors"
        >
          {label}
        </Text>
        {subLabel && (
          <Text
            as="span"
            size="xs"
            weight="bold"
            variant="subtle"
            uppercase
            tracking="tight"
            className="block mt-0.5 opacity-60"
          >
            {subLabel}
          </Text>
        )}
      </div>
      <div className={`absolute top-0 right-0 w-8 h-8 ${color} opacity-5 -mr-4 -mt-4 rounded-full blur-xl`} />
    </Card>
  );
};
