import React, { Suspense } from "react";
import { SetPasswordForm } from "@/components/auth/SetPasswordForm";
import SuspenseLoader from "@/components/ui/SuspenseLoader";

export default function SetPasswordPage(): React.JSX.Element {
  return (
    <main className="flex-1 flex flex-col justify-center items-center p-6 bg-brand-secondary min-h-screen">
      <Suspense fallback={<SuspenseLoader />}>
        <SetPasswordForm />
      </Suspense>
    </main>
  );
}
