import { createAuthClient } from "better-auth/react"
import type { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
    // This tells the frontend to look at your backend auth.ts and inherit the 'role' field type
    inferAdditionalFields<typeof auth>(),
  ],
})

export const { signIn, signUp, useSession } = createAuthClient()