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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && role && role !== "teacher") {
      router.push(`/${role}`);
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/stats/teacher-portal?email=${encodeURIComponent(user?.email || "")}`);
        if (res.success) {
          setPortalData(res.data);
        }
      } catch (err) {
        console.error("Failed to load teacher portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (role === "teacher") {
      loadData();
    }
  }, [role, user]);

  if (isLoading || role !== "teacher") return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Teacher Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md border border-blue-400/30">
                Teacher & Faculty Portal
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300">Class In Session</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
              Hello, {user?.name || "Teacher"}! 👨‍🏫
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Track your assigned classrooms, mark attendance in one click, and manage student performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/attendance"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-700/30 transition-all hover:bg-blue-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Take Daily Attendance</span>
            </Link>
            <Link
              href="/timetable"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/15"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>View Timetable</span>
            </Link>
          </div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Classrooms</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{portalData?.assignedClasses?.length ?? 3}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Classes</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {portalData?.assignedClasses?.map((c: string) => (
              <span key={c} className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Supervised Students</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{portalData?.totalStudentsAssigned ?? 25}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Students</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Active across your assigned divisions</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">My Subjects</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{portalData?.subjects?.length ?? 4}</span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Curriculums</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Physics, General Science, Mathematics</p>
        </div>
      </div>

      {/* Main Grid: Today's Routine + Student Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Schedule */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Today's Class Routine</h2>
            <span className="text-xs font-bold text-blue-600">3 Sessions</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Schedule for Wednesday</p>

          <div className="mt-5 space-y-3.5">
            {[
              { time: "09:00 AM - 09:45 AM", subject: "Physics", classInfo: "Class 9 - Sec A", room: "Room 301", current: true },
              { time: "10:30 AM - 11:15 AM", subject: "General Science", classInfo: "Class 8 - Sec B", room: "Room 201", current: false },
              { time: "01:30 PM - 02:15 PM", subject: "Higher Math Lab", classInfo: "Class 10 - Sec A", room: "Lab 2", current: false },
            ].map((slot, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-3.5 border transition-all ${
                  slot.current
                    ? "border-blue-300 bg-blue-50/70 shadow-xs"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{slot.subject}</span>
                  <span className="font-mono text-[11px] font-semibold text-slate-500">{slot.time}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium text-blue-700">{slot.classInfo}</span>
                  <span className="text-[11px] text-slate-400">{slot.room}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <Link
              href="/timetable"
              className="flex w-full items-center justify-center gap-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              View Full Week Timetable →
            </Link>
          </div>
        </div>

        {/* Assigned Students Roster */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Students in Your Classes</h2>
              <p className="text-xs text-slate-500 mt-0.5">Quick roster across Class 8 and Class 9</p>
            </div>
            <Link
              href="/attendance"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
            >
              Take Attendance →
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-semibold">Student ID</th>
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Class</th>
                  <th className="pb-3 font-semibold">Roll</th>
                  <th className="pb-3 font-semibold">Parent Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {portalData?.students && portalData.students.length > 0 ? (
                  portalData.students.slice(0, 7).map((st: any) => (
                    <tr key={st.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-blue-700">{st.studentId}</td>
                      <td className="py-3 font-medium text-slate-900">{st.name}</td>
                      <td className="py-3 font-semibold text-slate-700">{st.className} - {st.section}</td>
                      <td className="py-3 font-mono text-slate-500">#{st.roll || "—"}</td>
                      <td className="py-3 text-slate-500">{st.parentPhone || st.parentName || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No student records available.
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
