import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "plain";
  size?: "sm" | "md" | "lg" | "none";
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps): React.JSX.Element => {
  const baseStyles = "inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-brand-primary text-black shadow-subtle hover:opacity-90 rounded-md font-black uppercase tracking-widest",
    secondary: "bg-brand-surface text-white border border-white/10 hover:bg-gray-800 shadow-card rounded-md font-black uppercase tracking-widest",
    danger: "bg-status-error text-white hover:bg-status-error/90 shadow-subtle rounded-md font-black uppercase tracking-widest",
    ghost: "bg-transparent text-text-subtle hover:bg-white/5 hover:text-white rounded-md font-black uppercase tracking-widest",
    plain: "",
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-[9px]",
    md: "px-5 py-3 text-[10px]",
    lg: "px-8 py-4 text-xs",
    none: "",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
};
