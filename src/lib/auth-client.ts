import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins"; // 1. Import the client plugin

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(), 
    emailOTPClient(), // 2. Add it to the plugins array
  ],
});

export const { signIn, signUp, useSession } = authClient;