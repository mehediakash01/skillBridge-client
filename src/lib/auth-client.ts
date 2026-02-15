import { createAuthClient } from "better-auth/react";
import { env } from "../env";

export const authClient = createAuthClient({
  baseURL: env.BACKEND_URL|| "http://localhost:5000", 
  plugins: [
    // Example: if you have custom user fields (role, etc.)
    // inferAdditionalFields({
    //   user: {
    //     role: { type: "string" },
    //   },
    // }),
  ],
});