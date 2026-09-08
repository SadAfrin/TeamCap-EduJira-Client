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
  const [notices, setNotices] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [routine, setRoutine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && role && role !== "student") {
      router.push(`/dashboard/${role}`);
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, noticesRes, assignRes, routineRes] = await Promise.all([
          apiGet(`/api/stats/student-portal?email=${encodeURIComponent(user?.email || "")}`),
          apiGet(`/api/notices?role=student&limit=3`),
          apiGet(`/api/assignments?className=Class 8&studentId=STD-801`),
          apiGet(`/api/routines?className=Class 8&section=B&day=Sunday`),
        ]);

        if (statsRes.success) setStudentData(statsRes.data);
        if (noticesRes.success) setNotices(noticesRes.data?.slice(0, 3) || []);
        if (assignRes.success) setAssignments(assignRes.data?.slice(0, 3) || []);
        if (routineRes.success && routineRes.data?.[0]?.periodSlots) {
          setRoutine(routineRes.data[0].periodSlots);
        }
      } catch (err) {
        console.error("Failed to load student portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (role === "student" || !role) {
      loadData();
    }
  }, [role, user]);

  const student = studentData?.student || {
    studentId: "STD-801",
    name: user?.name || "Rahim Uddin",
    className: "Class 8",
    section: "B",
    roll: "01",
  };

  const attendancePercent = studentData?.attendancePercentage ?? 94;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Student Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md border border-emerald-400/30">
                Student Learning Portal
              </span>
              <span className="text-xs text-slate-300 font-medium">• {student.className} – Section {student.section}</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {student.name}! 🎓
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Stay ahead in your studies. Check today's routine, monitor attendance, complete assignments, and ask the 24/7 AI tutor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/student/ai-tutor"
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-900/30 hover:brightness-110 transition-all"
            >
              <span>🤖 AI Tutor Assistant</span>
            </Link>
            <Link
              href="/dashboard/student/routine"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 border border-white/15 transition-all"
            >
              <span>Class Timetable</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "My Routine", icon: "📅", href: "/dashboard/student/routine", color: "hover:border-emerald-300" },
          { label: "Attendance", icon: "📊", href: "/dashboard/student/attendance", color: "hover:border-blue-300" },
          { label: "Assignments", icon: "📝", href: "/dashboard/student/assignments", color: "hover:border-purple-300" },
          { label: "Exam Results", icon: "🏆", href: "/dashboard/student/results", color: "hover:border-amber-300" },
          { label: "AI Tutor Bot", icon: "🤖", href: "/dashboard/student/ai-tutor", color: "hover:border-indigo-300" },
          { label: "Career Tracker", icon: "🚀", href: "/dashboard/student/career-tracker", color: "hover:border-rose-300" },
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Profile</span>
            <Link href="/dashboard/student/profile" className="text-xs font-bold text-emerald-600 hover:underline">
              Edit Profile →
            </Link>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-extrabold text-slate-900">{student.name}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 border border-emerald-200">
                {student.className} - {student.section}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                Roll #{student.roll || "01"}
              </span>
              <span className="font-mono text-slate-500 font-semibold">{student.studentId}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
            <Link href="/dashboard/student/attendance" className="text-xs font-bold text-emerald-600 hover:underline">
              View Logs →
            </Link>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{attendancePercent}%</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${attendancePercent >= 80 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {attendancePercent >= 80 ? "Regular" : "Needs Attention"}
            </span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${attendancePercent}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Curriculum & GPA</span>
            <Link href="/dashboard/student/results" className="text-xs font-bold text-indigo-600 hover:underline">
              Report Card →
            </Link>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">5.00</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">Grade A+</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Mid-Term Term Examination Average: 91.5%</p>
        </div>
      </div>

      {/* Grid: Routine + Announcements & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Class Schedule</h2>
              <p className="text-xs text-slate-500 mt-0.5">Periods & Room assignments</p>
            </div>
            <Link href="/dashboard/student/routine" className="text-xs font-bold text-emerald-600 hover:underline">
              Full Timetable →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {(routine.length > 0 ? routine : [
              { period: "1st Period", time: "09:00 - 09:45 AM", subject: "Mathematics", teacher: "Mohammad Rafiq", room: "Room 201" },
              { period: "2nd Period", time: "09:50 - 10:35 AM", subject: "English Literature", teacher: "Farzana Yasmin", room: "Room 201" },
              { period: "3rd Period", time: "10:40 - 11:25 AM", subject: "General Science", teacher: "Dr. Anisur Rahman", room: "Room 201" },
              { period: "4th Period", time: "11:45 - 12:30 PM", subject: "ICT & Computing", teacher: "Tanvir Hasan", room: "Computer Lab" },
            ]).map((slot: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{slot.subject}</span>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                      {slot.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{slot.teacher} • {slot.room}</p>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notices & Assignments Preview */}
        <div className="space-y-6">
          {/* Recent Notices */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Announcements & Notices</h2>
              <span className="text-xs font-bold text-indigo-600">Targeted for you</span>
            </div>
            <div className="mt-4 space-y-3">
              {notices.length > 0 ? (
                notices.map((n) => (
                  <div key={n._id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700 uppercase">
                        {n.category || "Notice"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">{n.body}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-3">No new notices at this time.</p>
              )}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Homework & Assignments</h2>
              <Link href="/dashboard/student/assignments" className="text-xs font-bold text-indigo-600 hover:underline">
                View All →
              </Link>
            </div>
            <div className="mt-4 space-y-2.5">
              {assignments.length > 0 ? (
                assignments.map((a) => (
                  <div key={a._id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{a.subjectName} • Due: {a.deadline}</p>
                    </div>
                    <Link
                      href="/dashboard/student/assignments"
                      className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-500"
                    >
                      {a.hasSubmitted ? "View Grade" : "Submit"}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-3">All assignments completed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
