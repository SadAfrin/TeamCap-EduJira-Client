"use client";

import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useEffect } from "react";
import Link from "next/link";

export default function StudentAttendancePage() {
  const { role, isLoading } = useAuthRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role && role !== "student") {
      router.push(`/${role}`);
    }
  }, [isLoading, role, router]);

  if (isLoading || role !== "student") return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10">
        <div className="relative z-10">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md border border-emerald-400/30">
            Student Attendance Portal
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">My Attendance</h1>
          <p className="mt-1 text-sm text-slate-300 max-w-xl">
            View your daily attendance records and track your presence across classes.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <p className="text-sm text-slate-500">
          Attendance records are managed by your teachers. If you notice any discrepancies, please contact your class teacher.
        </p>
        <Link
          href="/student"
          className="mt-4 inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
