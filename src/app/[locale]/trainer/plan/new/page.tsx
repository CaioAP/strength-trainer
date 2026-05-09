import React, { Suspense } from "react";
import { PlanEditor } from "@/components/trainer/PlanEditor/PlanEditor";
import SuspenseLoader from "@/components/ui/SuspenseLoader";

export default function NewPlanPage(): React.JSX.Element {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <PlanEditor />
    </Suspense>
  );
}
