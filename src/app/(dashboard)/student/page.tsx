"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { apiGet } from "@/lib/api";

export default function StudentDashboard() {
  const { role, user, isLoading } = useAuthRole();
  const router = useRouter();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && role && role !== "student") {
      router.push(`/${role}`);
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/stats/student-portal?email=${encodeURIComponent(user?.email || "")}`);
        if (res.success) {
          setStudentData(res.data);
        }
      } catch (err) {
        console.error("Failed to load student portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (role === "student") {
      loadData();
    }
  }, [role, user]);

  if (isLoading || role !== "student") return null;

  const student = studentData?.student || {
    studentId: "STD-801",
    name: user?.name || "Student",
    className: "Class 8",
    section: "B",
    roll: "01",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Student Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md border border-emerald-400/30">
                Student Learning Portal
              </span>
              <span className="text-xs text-slate-300">• {student.className} – Section {student.section}</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.name || student.name}! 🎓
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Stay ahead in your studies. Check today's routine, monitor attendance, and prepare for upcoming tests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/timetable"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-700/30 transition-all hover:bg-emerald-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Class Timetable</span>
            </Link>
            <Link
              href="/calendar"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/15"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>Academic Calendar</span>
            </Link>
          </div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Profile</span>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-slate-900">{student.name}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 border border-emerald-200">
                {student.className} - {student.section}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                Roll #{student.roll || "01"}
              </span>
              <span className="font-mono text-slate-500">{student.studentId}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {studentData?.attendancePercentage ?? 94}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Excellent</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${studentData?.attendancePercentage ?? 94}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Subjects</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {studentData?.subjects?.length ?? 6}
            </span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Core & Electives</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Curriculum for Grade 8 JSC</p>
        </div>
      </div>

      {/* Grid: Subjects + Today Routine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Subjects */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Enrolled Subjects & Faculty</h2>
          <p className="text-xs text-slate-500 mt-0.5">Your registered academic curriculum</p>

          <div className="mt-5 space-y-3">
            {studentData?.subjects && studentData.subjects.length > 0 ? (
              studentData.subjects.map((sub: any) => (
                <div
                  key={sub.subjectCode}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100 font-mono">
                      {sub.subjectCode.slice(0, 4)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{sub.name}</h4>
                      <p className="text-xs text-slate-500">{sub.teacherName || "Assigned Teacher"}</p>
                    </div>
                  </div>
                  <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                    {sub.credits || 3} Credits
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">Loading subjects...</div>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Today's Class Schedule</h2>
            <span className="text-xs font-bold text-emerald-600">Day Routine</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Periods & Classroom locations</p>

          <div className="mt-5 space-y-3">
            {[
              { period: "1st Period", time: "09:00 - 09:45 AM", subject: "Mathematics", teacher: "Mohammad Rafiq", room: "Room 201" },
              { period: "2nd Period", time: "09:50 - 10:35 AM", subject: "English Literature", teacher: "Farzana Yasmin", room: "Room 201" },
              { period: "3rd Period", time: "10:40 - 11:25 AM", subject: "General Science", teacher: "Dr. Anisur Rahman", room: "Room 201" },
              { period: "4th Period", time: "11:45 - 12:30 PM", subject: "ICT & Computing", teacher: "Tanvir Hasan", room: "Computer Lab" },
            ].map((slot, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{slot.subject}</span>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                      {slot.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{slot.teacher} • {slot.room}</p>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-600">{slot.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <Link
              href="/timetable"
              className="flex w-full items-center justify-center gap-1 rounded-xl bg-emerald-50 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            >
              Open Full Timetable →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
