"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { apiGet } from "@/lib/api";

type OverviewData = {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalParents: number;
  totalAdmins: number;
  attendanceRate: number;
  presentToday: number;
  totalMarkedToday: number;
  classBreakdown: { className: string; count: number }[];
  recentStudents: any[];
  recentTeachers: any[];
};

export default function AdminDashboard() {
  const { role, user, isLoading } = useAuthRole();
  const router = useRouter();
  const [stats, setStats] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && role && role !== "admin") {
      router.push(`/${role}`);
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await apiGet("/api/stats/overview");
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    if (role === "admin") {
      loadStats();
    }
  }, [role]);

  if (isLoading || role !== "admin") return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 backdrop-blur-md border border-purple-400/30">
                Principal & Administrator Portal
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">System Active</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || "Admin"}! 👋
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Here is what's happening in your school today. Monitor student performance, faculty workload, and daily attendance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/students"
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-purple-700/30 transition-all hover:bg-purple-500 hover:shadow-lg"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add Student</span>
            </Link>
            <Link
              href="/attendance"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/15"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Mark Attendance</span>
            </Link>
          </div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-purple-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Students</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{loading ? "..." : stats?.totalStudents ?? 0}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Enrolled</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Across {stats?.totalClasses ?? 5} Grades</span>
            <Link href="/admin/students" className="font-semibold text-purple-600 hover:text-purple-700">Manage →</Link>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-blue-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Teachers & Faculty</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{loading ? "..." : stats?.totalTeachers ?? 0}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Active</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Subject Assigned</span>
            <Link href="/admin/teachers" className="font-semibold text-blue-600 hover:text-blue-700">Manage →</Link>
          </div>
        </div>

        {/* Classes & Sections */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-emerald-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Classes</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{loading ? "..." : stats?.totalClasses ?? 0}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Grades 6–10</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Multiple Sections</span>
            <Link href="/admin/classes" className="font-semibold text-emerald-600 hover:text-emerald-700">View →</Link>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-amber-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Attendance</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{loading ? "..." : `${stats?.attendanceRate ?? 95}%`}</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Present Rate</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>{stats?.presentToday ?? 0} Present recorded</span>
            <Link href="/attendance" className="font-semibold text-amber-600 hover:text-amber-700">Records →</Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: "Students", count: `${stats?.totalStudents ?? 0}`, href: "/admin/students", color: "border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-700" },
          { label: "Teachers", count: `${stats?.totalTeachers ?? 0}`, href: "/admin/teachers", color: "border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700" },
          { label: "Classes & Subjects", count: `${stats?.totalClasses ?? 0}`, href: "/admin/classes", color: "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700" },
          { label: "Parents", count: `${stats?.totalParents ?? 0}`, href: "/admin/parents", color: "border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-700" },
          { label: "Admins", count: `${stats?.totalAdmins ?? 0}`, href: "/admin/admins", color: "border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700" },
          { label: "Timetable", count: "Active", href: "/timetable", color: "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col justify-between rounded-xl border p-4 transition-all hover:shadow-xs hover:scale-[1.02] ${item.color}`}
          >
            <span className="text-xs font-semibold text-slate-600">{item.label}</span>
            <span className="mt-2 text-lg font-bold">{item.count}</span>
          </Link>
        ))}
      </div>

      {/* Bottom Grid: Class Distribution & Recent Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Enrollment Breakdown */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Student Enrollment by Class</h2>
          <p className="text-xs text-slate-500 mt-0.5">Distribution across primary academic tiers</p>

          <div className="mt-6 space-y-4">
            {stats?.classBreakdown && stats.classBreakdown.length > 0 ? (
              stats.classBreakdown.map((item) => (
                <div key={item.className} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{item.className}</span>
                    <span className="text-slate-500">{item.count} Students</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-purple-500 to-indigo-600"
                      style={{
                        width: `${Math.min(100, Math.max(15, (item.count / (stats.totalStudents || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">Loading breakdown data...</div>
            )}
          </div>
        </div>

        {/* Recently Added Students */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Student Roster</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest enrolled students in EduJira</p>
            </div>
            <Link
              href="/admin/students"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200/60"
            >
              View All Students →
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Class & Section</th>
                  <th className="pb-3 font-semibold">Parent Info</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentStudents && stats.recentStudents.length > 0 ? (
                  stats.recentStudents.map((st: any) => (
                    <tr key={st._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-800">{st.studentId}</td>
                      <td className="py-3 font-medium text-slate-900">{st.name}</td>
                      <td className="py-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                          {st.className} - {st.section}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{st.parentName || "—"}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          {st.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No recent students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
