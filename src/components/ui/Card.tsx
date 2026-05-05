import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "interactive" | "modal" | "panel";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({
  children,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}: CardProps): React.JSX.Element => {
  const baseStyles = "bg-brand-surface rounded-lg transition-all duration-300 overflow-hidden";
  
  const variantStyles = {
    default: "shadow-card",
    interactive: "shadow-card hover:shadow-card-hover hover:scale-101 cursor-pointer",
    modal: "border border-gray-800 shadow-elevated",
    panel: "shadow-elevated rounded-xl",
  };

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-8",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`.trim();

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};
