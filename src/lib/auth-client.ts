import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://skill-bridge-server-tau.vercel.app",
  fetchOptions: {
    credentials: "include", 
  },
  plugins: [
    // Example: if you have custom user fields (role, etc.)
    // inferAdditionalFields({
    //   user: {
    //     role: { type: "string" },
    //   },
    // }),
  ],
});