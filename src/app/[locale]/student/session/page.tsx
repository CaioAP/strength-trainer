import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { WorkoutRunner } from "@/components/student/WorkoutRunner/WorkoutRunner";

export default function ActiveSessionPage(): React.JSX.Element {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-brand-secondary min-h-screen">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    }>
      <WorkoutRunner />
    </Suspense>
  );
}
