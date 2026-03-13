import { Suspense } from "react";
import { ResetPasswordPageClient } from "./client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}
