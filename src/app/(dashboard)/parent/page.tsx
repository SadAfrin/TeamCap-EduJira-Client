"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { apiGet } from "@/lib/api";
import LinkChildModal from "@/components/dashboard/LinkChildModal";
import { useParentChildren } from "@/hooks/useParentChildren";

export default function ParentDashboard() {
  const { role, user, isLoading } = useAuthRole();
  const { parent, children: linkedChildren, reload: reloadParent } = useParentChildren();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const router = useRouter();
  const [parentData, setParentData] = useState<any>(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [childStats, setChildStats] = useState<any>(null);
  const [childRoutine, setChildRoutine] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

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

        if (statsRes.success) {
          const rawChildren = statsRes.data?.children || [];
          const approvedChildren = rawChildren.filter((c: any) => c.status === "approved" || !c.status);
          setParentData({ ...statsRes.data, children: approvedChildren });
        }
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
  }, [role, user, refreshKey]);

  const children = parentData?.children || [];
  const activeChild = children[selectedChildIndex] || children[0];

  useEffect(() => {
    async function loadActiveChildData() {
      if (!activeChild?.studentId) return;
      try {
        const dayOfWeek = new Date().toLocaleDateString('en-US', {weekday: 'long'});
        const [attendanceRes, resultsRes, routineRes] = await Promise.all([
          apiGet(`/api/stats/student-portal?studentId=${activeChild.studentId}`),
          apiGet(`/api/results/transcript?studentId=${activeChild.studentId}&term=All`),
          apiGet(`/api/timetable?className=${encodeURIComponent(activeChild.className)}&section=${encodeURIComponent(activeChild.section)}&day=${encodeURIComponent(dayOfWeek)}`)
        ]);

        setChildStats({
          attendance: attendanceRes.success ? attendanceRes.data : null,
          results: resultsRes.success ? resultsRes.data : null,
        });

        if (routineRes.success && Array.isArray(routineRes.data)) {
          setChildRoutine(
            routineRes.data.map((slot: any) => ({
              period: slot.periodId || slot.period || slot.startTime || "Period",
              time: slot.time || `${slot.startTime || ""} – ${slot.endTime || ""}`.trim(),
              subject: slot.subject || slot.courseName || "Class",
              teacher: slot.teacher || slot.teacherName || "TBA",
              room: slot.room || "—",
            })),
          );
        } else {
          setChildRoutine([]);
        }
      } catch (err) {
        console.error("Failed to load active child data:", err);
      }
    }
    loadActiveChildData();
  }, [activeChild]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

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
              Welcome, {parentData?.parent?.name || user?.name || "Guardian"}! 👨‍👩‍👧
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Monitor attendance, check transcripts & AI teacher comments, submit leave applications, and message teachers directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/dashboard/parent/leave-request${activeChild ? `?studentId=${activeChild.studentId}` : ""}`}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition-all"
            >
              <span>✉️ Apply for Leave</span>
            </Link>
            <Link
              href={`/dashboard/parent/messages${activeChild ? `?studentId=${activeChild.studentId}` : ""}`}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 border border-white/15 transition-all"
            >
              <span>💬 Message Teacher</span>
            </Link>
          </div>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center shadow-sm">
          <div className="text-6xl mb-4">👦👧</div>
          <h2 className="text-xl font-bold text-slate-800">No Child Linked Yet</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            You haven't linked any children to your parent account. Link a child to monitor their academic progress, attendance, and routines.
          </p>
          <button
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition-all"
          >
            <span>🔗 Link a Child</span>
          </button>
          <Link
            href="/dashboard/parent/child-progress"
            className="mt-3 text-xs font-semibold text-amber-700 hover:underline"
          >
            Or go to Child Progress
          </Link>
        </div>
      ) : (
        <>
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
                      {child.name?.charAt(0) || child.studentName?.charAt(0) || "C"}
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
              { label: "Child Progress", icon: "📈", href: `/dashboard/parent/child-progress?studentId=${activeChild.studentId}`, color: "hover:border-amber-300" },
              { label: "Attendance Logs", icon: "📊", href: `/dashboard/parent/attendance?studentId=${activeChild.studentId}`, color: "hover:border-blue-300" },
              { label: "Exam Results", icon: "🏆", href: `/dashboard/parent/results?studentId=${activeChild.studentId}`, color: "hover:border-purple-300" },
              { label: "Leave Request", icon: "✉️", href: `/dashboard/parent/leave-request?studentId=${activeChild.studentId}`, color: "hover:border-emerald-300" },
              { label: "Translated Notices", icon: "🌐", href: "/dashboard/parent/notices", color: "hover:border-indigo-300" },
              { label: "Teacher Chat", icon: "💬", href: `/dashboard/parent/messages?studentId=${activeChild.studentId}`, color: "hover:border-rose-300" },
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
                  <span className="text-3xl font-black text-slate-900">{childStats?.attendance?.attendancePercentage ?? 0}%</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {childStats?.attendance?.attendancePercentage >= 80 ? "Regular" : "Needs Attention"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Present {childStats?.attendance?.attendances?.filter((a: any) => a.status === 'Present' || a.status === 'present').length || 0} out of {childStats?.attendance?.totalDaysMarked || 0} working days
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Standing</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">GPA {childStats?.results?.gpa?.toFixed(2) || "N/A"}</span>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Grade {childStats?.results?.overallGrade || "N/A"}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{activeChild.className} – All Terms</p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Class Information</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{activeChild.className}</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Sec {activeChild.section}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Roll Number: {activeChild.roll || "N/A"}</p>
              </div>
            </div>
          )}

          {/* Routine & Notices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Child Schedule */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">{activeChild?.name || activeChild?.studentName || "Child"}'s Routine Schedule</h2>
                <span className="text-xs font-bold text-amber-600">Today</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Classes scheduled for this day</p>

              <div className="mt-5 space-y-3">
                {childRoutine.length > 0 ? (
                  childRoutine.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{slot.subject}</span>
                          <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                            {slot.period}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{slot.teacher} • {slot.room || "TBA"}</p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-slate-500">
                    No classes scheduled for today.
                  </div>
                )}
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
                {notices.length === 0 && (
                  <div className="text-center py-6 text-sm text-slate-500">
                    No notices available at the moment.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {isLinkModalOpen && parent?.parentId && (
        <LinkChildModal
          parentId={parent.parentId}
          existingChildren={linkedChildren}
          onClose={() => setIsLinkModalOpen(false)}
          onLinked={() => {
            void reloadParent();
            setRefreshKey((key) => key + 1);
            setIsLinkModalOpen(false);
          }}
        />
      )}
    </div>
  );
}