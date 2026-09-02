"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { apiGet } from "@/lib/api";

export default function ParentDashboard() {
  const { role, user, isLoading } = useAuthRole();
  const router = useRouter();
  const [parentData, setParentData] = useState<any>(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && role && role !== "parent") {
      router.push(`/${role}`);
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/stats/parent-portal?email=${encodeURIComponent(user?.email || "")}`);
        if (res.success) {
          setParentData(res.data);
        }
      } catch (err) {
        console.error("Failed to load parent portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (role === "parent") {
      loadData();
    }
  }, [role, user]);

  if (isLoading || role !== "parent") return null;

  const children = parentData?.children || [
    {
      studentId: "STD-801",
      name: "Rahim Uddin",
      className: "Class 8",
      section: "B",
      roll: "01",
      gender: "Male",
      bloodGroup: "A+",
      status: "Active",
    },
  ];

  const activeChild = children[selectedChildIndex] || children[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Parent Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-950 via-orange-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-amber-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md border border-amber-400/30">
                Guardian & Parent Portal
              </span>
              <span className="text-xs text-slate-300">• Connected to EduJira</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.name || parentData?.parent?.name || "Parent"}! 👨‍👩‍👧
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Monitor your child's academic progress, daily classroom attendance, and school announcements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/calendar"
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-amber-700/30 transition-all hover:bg-amber-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>School Calendar</span>
            </Link>
            <Link
              href="/timetable"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/15"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Routine Schedule</span>
            </Link>
          </div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Children Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Your Children ({children.length})</h2>
          <span className="text-xs text-slate-400">Click to switch child view</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {children.map((child: any, idx: number) => {
            const isSelected = selectedChildIndex === idx;
            return (
              <button
                key={child.studentId}
                onClick={() => setSelectedChildIndex(idx)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-50/60 shadow-xs ring-2 ring-amber-500/20"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-base ${
                  isSelected ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700"
                }`}>
                  {child.name?.charAt(0) || child.studentName?.charAt(0) || "C"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 truncate text-sm">
                    {child.name || child.studentName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {child.className} – Section {child.section}
                  </p>
                  <span className="font-mono text-[10px] text-slate-400">{child.studentId}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Child Academic Metrics & Details */}
      {activeChild && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Status</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">96%</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Regular</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Present 22 out of 23 working days this month</p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Class & Section</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{activeChild.className}</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Sec {activeChild.section}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Class Teacher: Dr. Anisur Rahman</p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student ID & Roll</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-slate-900">{activeChild.studentId}</span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Roll #{activeChild.roll || "01"}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Blood Group: {activeChild.bloodGroup || "A+"}</p>
          </div>
        </div>
      )}

      {/* Routine & Notice Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Child's Daily Routine */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">{activeChild?.name || "Child"}'s Daily Routine</h2>
            <span className="text-xs font-bold text-amber-600">Today</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Classes scheduled for this day</p>

          <div className="mt-5 space-y-3">
            {[
              { period: "1st Period", time: "09:00 - 09:45 AM", subject: "Mathematics", teacher: "Mohammad Rafiq", room: "Room 201" },
              { period: "2nd Period", time: "09:50 - 10:35 AM", subject: "English Grammar", teacher: "Farzana Yasmin", room: "Room 201" },
              { period: "3rd Period", time: "10:40 - 11:25 AM", subject: "General Science", teacher: "Dr. Anisur Rahman", room: "Room 201" },
              { period: "4th Period", time: "11:45 - 12:30 PM", subject: "ICT & Computing", teacher: "Tanvir Hasan", room: "Computer Lab" },
            ].map((slot, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{slot.subject}</span>
                    <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                      {slot.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{slot.teacher} • {slot.room}</p>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-600">{slot.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* School Notices for Parents */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent School Announcements</h2>
            <span className="text-xs font-bold text-slate-500">Notice Board</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Official communications from school administration</p>

          <div className="mt-5 space-y-3">
            {[
              { title: "Mid-Term Examination Schedule Published", date: "Sep 01, 2026", priority: "Important" },
              { title: "Parent-Teacher Conference (PTC) Next Saturday", date: "Aug 28, 2026", priority: "Meeting" },
              { title: "Annual Sports Day Registration Open", date: "Aug 22, 2026", priority: "Notice" },
            ].map((notice, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{notice.title}</h4>
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                    {notice.priority}
                  </span>
                </div>
                <p className="mt-2 text-[11px] font-semibold text-slate-400">{notice.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
