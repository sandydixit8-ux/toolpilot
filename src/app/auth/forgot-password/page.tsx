import { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | ToolPilot",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
