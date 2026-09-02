"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ParentLeaveRequestPage() {
  const [formData, setFormData] = useState({
    studentName: "Rahim Uddin (Class 8-B)",
    startDate: "2026-09-08",
    endDate: "2026-09-10",
    reason: "",
    hasDoctorNote: false,
  });
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.reason) {
      toast.error("Please provide a reason for the leave request");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Leave application submitted to School Administration!");
      setFormData({ ...formData, reason: "", hasDoctorNote: false });
    }, 800);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Apply for Student Absence / Leave</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Submit digital leave applications directly to class teachers and school administrators.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Child</label>
            <input
              type="text"
              disabled
              value={formData.studentName}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Reason for Absence *</label>
            <textarea
              rows={4}
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Provide reason (e.g. Medical illness, family emergency, travel)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasDoctorNote}
                onChange={(e) => setFormData({ ...formData, hasDoctorNote: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="font-semibold">Attach Medical Certificate / Doctor's Prescription (Optional)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-amber-600 py-3 text-sm font-bold text-white shadow-md shadow-amber-600/30 hover:bg-amber-500 disabled:opacity-50"
          >
            {submitting ? "Submitting application..." : "Submit Leave Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
