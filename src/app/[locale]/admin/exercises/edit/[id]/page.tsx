import React from "react";
import { ExerciseEditor } from "@/components/admin/ExerciseEditor/ExerciseEditor";

interface EditExercisePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExercisePage({ params }: EditExercisePageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <ExerciseEditor exerciseId={id} />;
}
