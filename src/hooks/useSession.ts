import { authClient } from "@/src/lib/auth-client";

export function useSession() {
  const session = authClient.useSession();

  return {
    ...session,
    isLoading: session.isPending,
  };
}
