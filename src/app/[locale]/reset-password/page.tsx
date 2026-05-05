import React, { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import SuspenseLoader from "@/components/ui/SuspenseLoader";

export default function ResetPasswordPage(): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-brand-secondary min-h-screen">
      <Suspense fallback={<SuspenseLoader />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
