import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://skill-bridge-server-tau.vercel.app",
  fetchOptions: {
    credentials: "include", 
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
        },
        isBanned: {
          type: "boolean",
          required: false,
        },
      },
    }),
  ],
});
