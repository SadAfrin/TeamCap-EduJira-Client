"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthRole } from "@/hooks/useAuthRole";
import { apiGet } from "@/lib/api";

export default function AdminOverviewPage() {
  const { user } = useAuthRole();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await apiGet("/api/stats/overview");
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 backdrop-blur-md border border-purple-400/30">
                👑 Super Admin Console
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">All Services Online</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.name || "Admin"}! 👋
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              EduJira Central Administration. Manage institutional users, automate routine allocations, and track academic risk analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/admin/users"
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-purple-700/30 transition-all hover:bg-purple-500 hover:shadow-lg"
            >
              <span>User Directory</span>
            </Link>
            <Link
              href="/dashboard/admin/ai-warning"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/15"
            >
              <span>⚡ AI Risk Early Warning</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Students</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{loading ? "..." : stats?.totalStudents ?? 25}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Enrolled</span>
          </div>
          <Link href="/dashboard/admin/users" className="mt-3 block text-xs font-semibold text-purple-600 hover:text-purple-700">Manage directory →</Link>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Faculty</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{loading ? "..." : stats?.totalTeachers ?? 5}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Teachers</span>
          </div>
          <Link href="/dashboard/admin/users" className="mt-3 block text-xs font-semibold text-blue-600 hover:text-blue-700">View faculty →</Link>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Classes Configured</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{loading ? "..." : stats?.totalClasses ?? 5}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Grades 6-10</span>
          </div>
          <Link href="/dashboard/admin/academic" className="mt-3 block text-xs font-semibold text-emerald-600 hover:text-emerald-700">Academic setup →</Link>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{loading ? "..." : `${stats?.attendanceRate ?? 95}%`}</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Daily Average</span>
          </div>
          <Link href="/attendance" className="mt-3 block text-xs font-semibold text-amber-600 hover:text-amber-700">View attendance logs →</Link>
        </div>
      </div>

      {/* Module Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-3 font-bold">
            👥
          </div>
          <h3 className="font-bold text-slate-900 text-base">User Management</h3>
          <p className="text-xs text-slate-500 mt-1">
            CRUD for Admins, Teachers, Students, and Parents with Class/Section assignments.
          </p>
          <Link
            href="/dashboard/admin/users"
            className="mt-4 inline-block text-xs font-bold text-purple-600 hover:text-purple-700"
          >
            Open User Directory →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3 font-bold">
            🏫
          </div>
          <h3 className="font-bold text-slate-900 text-base">Academic Setup</h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage Class levels, Section capacities, Course curricula, and Subject Teacher allocations.
          </p>
          <Link
            href="/dashboard/admin/academic"
            className="mt-4 inline-block text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Manage Academic Structure →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3 font-bold">
            ⚡
          </div>
          <h3 className="font-bold text-slate-900 text-base">AI Early Warning System</h3>
          <p className="text-xs text-slate-500 mt-1">
            Predictive risk analytics identifying students who need early academic or attendance intervention.
          </p>
          <Link
            href="/dashboard/admin/ai-warning"
            className="mt-4 inline-block text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            View AI Risk Analysis →
          </Link>
        </div>
      </div>
    </div>
  );
}
