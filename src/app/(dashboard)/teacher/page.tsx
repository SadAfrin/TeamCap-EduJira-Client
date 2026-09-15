"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { apiGet } from "@/lib/api";

export default function TeacherDashboard() {
  const { role, user, isLoading } = useAuthRole();
  const router = useRouter();
  const [portalData, setPortalData] = useState<any>(null);
  const [earlyWarnings, setEarlyWarnings] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && role && role !== "teacher") {
      router.push(`/dashboard/${role}`);
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, warningsRes, leavesRes] = await Promise.all([
          apiGet(`/api/stats/teacher-portal?email=${encodeURIComponent(user?.email || "")}`),
          apiGet(`/api/ai/early-warning?status=active`),
          apiGet(`/api/leaves?status=pending`),
        ]);

        if (statsRes.success) setPortalData(statsRes.data);
        if (warningsRes.success) setEarlyWarnings(warningsRes.data?.slice(0, 3) || []);
        if (leavesRes.success) setPendingLeaves(leavesRes.data?.slice(0, 3) || []);
      } catch (err) {
        console.error("Failed to load teacher portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (role === "teacher" || !role) {
      loadData();
    }
  }, [role, user]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Teacher Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md border border-blue-400/30">
                Teacher & Faculty Workspace
              </span>
              <span className="text-xs text-slate-300">• Class in Session</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || "Dr. Anisur Rahman"}! 👨‍🏫
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Take daily digital attendance, enter marks with AI automated narrative comments, review student leaves, and communicate with parents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/teacher/attendance"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
            >
              <span>✓ Take Daily Attendance</span>
            </Link>
            <Link
              href="/dashboard/teacher/grades"
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all"
            >
              <span>📊 Result & AI Narratives</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Digital Attendance", icon: "📋", href: "/dashboard/teacher/attendance", color: "hover:border-blue-300" },
          { label: "My Classes", icon: "🏫", href: "/dashboard/teacher/classes", color: "hover:border-emerald-300" },
          { label: "Grade Entry (AI)", icon: "🎯", href: "/dashboard/teacher/grades", color: "hover:border-purple-300" },
          { label: "Assignments", icon: "📝", href: "/dashboard/teacher/assignments", color: "hover:border-indigo-300" },
          { label: "Leave Requests", icon: "✉️", href: "/dashboard/teacher/leaves", color: "hover:border-amber-300" },
          { label: "Parent Messages", icon: "💬", href: "/dashboard/teacher/messages", color: "hover:border-rose-300" },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md ${item.color}`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-bold text-slate-800 text-center">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Classes</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{portalData?.assignedClasses?.length ?? 3}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Active</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(portalData?.assignedClasses || ["Class 8-A", "Class 8-B", "Class 9-A"]).map((c: string) => (
              <span key={c} className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-100">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Students Supervised</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{portalData?.totalStudentsAssigned ?? 25}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Enrolled</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Class 8 & Class 9 Divisions</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Actions</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{pendingLeaves.length + earlyWarnings.length}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Requires Review</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{pendingLeaves.length} leaves, {earlyWarnings.length} at-risk alerts</p>
        </div>
      </div>

      {/* Grid: At-risk Alert Banner + Today Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At Risk Alert Card (AI Early Warning) */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              <h3 className="font-extrabold text-rose-900 text-sm">AI Early Warning Alerts</h3>
            </div>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
              {earlyWarnings.length} Flagged
            </span>
          </div>
          <p className="text-xs text-rose-700">Students with low attendance or failing grade patterns:</p>

          <div className="space-y-2 mt-3">
            {earlyWarnings.length > 0 ? (
              earlyWarnings.map((flag) => (
                <div key={flag._id} className="rounded-xl border border-rose-200 bg-white p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{flag.studentName}</span>
                    <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-bold uppercase text-rose-800">
                      {flag.riskLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {flag.reasons?.join(", ") || "Attendance rate below 75%"}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-white p-4 text-center text-xs text-slate-500 border border-rose-100">
                No active critical risk flags.
              </div>
            )}
          </div>
        </div>

        {/* Today's Teaching Schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Today's Class Schedule</h2>
            <Link href="/dashboard/teacher/attendance" className="text-xs font-bold text-blue-600 hover:underline">
              Take Attendance →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { time: "09:00 AM - 09:45 AM", subject: "Mathematics", classInfo: "Class 8 - Sec B", room: "Room 201" },
              { time: "10:40 AM - 11:25 AM", subject: "General Science", classInfo: "Class 8 - Sec B", room: "Room 201" },
              { time: "01:30 PM - 02:15 PM", subject: "Physics", classInfo: "Class 9 - Sec A", room: "Room 301" },
            ].map((slot, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{slot.subject}</span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {slot.classInfo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{slot.room}</p>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
