import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
<<<<<<< HEAD
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
    // This tells the frontend to look at your backend auth.ts and inherit the 'role' field type
    inferAdditionalFields<typeof auth>(),
  ],
})
=======
import { emailOTPClient } from "better-auth/client/plugins"; // 1. Import the client plugin
>>>>>>> ff005a37a482e46cbf390d74e2401ba5c77981ea

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.BETTER_AUTH_URL || "http://localhost:3000"),
  plugins: [
    inferAdditionalFields<typeof auth>(), 
    emailOTPClient(), // 2. Add it to the plugins array
  ],
});

export const { signIn, signUp, useSession } = authClient;