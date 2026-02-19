import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  baseURL:  "http://localhost:5000", 
  plugins: [
    // Example: if you have custom user fields (role, etc.)
    // inferAdditionalFields({
    //   user: {
    //     role: { type: "string" },
    //   },
    // }),
  ],
});