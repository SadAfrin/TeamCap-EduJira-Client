"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function ParentAttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/stats/student-portal?studentId=STD-801`);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load child attendance:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  const percentage = data?.attendancePercentage ?? 96;
  const logs = data?.attendances ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Child Attendance Tracker</h1>
        <p className="text-xs text-slate-500 mt-1">Daily presence logs and absence alerts for Rahim Uddin (Class 8 – Sec B)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{percentage}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Regular</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Present</span>
          <p className="mt-2 text-3xl font-black text-emerald-600">22</p>
          <p className="text-xs text-slate-400 mt-1">Days this month</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Late Arrivals</span>
          <p className="mt-2 text-3xl font-black text-amber-500">1</p>
          <p className="text-xs text-slate-400 mt-1">Sep 06 (09:12 AM)</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Excused Leaves</span>
          <p className="mt-2 text-3xl font-black text-slate-700">1</p>
          <p className="text-xs text-slate-400 mt-1">Medical note attached</p>
        </div>
      </div>

      {/* Table */}
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
              {(logs.length > 0 ? logs : [
                { date: "2026-09-08", status: "Present", teacher: "Mohammad Rafiq", remarks: "On time" },
                { date: "2026-09-07", status: "Present", teacher: "Farzana Yasmin", remarks: "On time" },
                { date: "2026-09-06", status: "Late", teacher: "Mohammad Rafiq", remarks: "Arrived 09:12 AM" },
                { date: "2026-09-05", status: "Present", teacher: "Dr. Anisur Rahman", remarks: "On time" },
              ]).map((rec: any, idx: number) => (
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
                  <td className="py-3 px-4 text-slate-600">{rec.teacher || "Class Teacher"}</td>
                  <td className="py-3 px-4 text-slate-500">{rec.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
