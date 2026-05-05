import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = ({
  label,
  error,
  className = "",
  id,
  rows = 4,
  ...props
}: TextAreaProps): React.JSX.Element => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[10px] font-black text-text-subtle uppercase tracking-widest ml-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full bg-brand-secondary rounded-md p-3 text-white text-sm outline-none focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-700 shadow-inner resize-none disabled:opacity-50 ${
          error ? "ring-1 ring-status-error" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-bold text-status-error ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
