"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthRole } from "@/hooks/useAuthRole";
import toast from "react-hot-toast";

export default function StudentLeavesPage() {
  const { user } = useAuthRole();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [doctorNoteUrl, setDoctorNoteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await apiGet(`/api/leaves?studentId=STD-801`);
      if (res.success) {
        setLeaves(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      toast.error("Please fill in start date, end date, and reason.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiPost("/api/leaves", {
        studentId: (user as any)?.studentId || "STD-801",
        studentName: user?.name || "Student",
        studentEmail: user?.email || "",
        className: "Class 8",
        section: "B",
        requestedBy: "student",
        startDate,
        endDate,
        reason,
        doctorNoteUrl,
      });

      if (res.success) {
        toast.success("Leave application submitted for teacher/admin review!");
        setStartDate("");
        setEndDate("");
        setReason("");
        setDoctorNoteUrl("");
        fetchLeaves();
      } else {
        toast.error(res.message || "Failed to submit leave");
      }
    } catch (err: any) {
      toast.error(err.message || "Error submitting leave");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Leave Applications</h1>
        <p className="text-xs text-slate-500 mt-1">Submit excused absence requests with medical notes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs h-fit">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Apply for Leave</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Absence *</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Viral fever / Family emergency..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor's Note / Attachment URL</label>
              <input
                type="url"
                value={doctorNoteUrl}
                onChange={(e) => setDoctorNoteUrl(e.target.value)}
                placeholder="https://example.com/medical-certificate.pdf"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 disabled:opacity-50 mt-2"
            >
              {submitting ? "Submitting..." : "Submit Leave Request"}
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Application History & Review Status</h3>

          {loading ? (
            <p className="text-xs text-slate-400 py-8 text-center">Loading applications...</p>
          ) : leaves.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No leave applications submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {leaves.map((item) => (
                <div key={item._id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        {item.startDate} to {item.endDate} ({item.daysCount} days)
                      </span>
                      <p className="text-xs text-slate-600 mt-1">{item.reason}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.reviewRemarks && (
                    <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                      <strong>Remarks: </strong> {item.reviewRemarks} (Reviewed by {item.reviewedBy || "Staff"})
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
