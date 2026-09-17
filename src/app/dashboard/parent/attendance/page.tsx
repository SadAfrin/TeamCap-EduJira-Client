"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import LinkChildModal from "@/components/dashboard/LinkChildModal";
import { childDisplayName, useParentChildren } from "@/hooks/useParentChildren";

export default function ParentAttendancePage() {
  const { parent, children, approvedChildren, loading: childrenLoading, reload } = useParentChildren();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (approvedChildren.length === 0) {
      setSelectedStudentId("");
      return;
    }
    setSelectedStudentId((prev) =>
      approvedChildren.some((child) => child.studentId === prev) ? prev : approvedChildren[0].studentId
    );
  }, [approvedChildren]);

  useEffect(() => {
    if (!selectedStudentId) {
      setData(null);
      setLoading(false);
      return;
    }

    async function loadAttendance() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/stats/student-portal?studentId=${selectedStudentId}`);
        if (res.success) {
          setData(res.data);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Failed to load child attendance:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    void loadAttendance();
  }, [selectedStudentId]);

  const currentChild = approvedChildren.find((c) => c.studentId === selectedStudentId);
  const percentage = data?.attendancePercentage ?? 0;
  const logs = data?.attendances ?? [];
  const presentCount = logs.filter((rec: any) => String(rec.status).toLowerCase() === "present").length;
  const lateCount = logs.filter((rec: any) => String(rec.status).toLowerCase() === "late").length;
  const leaveCount = logs.filter((rec: any) =>
    ["leave", "excused", "absent"].includes(String(rec.status).toLowerCase())
  ).length;

  if (childrenLoading) {
    return <div className="p-12 text-center text-slate-500 text-sm">Loading linked children...</div>;
  }

  if (approvedChildren.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Child Attendance Tracker</h1>
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
          <h2 className="text-lg font-bold text-slate-800">No Child Linked</h2>
          <p className="text-sm text-slate-500">Link a student to view daily attendance logs.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
          >
            Add / Link Child
          </button>
        </div>
        {isModalOpen && parent?.parentId && (
          <LinkChildModal
            parentId={parent.parentId}
            existingChildren={children}
            onClose={() => setIsModalOpen(false)}
            onLinked={() => void reload()}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Child Attendance Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">
            Daily presence logs for {childDisplayName(currentChild)}
            {currentChild?.className ? ` (${currentChild.className}${currentChild.section ? ` – Sec ${currentChild.section}` : ""})` : ""}
          </p>
        </div>
        {approvedChildren.length > 1 && (
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs outline-none focus:border-amber-600"
          >
            {approvedChildren.map((c) => (
              <option key={c.studentId} value={c.studentId}>
                {childDisplayName(c)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{percentage}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {percentage >= 80 ? "Regular" : "Needs Attention"}
            </span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Present</span>
          <p className="mt-2 text-3xl font-black text-emerald-600">{presentCount}</p>
          <p className="text-xs text-slate-400 mt-1">Recorded days</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Late Arrivals</span>
          <p className="mt-2 text-3xl font-black text-amber-500">{lateCount}</p>
          <p className="text-xs text-slate-400 mt-1">From attendance logs</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Absent / Leave</span>
          <p className="mt-2 text-3xl font-black text-slate-700">{leaveCount}</p>
          <p className="text-xs text-slate-400 mt-1">Recorded absences</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Daily Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Teacher In-Charge</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Loading attendance...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No attendance records found for this child.
                  </td>
                </tr>
              ) : (
                logs.map((rec: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">{rec.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          rec.status?.toLowerCase() === "present"
                            ? "bg-emerald-100 text-emerald-800"
                            : rec.status?.toLowerCase() === "late"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{rec.teacher || rec.teacherName || "Class Teacher"}</td>
                    <td className="py-3 px-4 text-slate-500">{rec.remarks || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
