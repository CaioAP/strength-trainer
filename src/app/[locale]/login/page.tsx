import React, { Suspense } from "react";
import SuspenseLoader from "@/components/ui/SuspenseLoader";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage(): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-brand-secondary min-h-screen">
      <Suspense fallback={<SuspenseLoader />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
