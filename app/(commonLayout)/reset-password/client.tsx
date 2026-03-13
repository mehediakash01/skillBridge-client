"use client";

import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/modules/authentication/reset-password-form";

export function ResetPasswordPageClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  return <ResetPasswordForm token={token} />;
}
