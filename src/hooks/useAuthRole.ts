"use client";

import { authClient } from "@/lib/auth-client";

export type Role = "admin" | "teacher" | "student" | "parent";

export function useAuthRole() {
  const { data: session, isPending } = authClient.useSession();

  const role = (session?.user as { role?: Role } | undefined)?.role ?? null;

  return {
    role,
    isAuthenticated: !!session,
    isLoading: isPending,
    user: session?.user ?? null,
  };
}