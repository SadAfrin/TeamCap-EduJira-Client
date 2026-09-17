import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
<<<<<<< HEAD
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
=======
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
>>>>>>> 619ecd2a405a7beba7d7653bd8fda7820ed323f0
});

export const { signIn, signUp, useSession } = authClient;
