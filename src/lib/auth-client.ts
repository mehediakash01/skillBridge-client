import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  baseURL:  "https://skill-bridge-server-tau.vercel.app", 
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