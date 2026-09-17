import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { inferAdditionalFields, emailOTPClient } from "better-auth/client/plugins";

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