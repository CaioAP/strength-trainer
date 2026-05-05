"use client";

import { Plus, Minus } from "lucide-react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  step?: number;
  disabled?: boolean;
}

export default function NumberInput({ 
  value, 
  onChange, 
  label, 
  min = 0, 
  step = 1,
  disabled = false 
}: NumberInputProps): React.JSX.Element {
  const handleIncrement = (): void => onChange(value + step);
  const handleDecrement = (): void => onChange(Math.max(min, value - step));

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-2.5 text-text-subtle uppercase font-black tracking-tighter text-center">
        {label}
      </label>
      <div className={`flex items-center bg-brand-secondary border border-gray-800 rounded-md overflow-hidden transition-all ${disabled ? "opacity-50" : "hover:border-gray-700 focus-within:ring-1 focus-within:ring-brand-primary focus-within:border-brand-primary"}`}>
        <button
          type="button"
          disabled={disabled}
          onClick={handleDecrement}
          className="p-2 text-text-subtle hover:text-brand-primary hover:bg-white/5 transition-colors disabled:pointer-events-none"
        >
          <Minus className="w-3 h-3" />
        </button>
        
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          disabled={disabled}
          className="w-full bg-transparent text-white text-center text-sm font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={handleIncrement}
          className="p-2 text-text-subtle hover:text-brand-primary hover:bg-white/5 transition-colors disabled:pointer-events-none"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
