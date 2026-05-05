import React from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage(): React.JSX.Element {
  return (
    <main className="flex-1 flex flex-col justify-center items-center p-6 bg-brand-secondary min-h-screen">
      <ForgotPasswordForm />
    </main>
  );
}
