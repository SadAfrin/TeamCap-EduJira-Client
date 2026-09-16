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
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && role && role !== "parent") {
      router.push(`/dashboard/${role}`);
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, noticesRes] = await Promise.all([
          apiGet(`/api/stats/parent-portal?email=${encodeURIComponent(user?.email || "")}`),
          apiGet(`/api/notices?role=parent&limit=3`),
        ]);

        if (statsRes.success) setParentData(statsRes.data);
        if (noticesRes.success) setNotices(noticesRes.data?.slice(0, 3) || []);
      } catch (err) {
        console.error("Failed to load parent portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (role === "parent" || !role) {
      loadData();
    }
  }, [role, user]);

  const children = parentData?.children || [
    {
      studentId: "STD-801",
      name: "Rahim Uddin",
      className: "Class 8",
      section: "B",
      roll: "01",
      gender: "Male",
      bloodGroup: "A+",
      status: "approved",
    },
  ];

  const activeChild = children[selectedChildIndex] || children[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Parent Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-950 via-orange-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-amber-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md border border-amber-400/30">
                Guardian & Parent Portal
              </span>
              <span className="text-xs text-slate-300">• Multi-Child Hub</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || "Tariqul Islam"}! 👨‍👩‍👧
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Monitor attendance, check transcripts & AI teacher comments, submit leave applications, and message teachers directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/parent/leave-request"
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition-all"
            >
              <span>✉️ Apply for Leave</span>
            </Link>
            <Link
              href="/dashboard/parent/messages"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 border border-white/15 transition-all"
            >
              <span>💬 Message Teacher</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Children Selector (if multiple) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Enrolled Children ({children.length})</h2>
          <span className="text-xs text-slate-400">Select child to view academic report</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {children.map((child: any, idx: number) => {
            const isSelected = selectedChildIndex === idx;
            return (
              <button
                key={child.studentId}
                onClick={() => setSelectedChildIndex(idx)}
                className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-base shadow-sm ${
                    isSelected ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {child.name?.charAt(0) || "C"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 truncate text-sm">{child.name || child.studentName}</h3>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Child Progress", icon: "📈", href: "/dashboard/parent/child-progress", color: "hover:border-amber-300" },
          { label: "Attendance Logs", icon: "📊", href: "/dashboard/parent/attendance", color: "hover:border-blue-300" },
          { label: "Exam Results", icon: "🏆", href: "/dashboard/parent/results", color: "hover:border-purple-300" },
          { label: "Leave Request", icon: "✉️", href: "/dashboard/parent/leave-request", color: "hover:border-emerald-300" },
          { label: "Translated Notices", icon: "🌐", href: "/dashboard/parent/notices", color: "hover:border-indigo-300" },
          { label: "Teacher Chat", icon: "💬", href: "/dashboard/parent/messages", color: "hover:border-rose-300" },
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

      {/* Child Metrics Card */}
      {activeChild && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Status</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">96%</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Regular</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Present 22 out of 23 working days this month</p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Standing</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">GPA 5.00</span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Grade A+</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Class 8 – Mid-Term Exam</p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Class Information</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{activeChild.className}</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Sec {activeChild.section}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Class Teacher: Dr. Anisur Rahman</p>
          </div>
        </div>
      )}

      {/* Routine & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Child Schedule */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">{activeChild?.name || "Child"}'s Routine Schedule</h2>
            <span className="text-xs font-bold text-amber-600">Today</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Classes scheduled for this day</p>

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
                    <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                      {slot.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{slot.teacher} • {slot.room}</p>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">School Notices & Updates</h2>
            <Link href="/dashboard/parent/notices" className="text-xs font-bold text-amber-600 hover:underline">
              Multilingual View →
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Announcements targeted for parents</p>

          <div className="mt-5 space-y-3">
            {notices.map((n) => (
              <div key={n._id} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                    {n.category || "Notice"}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
