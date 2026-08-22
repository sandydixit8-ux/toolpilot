import { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | ToolPilot",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
