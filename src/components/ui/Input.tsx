import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "default" | "minimal";
}

export const Input = ({
  label,
  error,
  variant = "default",
  className = "",
  id,
  ...props
}: InputProps): React.JSX.Element => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  if (variant === "minimal") {
    return (
      <input
        id={inputId}
        className={`bg-transparent outline-none transition-all ${className}`}
        {...props}
      />
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold text-text-subtle uppercase tracking-widest ml-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-brand-secondary rounded-md p-3 text-white text-sm outline-none focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-700 shadow-inner disabled:opacity-50 ${
          error ? "ring-1 ring-status-error" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs font-bold text-status-error ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
