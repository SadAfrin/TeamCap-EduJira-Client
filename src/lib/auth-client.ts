import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";

const baseURL = (
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : process.env.BETTER_AUTH_URL || "http://localhost:3000")
).replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL,
  plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()],
});

export const { signIn, signUp, useSession } = authClient;
