import React, { Suspense } from "react";
import SuspenseLoader from "@/components/ui/SuspenseLoader";
import WorkoutRunner from "@/components/student/WorkoutRunner/WorkoutRunner";

interface SessionPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SessionPage({ params: _params }: SessionPageProps): Promise<React.JSX.Element> {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <WorkoutRunner studentId="" workoutId="" />
    </Suspense>
  );
}
