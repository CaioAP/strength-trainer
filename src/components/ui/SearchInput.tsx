import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchInput({ placeholder, value, onChange, className = '' }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
      <input
        placeholder={placeholder}
        className="w-full bg-brand-surface shadow-card rounded-md py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-brand-primary transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
