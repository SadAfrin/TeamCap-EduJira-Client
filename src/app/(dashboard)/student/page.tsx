"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";

export default function StudentDashboard() {
  const { role, isLoading } = useAuthRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role && role !== "student") {
      router.push(`/${role}`); // wrong portal — bounce to their real one
    }
  }, [isLoading, role, router]);

  if (isLoading || role !== "student") return null;

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <h1 style={{ fontFamily: "var(--font-fraunces)" }} className="text-3xl font-semibold text-slate-900">
        Student Dashboard
      </h1>
      <p className="mt-2 text-slate-500">School-wide overview and management tools.</p>
    </div>
  );
}