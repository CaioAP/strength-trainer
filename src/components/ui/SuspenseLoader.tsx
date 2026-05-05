import { Loader2 } from 'lucide-react';

export default function SuspenseLoader() {
  return (
    <div className="flex-1 flex items-center justify-center bg-brand-secondary min-h-screen">
      <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
    </div>
  );
}
