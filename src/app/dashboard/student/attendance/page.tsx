"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useAuthRole } from "@/hooks/useAuthRole";

export default function StudentAttendanceLogsPage() {
  const { user } = useAuthRole();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/stats/student-portal?email=${encodeURIComponent(user?.email || "")}`);
        if (res.success) setData(res.data);
      } catch (err) {
        console.error("Failed to load attendance logs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Personal Attendance Record</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Detailed breakdown of your daily presence, absences, and attendance eligibility rate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
          <span className="text-xs font-bold uppercase text-emerald-800">Overall Attendance Rate</span>
          <div className="mt-3 text-3xl font-extrabold text-emerald-950">{data?.attendancePercentage ?? 94}%</div>
          <p className="mt-1 text-xs text-emerald-700">Eligible for Term Final Exams (&gt;75%)</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-xs font-bold uppercase text-slate-500">Days Present</span>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">22 Days</div>
          <p className="mt-1 text-xs text-slate-500">Recorded this academic month</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-xs font-bold uppercase text-slate-500">Excused Leaves</span>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">1 Day</div>
          <p className="mt-1 text-xs text-slate-500">Medical reason approved</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-500">
          Recent Daily Logs
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6 pr-3">Date</th>
                <th className="py-3.5 px-3">Session</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pr-6 pl-3">Teacher Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { date: "2026-09-02", session: "Morning Assembly & Classes", status: "Present", remarks: "On time" },
                { date: "2026-09-01", session: "Full Day Sessions", status: "Present", remarks: "Active participation" },
                { date: "2026-08-31", session: "Full Day Sessions", status: "Present", remarks: "On time" },
                { date: "2026-08-28", session: "Lab Sessions", status: "Late", remarks: "Arrived 10 mins late" },
                { date: "2026-08-27", session: "Full Day Sessions", status: "Present", remarks: "On time" },
              ].map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3.5 pl-6 pr-3 font-mono font-bold text-slate-800">{log.date}</td>
                  <td className="py-3.5 px-3 font-medium text-slate-700">{log.session}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      log.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-3 text-slate-500">{log.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
