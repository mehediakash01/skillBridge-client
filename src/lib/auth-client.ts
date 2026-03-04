import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  baseURL:  process.env.AUTH_URL || "http://localhost:5000",
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