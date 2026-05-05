import { AlertCircle } from "lucide-react";

export default function ErrorBanner({ message }: { message: string }): React.JSX.Element {
  return (
    <div className="bg-status-error/10 border border-status-error/20 p-3 rounded flex items-center gap-2 justify-center">
      <AlertCircle className="w-4 h-4 text-status-error shrink-0" />
      <p className="text-status-error text-[10px] font-bold uppercase tracking-widest">{message}</p>
    </div>
  );
}
