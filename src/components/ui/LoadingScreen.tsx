import { Loader2 } from "lucide-react";

export default function LoadingScreen({ label, fullPage = true }: { label?: string; fullPage?: boolean }): React.JSX.Element {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center ${fullPage ? "bg-brand-secondary min-h-screen" : ""}`}>
      <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
      {label && (
        <p className="text-text-subtle text-[10px] font-black uppercase tracking-widest animate-pulse">{label}</p>
      )}
    </div>
  );
}
