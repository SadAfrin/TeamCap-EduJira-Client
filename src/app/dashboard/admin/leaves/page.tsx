"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type LeaveItem = {
  id: string;
  applicantType: "Student" | "Teacher";
  applicantName: string;
  classOrDesignation: string;
  startDate: string;
  endDate: string;
  reason: string;
  hasAttachment: boolean;
  status: "Pending" | "Approved" | "Rejected";
};

const INITIAL_LEAVES: LeaveItem[] = [
  {
    id: "LV-101",
    applicantType: "Student",
    applicantName: "Rahim Uddin",
    classOrDesignation: "Class 8 - Sec B",
    startDate: "2026-09-05",
    endDate: "2026-09-07",
    reason: "Viral fever and doctor recommended bed rest.",
    hasAttachment: true,
    status: "Pending",
  },
  {
    id: "LV-102",
    applicantType: "Teacher",
    applicantName: "Nasrin Sultana",
    classOrDesignation: "Chemistry Lecturer",
    startDate: "2026-09-10",
    endDate: "2026-09-11",
    reason: "Family emergency in hometown.",
    hasAttachment: false,
    status: "Pending",
  },
  {
    id: "LV-103",
    applicantType: "Student",
    applicantName: "Sabbir Rahman",
    classOrDesignation: "Class 9 - Sec A",
    startDate: "2026-08-25",
    endDate: "2026-08-26",
    reason: "Sister's wedding ceremony.",
    hasAttachment: false,
    status: "Approved",
  },
];

export default function LeaveManagementPage() {
  const [leaves, setLeaves] = useState<LeaveItem[]>(INITIAL_LEAVES);

  function handleAction(id: string, newStatus: "Approved" | "Rejected") {
    setLeaves(
      leaves.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    toast.success(`Leave request ${id} marked as ${newStatus}!`);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Leave Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review, approve, and manage leave applications submitted by parents, students, and faculty.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6 pr-3">Ref ID</th>
                <th className="py-3.5 px-3">Applicant</th>
                <th className="py-3.5 px-3">Role / Class</th>
                <th className="py-3.5 px-3">Leave Dates</th>
                <th className="py-3.5 px-3">Reason</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pr-6 pl-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 pl-6 pr-3 font-mono font-bold text-slate-800">{l.id}</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900">{l.applicantName}</td>
                  <td className="py-3.5 px-3 text-slate-600">{l.classOrDesignation}</td>
                  <td className="py-3.5 px-3 font-mono text-xs text-slate-700">{l.startDate} → {l.endDate}</td>
                  <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate">
                    {l.reason} {l.hasAttachment && <span className="text-blue-600 font-bold ml-1">📎 Doc</span>}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      l.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : l.status === "Rejected"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-3 text-right">
                    {l.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(l.id, "Approved")}
                          className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500 shadow-2xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(l.id, "Rejected")}
                          className="rounded-lg bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
