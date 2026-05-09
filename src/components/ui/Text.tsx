import React from "react";

type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
type TextWeight = "normal" | "medium" | "semibold" | "bold" | "black";
type TextVariant = "default" | "primary" | "secondary" | "accent" | "subtle" | "error" | "warning" | "success";
type TextTracking = "tight" | "normal" | "wide" | "widest";

interface TextProps {
  children: React.ReactNode;
  as?: React.ElementType;
  size?: TextSize;
  weight?: TextWeight;
  variant?: TextVariant;
  uppercase?: boolean;
  italic?: boolean;
  underline?: boolean;
  tracking?: TextTracking;
  className?: string;
}

/**
 * Standardized Text component to enforce consistent typography.
 * ALWAYS use this component instead of raw HTML text tags for UI labels.
 * Strictly uses standard Tailwind classes.
 */
export const Text = ({
  children,
  as: Component = "p",
  size = "base",
  weight = "normal",
  variant = "default",
  uppercase = false,
  italic = false,
  underline = false,
  tracking = "normal",
  className = "",
}: TextProps): React.JSX.Element => {
  const sizeStyles: Record<TextSize, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  const weightStyles: Record<TextWeight, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    black: "font-black",
  };

  const variantStyles: Record<TextVariant, string> = {
    default: "text-white",
    primary: "text-brand-primary",
    secondary: "text-brand-secondary",
    accent: "text-brand-accent",
    subtle: "text-text-subtle",
    error: "text-status-error",
    warning: "text-status-warning",
    success: "text-status-success",
  };

  const trackingStyles: Record<TextTracking, string> = {
    tight: "tracking-tighter",
    normal: "tracking-normal",
    wide: "tracking-wider",
    widest: "tracking-widest",
  };

  const combinedClasses = [
    sizeStyles[size],
    weightStyles[weight],
    variantStyles[variant],
    trackingStyles[tracking],
    uppercase ? "uppercase" : "",
    italic ? "italic" : "",
    underline ? "underline" : "",
    className,
  ].filter(Boolean).join(" ");

  return <Component className={combinedClasses}>{children}</Component>;
};
