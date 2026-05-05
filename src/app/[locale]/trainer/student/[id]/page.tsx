import React, { use } from "react";
import { StudentDetail } from "@/components/trainer/StudentDetail/StudentDetail";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  return <StudentDetail studentId={studentId} />;
}
