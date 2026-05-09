interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

export default function ToggleRow({ label, description, checked, onToggle }: ToggleRowProps): React.JSX.Element {
  return (
    <div
      onClick={onToggle}
      className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
    >
      <div className="flex-1 pr-4">
        <p className="font-bold text-white text-sm group-hover:text-brand-primary transition-colors">{label}</p>
        <p className="text-xs text-text-subtle mt-1 leading-normal">{description}</p>
      </div>
      <div
        className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${
          checked ? "bg-brand-primary shadow-[0_0_10px_rgba(206,255,5,0.3)]" : "bg-gray-800"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-all shadow-md ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}
