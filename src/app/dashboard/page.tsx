"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";

export default function DashboardIndexPage() {
  const { role, isLoading, isAuthenticated } = useAuthRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        router.push(`/dashboard/${role?.toLowerCase() || "student"}`);
      }
    }
  }, [isLoading, isAuthenticated, role, router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
    </div>
  );
}
