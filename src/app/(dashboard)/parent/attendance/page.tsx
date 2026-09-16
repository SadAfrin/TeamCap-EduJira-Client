"use client";

import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useEffect } from "react";
import Link from "next/link";

export default function ParentAttendancePage() {
  const { role, isLoading } = useAuthRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role && role !== "parent") {
      router.push(`/${role}`);
    }
  }, [isLoading, role, router]);

  if (isLoading || role !== "parent") return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-900 via-orange-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-amber-950/10">
        <div className="relative z-10">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md border border-amber-400/30">
            Parent Portal
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">Child Attendance</h1>
          <p className="mt-1 text-sm text-slate-300 max-w-xl">
            Monitor your child&apos;s daily attendance and stay informed about their school presence.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <p className="text-sm text-slate-500">
          Your child&apos;s attendance is recorded by their teachers. Contact the school office for detailed attendance reports.
        </p>
        <Link
          href="/parent"
          className="mt-4 inline-flex items-center gap-1 rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-100 border border-amber-200"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
