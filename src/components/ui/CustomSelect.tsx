"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronLeft, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface Option {
  id?: string;
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option", 
  disabled = false,
  className = ""
}: CustomSelectProps): React.JSX.Element {
  const t = useTranslations("Common");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.name === value);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(opt => 
      opt.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (): void => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleDropdown = (): void => {
    if (disabled) return;
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (!nextState) setSearchQuery("");
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        onClick={toggleDropdown}
        className={`w-full bg-brand-secondary shadow-inner rounded-md p-3 text-left flex items-center justify-between transition-all outline-none ${
          isOpen ? "ring-1 ring-brand-primary" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/5"}`}
      >
        <div className="flex-1 flex items-center min-w-0">
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent border-none outline-none text-white p-0 text-sm placeholder:text-text-subtle"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={`${!selectedOption ? "text-text-subtle" : "text-white"} truncate text-sm`}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2">
          {searchQuery && (
            <Button 
              variant="ghost"
              size="none"
              onClick={(e) => { e.stopPropagation(); setSearchQuery(""); }}
              className="p-1 text-text-subtle hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          <ChevronLeft className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${isOpen ? "rotate-90" : "-rotate-90"}`} />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 w-full mt-2 bg-brand-surface shadow-card rounded-md z-100 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1">
            {filteredOptions.map((option) => (
              <div
                key={option.id || option.name}
                onClick={() => {
                  onChange(option.name);
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className={`p-3 rounded-sm text-sm cursor-pointer transition-colors ${
                  value === option.name 
                  ? "bg-brand-primary text-black font-bold" 
                  : "text-white hover:bg-brand-secondary"
                }`}
              >
                {option.name}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="p-3 text-xs text-text-subtle text-center italic">
                {t("no_exercises_found")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
